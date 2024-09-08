# Real You: Authentic Moments, Genuine Connections

![Real You Logo](frontend/assets/images/iOS.png)

Real You is a revolutionary social media app that prioritizes authenticity and genuine interactions. In a world saturated with edited and AI-generated content, Real You stands out by ensuring that every shared moment is real, unfiltered, and captured in the present.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/ferrabled/real-you.svg)](https://github.com/ferrabled/real-you/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/ferrabled/real-you.svg)](https://github.com/ferrabled/real-you/issues)

## Table of Contents

- [Deployments](#deployments)
- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Why Real You?](#why-real-you)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Technical Stack](#technical-stack)
- [Future Improvements](#future-improvements)

## Deployments
Here are the deployments that we made to the blockchain:
- [MORPH deployment](https://explorer-holesky.morphl2.io/address/0x17b8D21d322C250607ee0DA92f4a4ECA094bf9E0) - 0x17b8D21d322C250607ee0DA92f4a4ECA094bf9E0
- [SIGN PROTOCOL schema](https://testnet-scan.sign.global/schema/onchain_evm_11155111_0x82) - onchain_evm_11155111_0x82
- [GALADRIEL deployment](https://explorer.galadriel.com/address/0xF6b705595E95c8D94E22B38570e79f8BaFa39558) - 0xF6b705595E95c8D94E22B38570e79f8BaFa39558
- XMTP consists in one EOA for each of the tags available in Real You: Nature, Food, Travel, Sports, People, Pets, Art & Fashion. The notification system chooses one account depending on the tag.

## Overview

Real You is designed to bring back the joy of genuine, unfiltered moments in social media. Our platform ensures that every photo shared is captured in real-time, verified for authenticity, and securely stored on the blockchain.

## Key Features

📸 **Live Capture Only** \
Say goodbye to curated feeds and hello to spontaneity! Real You only allows photos taken directly through the app's camera. No uploads from your camera roll – every moment is fresh and authentic.

🤖 **AI Detection** \
We use GPT-4 Vision technology through Galadriel to analyze each photo, ensuring it's not AI-generated or edited. We keep them real!

🏷️ **Smart Tagging** \
AI automatically generates relevant tags for your photos, making them easily discoverable by others who share your interests.

✅ **Blockchain Verification** \
Every photo is verified and its metadata is stored on the Morph blockchain, creating an immutable record of your authentic moments.

🔍 **Interest-Based Discovery** \
Subscribe to tags that interest you and never miss a moment that matters to you. Whether it's #Nature, #Food, or #Travel, find your tribe!

🏆 **Themed Contests** \
Participate in exciting photo contests centered around specific themes. Showcase your creativity, vote for your favorites, and win prizes sponsored by partner companies.

## How It Works

1. **Snap a real moment**: Take a photo directly through the Real You app.
2. **Upload**: Your photo is securely uploaded to IPFS.
3. **Analyze**: Our AI scans the photo, generating tags and ensuring authenticity.
4. **Attest**: An attestation is created, linking your photo, tags, and user data.
5. **Verify**: The photo's metadata is recorded on the Morph blockchain.
6. **Share**: Your authentic moment is now part of the Real You community!

## Why Real You?

In an era of filters, edits, and AI-generated images, Real You brings back the joy of genuine, unfiltered moments. We're building a community where authenticity is celebrated, and every shared experience is a true reflection of life as it happens.

## Quick Start

To get started with Real You:

1. Clone the repository:

   ```
   git clone https://github.com/ferrabled/real-you
   cd real-you/frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   ```
   cp .env.example .env
   ```

   Edit the `.env` file with your specific configuration.

4. Run the Expo development server:

   ```
   npx expo
   ```

5. Install Expo Go (iOS & Android) and scan the QR Code

## Architecture

Real You's architecture is composed of several key components:

1. **Frontend**: React Native app for cross-platform mobile support.
2. **Backend**: Node.js server handling API requests and business logic.
3. **Blockchain Integration**: Smart contracts on the Morph blockchain for photo verification.
4. **AI Analysis**: Integration with GPT-4 Vision via Galadriel Smart Contract for photo analysis and tagging.
5. **Attestations**: Attestations services within a Schema deployed by Sign Protocol.
6. **Decentralized Storage**: IPFS for secure and distributed photo storage.

## Technical Stack

- Frontend: React Native
- Backend: Node.js
- Blockchain: Morph
- AI Analysis: GPT-4 Vision via Galadriel
- Storage: IPFS

## Future Improvements

We're constantly working to improve Real You. Some areas we're exploring:

1. **Enhanced Privacy Features**: Implementing advanced encryption for user data.
2. **Decentralized Identity**: Integrating DIDs for user authentication and profile management.
3. **Hardware based attestations**: To permit new devices, as cameras could use Real You platform.
4. **Cross-Chain Compatibility**: Expanding blockchain support beyond Morph.

---

Join us in creating a space where real moments shine, genuine connections flourish, and every photo tells a true story. Ready to get real? Download Real You today and start sharing your authentic self with the world!
