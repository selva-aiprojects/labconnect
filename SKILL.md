---
name: read-image
description: Inspects, analyzes, and extracts text or visual details from image files (PNG, JPG, WEBP) provided in the workspace or prompt.
---

# Read and Analyze Image

## Goal
Safely load, process, and analyze image assets to extract structured text, UI layout details, data visualizations, or general visual descriptions.

## Instructions
1. **Locate the Image**: Identify the target file path from the user's prompt or locate the image asset inside the project's `assets/` or workspace directories.
2. **Validation Check**: Verify that the file exists and is a supported format (`.png`, `.jpg`, `.jpeg`, `.webp`).
3. **Execute Analysis**: 
   - Pass the image file reference directly to your multimodal context window.
   - If deeper programmatic extraction (such as OCR or color palette profiling) is needed, invoke the helper script `scripts/analyze.py`.
4. **Synthesize Findings**: Structure your response clearly based on what the user requested:
   - **UI/UX Design**: Detail layout components, spacing, colors, and typography cues.
   - **Data/Charts**: Summarize axes, legends, data trends, and exact values if readable.
   - **General/OCR**: Transcribe any visible text accurately or describe visual subjects in detail.

## Constraints
- Do not hallucinate details obscured by low resolution or heavy compression.
- If the image path is invalid or unreadable, report the error immediately without guessing the contents.
