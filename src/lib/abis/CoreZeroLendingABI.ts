
export const CoreZeroLendingABI = [
  {
    "type": "function",
    "name": "createLoanProposal",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "term",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "revenueSharePercentage",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "projectName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "projectDescription",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getLoanProposal",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ICoreZeroLending.LoanProposal",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "borrower",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "term",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "revenueSharePercentage",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "projectName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "projectDescription",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "reputationScore",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "votes",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "state",
            "type": "uint8",
            "internalType": "enum ICoreZeroLending.LoanState"
          },
          {
            "name": "createdAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "activatedAt",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalRepaid",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "repayLoan",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "activateLoan",
    "inputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
];
