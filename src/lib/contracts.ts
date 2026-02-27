export const NEXUS_COMPUTE_ADDRESS = '0x38E8e242Ea91F6896BE56675a60ec8199DE48B88';

export const NEXUS_COMPUTE_ABI = [
  {
    "inputs": [],
    "name": "registerProvider",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_modelUri", "type": "string" }
    ],
    "name": "createTask",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_taskId", "type": "uint256" },
      { "internalType": "string", "name": "_resultUri", "type": "string" }
    ],
    "name": "completeTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "providers",
    "outputs": [
      { "internalType": "address", "name": "wallet", "type": "address" },
      { "internalType": "bool", "name": "isActive", "type": "bool" },
      { "internalType": "uint256", "name": "totalTasksCompleted", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "tasks",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "address", "name": "developer", "type": "address" },
      { "internalType": "address", "name": "provider", "type": "address" },
      { "internalType": "uint256", "name": "reward", "type": "uint256" },
      { "internalType": "string", "name": "modelUri", "type": "string" },
      { "internalType": "string", "name": "resultUri", "type": "string" },
      { "internalType": "bool", "name": "isCompleted", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextTaskId",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;