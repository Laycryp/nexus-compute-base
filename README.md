# Nexus Compute

Decentralized AI Power, Scaled on Base. Nexus Compute is a micro-compute DePIN (Decentralized Physical Infrastructure Network) layer that connects idle GPU providers with AI developers requiring computation power, utilizing smart contracts for trustless task management and automated reward escrow.

## Architecture

The protocol is built with a clear separation of concerns to ensure scalability and trust:

* **Smart Contracts (Base Sepolia):** A robust Escrow and Registry system built with Solidity. It handles provider registration, locks developer funds, and securely releases rewards upon task completion.
* **Web Application:** A high-performance interface built with Next.js 16 (App Router), Tailwind CSS, Wagmi v2, and RainbowKit. It features two distinct dashboards for Developers (Task Deployment) and Providers (Node Registration).
* **Provider Node Simulator:** A Node.js background daemon utilizing `viem` to actively poll the Base network, detect new computation tasks, simulate GPU processing, and automatically claim rewards on behalf of the registered provider.

## Technology Stack

* **Network:** Base (EVM Layer 2)
* **Frontend:** React 18, Next.js, Tailwind CSS
* **Web3 Integration:** Wagmi v2, Viem, RainbowKit
* **Backend/Node:** Node.js (Simulator)

## Running the Protocol Locally

To run the full DePIN lifecycle on your local machine, you need to start both the frontend interface and the provider node simulator.

### 1. Environment Variables
Create a `.env.local` file in the root directory and add your provider wallet private key:
```env
PROVIDER_PRIVATE_KEY=0xYourPrivateKeyHere

Note: A .env.example is provided for reference. Never commit your actual .env.local.

### 2. Start the Provider Node Simulator
Open a terminal instance and start the daemon to listen for Base network tasks: node scripts/simulator.mjs

### 3. Start the Web Interface
Open a separate terminal instance and launch the Next.js development server: npm run dev

Navigate to http://localhost:3000 to interact with the protocol.

Contract Addresses
NexusCompute (Base Sepolia): 0x38E8e242Ea91F6896BE56675a60ec8199DE48B88

License
This project is licensed under the MIT License.