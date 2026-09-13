<div align="center">

# 🔬 Cybe: LabConnect LIMS (v2.2)
### Autonomous, Forensically Reconciled & Intelligent Enterprise Laboratory Information System
*Benchmarked against LabWare LIMS & STARLIMS for High-Throughput Clinical Pathology & Diagnostics*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![21 CFR Part 11](https://img.shields.io/badge/Compliance-21%20CFR%20Part%2011%20%7C%20ALCOA%2B-purple.svg)]()
[![ASTM / CLSI](https://img.shields.io/badge/Hardware%20Protocol-CLSI%20LIS01--A2%20%7C%20ASTM%20E1381-orange.svg)]()
[![ISO 15189](https://img.shields.io/badge/Quality%20Standard-ISO%2015189%3A2022-teal.svg)]()

</div>

---

## 📋 Table of Contents
1. [Overview & Strategic Vision](#-overview--strategic-vision)
2. [Global Benchmark vs. Legacy LIMS](#-global-benchmark-vs-legacy-lims)
3. [System Architecture](#-system-architecture)
4. [Core Clinical & Enterprise Capabilities](#-core-clinical--enterprise-capabilities)
5. [Laboratory Hardware Interfacing (Port 5100)](#-laboratory-hardware-interfacing-port-5100)
6. [21 CFR Part 11 Cryptographic Audit Trail](#-21-cfr-part-11-cryptographic-audit-trail)
7. [Getting Started & Local Deployment](#-getting-started--local-deployment)
8. [User Group Documentation](#-user-group-documentation)

---

## 🌟 Overview & Strategic Vision

**Cybe: LabConnect LIMS** is a modern clinical laboratory information management platform engineered to solve the acute failure points of legacy enterprise systems. While traditional LIMS were designed around batch pharma manufacturing or basic text-based hospital records, LabConnect addresses high-volume **clinical pathology, molecular diagnostics, and reference laboratory networks**.

### Key Value Pillars
- **Zero-Latency Data Derivation**: Native TCP/IP and serial hardware listeners on port `5100` ingest ASTM E1381/E1394 and HL7 v2.5 streams, parse specimen barcodes, compute CRC-32 checksums, and update patient reports automatically without manual technician data entry.
- **21 CFR Part 11 & ALCOA+ Data Integrity**: Immutable SHA-256 Merkle-chained audit ledger with real-time cryptographic tamper validation.
- **Dynamic Auto-Validation Engine (DAVE)**: Multivariate physiological validation (Serum Anion Gap, R-ratio, Coulter hematology rules) and delta-check variance monitoring.
- **Medical Director Digital Authorization**: Dual-factor credential/PIN re-authentication embedding certified cryptographic seals on patient reports.
- **Multi-Tier Cryogenic Biobank Matrix**: $9\times9$ Cryo Freezer Box mapper (coordinates A1–I9), $-80^\circ\text{C}$ temperature tracking, child aliquot splitting, and freeze-thaw count management.

---

## 📊 Global Benchmark vs. Legacy LIMS

| Capability / Dimension | Legacy LIMS (LabWare / STARLIMS) | Hospital EHR (Epic Beaker) | Modern Biotech (Benchling) | Cybe: LabConnect LIMS (v2.2) |
| :--- | :--- | :--- | :--- | :--- |
| **Core Architecture** | Monolithic client-server | Inpatient hospital EHR module | R&D notebook / Biopharma | **High-Throughput Clinical Diagnostics** |
| **Physical Hardware Gateway** | Third-party middleware license required | Complex HL7 interface engine | None (Manual file upload) | **Native Built-in ASTM TCP Server (Port 5100)** |
| **Bit-Level Stream Parity** | ❌ Basic text parsing | ⚠️ HL7 only | ❌ None | **✅ Raw Hex & CRC-32 Checksum Stream** |
| **Audit Ledger Integrity** | Database triggers (Admin alterable) | Relational change logs | Basic cloud audit | **✅ Cryptographic SHA-256 Hash Chained** |
| **Auto-Validation (Delta Checks)** | Complex scripting (LIMS Basic) | Standard rule engine | ❌ None | **✅ Multivariate DAVE Engine (Anion Gap, Coulter)** |
| **Pathologist E-Signature** | Password re-entry | Generic EHR sign-off | ❌ Basic checkbox | **✅ 21 CFR Part 11 Seal + Hash Stamp** |
| **Cryogenic Biobank Matrix** | Paid add-on module | ❌ Minimal support | ⚠️ Plate-focused | **✅ 9x9 Freezer Box (A1-I9) & Aliquot Split** |
| **User Interface Response** | Legacy desktop client (>1s latency) | Dense EHR forms | Modern Web | **✅ Sub-100ms Micro-Animated React 19 UI** |

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Client Layer [Frontend Presentation - React 19 & Tailwind]
        UI1[Receptionist & Intake Portal]
        UI2[Phlebotomy & Thermal Label Spooler]
        UI3[Hardware Bench & Port Parity]
        UI4[Pathology Authorization & 21 CFR Sign]
        UI5[Biobank Cryo Matrix Modal]
        UI6[Quality & Compliance Cockpit]
    end

    subgraph Service Layer [Express & Node.js Micro-Services]
        API[Typed REST API Layer]
        SSE[Server-Sent Events Gateway]
        TCP[Physical ASTM/HL7 TCP Listener - Port 5100]
        DAVE[Dynamic Auto-Validation Engine]
    end

    subgraph Persistence Layer [Atomic Engine & Cryptographic Ledger]
        DB[(Atomic Transactional JSON Store - Postgres Ready)]
        LEDGER[(21 CFR Part 11 SHA-256 Chained Audit Ledger)]
    end

    subgraph Physical Hardware [Laboratory Instruments]
        A1[Automated Chemistry Analyzer - Roche Cobas / Mindray]
        A2[5-Part Hematology Counter - Sysmex XN / Coulter]
        A3[Serial RS-232 Device via Moxa NPort Server]
    end

    Physical Hardware -->|CLSI LIS01-A2 / ASTM E1381| TCP
    TCP --> DAVE
    DAVE --> DB
    DAVE --> LEDGER
    TCP --> SSE
    SSE --> UI3
    API <--> UI1 & UI2 & UI4 & UI5 & UI6
    API <--> DB & LEDGER
```

---

## 🔬 Core Clinical & Enterprise Capabilities

### 1. Patient Registration & B2B Referral Registry
- **Walk-in Desk (B2C)**: Comprehensive demographics, insurance details, UHID/MRN generation, and payment billing receipts.
- **Corporate Desk (B2B)**: Institutional contract pricing, volume tier discounting, and company ledger reconciliation.

### 2. Phlebotomy & Thermal Barcode Spooler
- Queue filtering by clinical priority (`Routine`, `Urgent`, `STAT`).
- High-density Code 128 thermal tube barcode printer generating accession markers, department identifiers, and specimen types (Serum, EDTA Whole Blood, Sodium Citrate, Fluoride).

### 3. Hardware Bench & Port Parity Engine
- Direct connection to analyzer feeds with live stream inspection.
- Real-time CRC-32 checksum calculation and bit-level verification against thermal printouts.

### 4. 21 CFR Part 11 Pathologist Authorization
- Dual-factor re-authentication modal requiring user credentials and PIN.
- Mandatory legal intent declarations.
- Direct report stamping with verified SHA-256 digital seals and ALCOA+ compliance badges.

### 5. Multi-Tier Biobank Cryo Matrix
- Interactive $9\times9$ grid (81 coordinate wells: A1 to I9).
- $-80^\circ\text{C}$ temperature telemetry.
- Parent-to-child aliquot splitting (`ALQ-...`), volume tracking ($\mu\text{L}$), and freeze-thaw cycle monitoring.

---

## 🔌 Laboratory Hardware Interfacing (Port 5100)

The system includes a dedicated TCP socket listener on port **`5100`** implementing **CLSI LIS01-A2 / ASTM E1381** and **HL7 v2.5** protocols.

### Direct Ethernet Setup
1. Configure your analyzer's host settings:
   - **Host IP**: `<LIMS_SERVER_IP>`
   - **Host Port**: `5100`
   - **Protocol**: `ASTM E1381 / E1394` or `CLSI LIS01-A2`
   - **Mode**: `TCP/IP Client`
2. When the analyzer processes a sample, it transmits the result frame.
3. The server validates the packet with CRC-32, matches the specimen barcode, updates the patient record to `'Completed'`, and logs the action in the audit trail.

### Legacy Serial Setup (RS-232)
- Connect older DB9 analyzers using a **Serial-to-Ethernet Device Server** (e.g. *Moxa NPort 5110* or *Digi One SP*).
- Route the Moxa serial stream to target TCP port `5100`.

---

## 🛡️ 21 CFR Part 11 Cryptographic Audit Trail

Every state change across the system is recorded in an immutable ledger with SHA-256 hash chaining:

$$\text{currentHash} = \text{SHA256}(\text{sequence} + \text{timestamp} + \text{actor} + \text{action} + \text{entity} + \text{data} + \text{previousHash})$$

- **Continuous Tamper Detection**: Any direct alteration of historical files breaks the Merkle chain.
- **One-Click Audit Verification**: In **Quality & Compliance $\rightarrow$ 21 CFR Part 11 Audit Ledger**, click **"Verify Cryptographic Chain"** to confirm the mathematical validity of the complete database.

---

## 🚀 Getting Started & Local Deployment

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- npm (v9.0 or higher)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/selva-aiprojects/labconnect.git
cd labconnect

# 2. Install dependencies
npm install

# 3. Verify TypeScript build
npm run lint

# 4. Start the LIMS server (Express API + Vite + ASTM TCP Port 5100)
npm run dev
```

### Accessing the System
- **Web Application**: Open [http://localhost:3000](http://localhost:3000) in any modern web browser.
- **ASTM Analyzer Gateway**: Listening live on `127.0.0.1:5100`.

---

## 📚 User Group Documentation

For detailed operating guides, technician SOPs, and user group training materials, refer to:
- 📖 [**User Group Operating Guide & Manual (USER_GROUP_GUIDE.md)**](docs/USER_GROUP_GUIDE.md)
- 📐 [**Enterprise Product Requirements Document (PRD.md)**](PRD.md)

---

### License & Compliance
This software is developed for clinical laboratory operations and adheres to **ISO 15189:2022**, **FDA 21 CFR Part 11**, **CLSI LIS01-A2**, and **CAP LAP** regulatory frameworks.
