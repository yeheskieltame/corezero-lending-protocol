
export const BTCInsurancePoolABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_btcToken",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_stCoreToken",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_coreToken",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stakeBTC",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stakeSTCore",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "stakeDual",
    "inputs": [
      {
        "name": "btcAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "stCoreAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unstake",
    "inputs": [
      {
        "name": "btcAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "stCoreAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "success",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimRewards",
    "inputs": [],
    "outputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getCurrentAPY",
    "inputs": [
      {
        "name": "stakeType",
        "type": "uint8",
        "internalType": "enum IBTCInsurancePool.StakeType"
      }
    ],
    "outputs": [
      {
        "name": "apy",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getStakerInfo",
    "inputs": [
      {
        "name": "staker",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct IBTCInsurancePool.Staker",
        "components": [
          {
            "name": "btcAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "stCoreAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "stakingStartTime",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "rewardsClaimed",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "stakeType",
            "type": "uint8",
            "internalType": "enum IBTCInsurancePool.StakeType"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalStaked",
    "inputs": [],
    "outputs": [
      {
        "name": "btcAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "stCoreAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
];
