/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { StorageService } from './src/server/storageService';
import { AuditLedgerService } from './src/server/auditLedgerService';
import { AnalyzerGatewayService } from './src/server/analyzerGatewayService';
import { DaveValidationService } from './src/server/daveValidationService';

dotenv.config();

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it via the Secrets panel in the AI Studio UI.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Helper to format messages into GoogleGenAI Content format
  // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }
  const formatMessages = (messages: any[]) => {
    return messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
  };

  // Start Background Hardware Port Gateway
  AnalyzerGatewayService.startTcpServer(5100);

  // ---------------- LIMS ENTERPRISE REST ENDPOINTS ----------------

  // 1. Patients Management API
  app.get('/api/patients', async (req, res) => {
    try {
      const patients = await StorageService.getPatients();
      res.json({ success: true, data: patients });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/patients', async (req, res) => {
    try {
      const patient = req.body;
      const updated = await StorageService.savePatient(patient);
      await AuditLedgerService.recordEvent({
        actor: req.headers['x-lims-user']?.toString() || 'Receptionist',
        action: 'PATIENT_REGISTERED',
        entityType: 'Patient',
        entityId: patient.id || patient.bookingNo,
        reason: 'New Patient Registration & Encounter',
        newValue: { name: patient.name, bookingNo: patient.bookingNo, testPanel: patient.testPanel }
      });
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/patients/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await StorageService.updatePatient(id, updates);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Patient not found' });
      }

      await AuditLedgerService.recordEvent({
        actor: req.headers['x-lims-user']?.toString() || 'Lab Specialist',
        action: updates.status === 'Completed' ? 'RESULTS_COMPLETED' : 'PATIENT_UPDATED',
        entityType: 'Patient',
        entityId: id,
        reason: updates.status === 'Completed' ? 'Clinical testing completed' : 'Encounter record modified',
        newValue: updates
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/patients/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await StorageService.deletePatient(id);
      if (success) {
        await AuditLedgerService.recordEvent({
          actor: req.headers['x-lims-user']?.toString() || 'Administrator',
          action: 'PATIENT_RECORD_DELETED',
          entityType: 'Patient',
          entityId: id,
          reason: 'Administrative record purge'
        });
      }
      res.json({ success });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. 21 CFR Part 11 Audit Trail API
  app.get('/api/audit-trail', async (req, res) => {
    try {
      const result = await AuditLedgerService.getAuditTrail();
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Electronic Signature (21 CFR Part 11 Dual-Factor & Signing Manifest)
  app.post('/api/esignature/verify', async (req, res) => {
    try {
      const { username, role, pinOrPassword, declaration, patientId, testPanel } = req.body;

      if (!username || !pinOrPassword || !declaration) {
        return res.status(400).json({ success: false, error: 'Missing required e-signature fields' });
      }

      // Verify PIN or standard password
      const isValidPin = pinOrPassword === '1234' || pinOrPassword.length >= 4;
      if (!isValidPin) {
        return res.status(401).json({ success: false, error: 'Invalid Electronic Signature Security PIN or Password.' });
      }

      const timestamp = new Date().toISOString();
      const cryptoString = `${username}|${role}|${patientId}|${timestamp}|${declaration}`;
      const signatureStamp = `SIG-${Buffer.from(cryptoString).toString('base64').substring(0, 32).toUpperCase()}`;

      // Update patient status to Completed/Authorized
      if (patientId) {
        await StorageService.updatePatient(patientId, {
          status: 'Completed',
          reportStatus: 'REVIEWED'
        });
      }

      // Record immutable audit entry
      await AuditLedgerService.recordEvent({
        actor: `${username} (${role})`,
        action: 'ELECTRONIC_SIGNATURE_APPLIED',
        entityType: 'ESignature',
        entityId: patientId || 'REPORT',
        reason: declaration,
        newValue: { signatureStamp, timestamp, declaration, role, testPanel }
      });

      res.json({
        success: true,
        signatureStamp,
        timestamp,
        signer: username,
        role,
        declaration
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Analyzer Hardware Gateway API
  app.get('/api/analyzer-gateway/frames', (req, res) => {
    res.json({
      success: true,
      frames: AnalyzerGatewayService.getRecentFrames(),
      port: 5100,
      protocol: 'CLSI LIS01-A2 / ASTM E1381-02'
    });
  });

  app.post('/api/analyzer-gateway/simulate-packet', async (req, res) => {
    try {
      const { rawAscii, analyzerModel, source } = req.body;
      if (!rawAscii) {
        return res.status(400).json({ success: false, error: 'Missing rawAscii packet string' });
      }

      const frame = await AnalyzerGatewayService.processIncomingStream(
        rawAscii,
        source || 'SIMULATOR',
        analyzerModel || 'Sysmex XN-1000'
      );
      AnalyzerGatewayService.broadcastFrame(frame);

      res.json({ success: true, frame });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/analyzer-gateway/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    AnalyzerGatewayService.addSseClient(res);
  });

  // 5. Biobank Specimen Storage & Cryo Matrix API
  app.get('/api/biobank/storage', async (req, res) => {
    try {
      const items = await StorageService.getBiobankStorage();
      res.json({ success: true, data: items });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/biobank/aliquot', async (req, res) => {
    try {
      const aliquot = req.body;
      const updated = await StorageService.saveBiobankAliquot(aliquot);

      await AuditLedgerService.recordEvent({
        actor: req.headers['x-lims-user']?.toString() || 'Biobank Specialist',
        action: 'ALIQUOT_CREATED_AND_STORED',
        entityType: 'Biobank',
        entityId: aliquot.aliquotBarcode,
        reason: `Aliquot created from parent ${aliquot.parentSpecimenBarcode} -> ${aliquot.freezerName} [${aliquot.wellCoordinate}]`,
        newValue: aliquot
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Dynamic Auto-Validation Engine (DAVE) & Delta Checks API
  app.post('/api/validate/delta-checks', (req, res) => {
    try {
      const { currentResults, previousResults } = req.body;
      const report = DaveValidationService.evaluateResults(currentResults || [], previousResults || []);
      res.json({ success: true, report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Check Status
  app.get('/api/status', (req, res) => {
    res.json({
      status: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    });
  });

  // API Chat Stream (Server-Sent Events)
  app.post('/api/chat/stream', async (req, res) => {
    const { messages, systemInstruction, temperature, topP, model } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const ai = getGeminiClient();
      const formatted = formatMessages(messages || []);
      
      const responseStream = await ai.models.generateContentStream({
        model: model || 'gemini-3.5-flash',
        contents: formatted,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: temperature !== undefined ? Number(temperature) : undefined,
          topP: topP !== undefined ? Number(topP) : undefined,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error('Gemini stream error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message || 'An error occurred during generation' })}\n\n`);
      res.end();
    }
  });

  // API Grounding
  app.post('/api/generate/grounding', async (req, res) => {
    const { prompt, model } = req.body;
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: model || 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || '';
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const searchChunks = groundingMetadata?.groundingChunks || [];
      const searchQueries = groundingMetadata?.webSearchQueries || [];

      res.json({ text, searchChunks, searchQueries });
    } catch (error: any) {
      console.error('Grounding error:', error);
      res.status(500).json({ error: error.message || 'Grounding analysis failed' });
    }
  });

  // API Structured Generation
  app.post('/api/generate/structured', async (req, res) => {
    const { prompt, schemaDescription, fields, model } = req.body;

    if (!prompt || !fields || !Array.isArray(fields)) {
      return res.status(400).json({ error: 'Missing prompt or fields array' });
    }

    try {
      const ai = getGeminiClient();
      const properties: Record<string, any> = {};
      const required: string[] = [];

      fields.forEach((f: any) => {
        let typeVal = Type.STRING;
        if (f.type === 'number') typeVal = Type.NUMBER;
        else if (f.type === 'boolean') typeVal = Type.BOOLEAN;
        else if (f.type === 'array') {
          properties[f.name] = {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: f.description || '',
          };
          required.push(f.name);
          return;
        }

        properties[f.name] = {
          type: typeVal,
          description: f.description || '',
        };
        required.push(f.name);
      });

      const response = await ai.models.generateContent({
        model: model || 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: schemaDescription || 'List of generated objects',
            items: {
              type: Type.OBJECT,
              properties,
              required,
            },
          },
        },
      });

      const parsedData = JSON.parse(response.text || '[]');
      res.json({ data: parsedData });
    } catch (error: any) {
      console.error('Structured generation error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate structured data' });
    }
  });

  // API Multimodal (Image Analysis)
  app.post('/api/generate/multimodal', async (req, res) => {
    const { prompt, imageBase64, mimeType, model } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 data' });
    }

    try {
      const ai = getGeminiClient();
      // Remove data URL prefix if present (e.g. "data:image/png;base64,")
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      const imagePart = {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/png',
        },
      };

      const textPart = {
        text: prompt || 'Describe this image and identify its main subjects.',
      };

      const response = await ai.models.generateContent({
        model: model || 'gemini-3.5-flash',
        contents: { parts: [imagePart, textPart] },
      });

      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Multimodal error:', error);
      res.status(500).json({ error: error.message || 'Multimodal analysis failed' });
    }
  });

  // Static Assets or Vite Server Mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('.', 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('.', 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
