# EgoChain: Independent Blockchain Cloud
## Deployment & Egypt Compliance Guide

### 1. Project Architecture
- *Desktop (Electron):* Local management and private key storage.
- *Blockchain Core:* Independent Node.js implementation with Revert capability.
- *Sync Engine:* Automated GitHub/Netlify CI/CD integration.

### 2. Security Protocol (The Revert Feature)
Transactions without an authorized *Trade Key* (signed by the origin owner) are flagged. 
The admin can trigger a *Forensic Revert* to restore funds, ensuring protection against unauthorized transfers.

### 3. Egyptian Cyber-Law Compliance
- *Transparency:* Read-Only API for CBE (Central Bank of Egypt) monitoring.
- *Data Privacy:* Personal IDs are hashed; private keys never leave the local device.
- *Non-Repudiation:* Every trade is digitally signed via RSA-2048.

### 4. How to Run
1. Run npm install
2. Configure .env with your GitHub/Netlify tokens.
3. Launch via npm start.