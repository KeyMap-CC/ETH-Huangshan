# 🧬 Delong - Privacy-Preserving Computation Platform for Biomedical Data
## 小熊  张恒鸣 smiley
## 📌 Overview

Delong is a trustless privacy-preserving computation platform specifically designed for longevity and biomedical research. It leverages blockchain governance combined with Trusted Execution Environment (TEE) technology, enabling researchers to analyze sensitive biomedical data securely without compromising privacy. Currently, the platform operates on [Phala Network](https://phala.network/), utilizing its extensive network of TEE nodes and on-chain DAO governance for algorithm approval and execution.

This repository contains the fully open-sourced code running inside the Delong platform's TEE instances. The primary purpose of this open-source effort is to allow users and security auditors to verify that the code running within Phala’s Confidential Virtual Machine (CVM) aligns exactly with this publicly accessible source code, adhering to a true "trust but verify" principle.

## 💡 Motivation

Biomedical and longevity research relies on sensitive personal data, such as genomic profiles and diagnostic records. While Trusted Execution Environments (TEEs) ensure secure, privacy-preserving computation, transparency and incentive alignment require a broader trust model.

Delong combines blockchain with TEE to achieve:

- 🔐 Secure and encrypted storage of user-contributed bio-data
- 🧪 Confidential execution of algorithms without exposing raw data
- 🧾 Immutable on-chain records of all data usage and algorithm executions
- 🧑‍⚖️ Community-driven audit of algorithm safety via decentralized governance
- 💎 Tokenized incentives: data contributors are rewarded with Dataset Tokens and evolution NFTs based on actual usage of their data
- 🎓 Verifiable scientific impact: contributors can trace how their data enabled real research outcomes

By recording every data contribution and algorithm usage on-chain, Delong enables **verifiable attribution**, **trustless governance**, and **sustainable token-driven participation**, empowering both researchers and citizen contributors in an open, auditable, and privacy-first scientific ecosystem.

## 🚀 Key Features

* **🔒 Data Privacy**: Data is encrypted at all times, decrypted only briefly within the TEE for computation, protecting sensitive information from any external party.
* **✅ Trustworthy Execution**: All computations are isolated within secure TEE hardware, ensuring algorithms executed are pre-approved by decentralized blockchain governance.
* **👀 Transparency and Auditability**: Every critical operation, from data submission to algorithm execution, is logged transparently on-chain, facilitating community oversight.
* **⚡ Scalable & Efficient**: Leveraging thousands of globally distributed TEE nodes provided by Phala Network ensures scalable performance with robust parallel computation capabilities.

## 🛠️ Architectural Overview

Delong adopts a comprehensive blockchain + TEE hybrid architecture that combines secure, transparent on-chain contract operations with privacy-preserving off-chain TEE computations. Our architecture follows an event-driven approach, minimizing on-chain state storage and maximizing transparency, efficiency, and security.

### Core Components:

* **AlgorithmReview Contract**: Handles the governance and auditing of algorithms submitted by researchers. A controlled committee initially reviews algorithms for potential data leakage. Auditing results are transparently emitted as blockchain events. This system plans to transition from centralized committees to a decentralized, token-based governance model involving relevant stakeholders and AI-assisted auditing.

* **DataContribution Contract**: Records user data contributions and usage behaviors transparently on-chain through events. Data contributions are managed off-chain with TEE-backed systems, ensuring secure, private data processing.

* **Off-Chain System**: Executes approved algorithms securely off-chain within TEE nodes, providing robust data confidentiality and execution integrity.