export const REALYOU_CONTRACT_ADDRESS = "0x17b8D21d322C250607ee0DA92f4a4ECA094bf9E0";
export const REALYOU_CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "topic",
				"type": "string"
			}
		],
		"name": "ContestCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "photoId",
				"type": "uint256"
			}
		],
		"name": "PhotoAddedToContest",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "photoId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "PhotoUploaded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "username",
				"type": "string"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "photoId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "VoteCast",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_photoId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_contestId",
				"type": "uint256"
			}
		],
		"name": "addPhotoToContest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contestCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contestVotes",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contests",
		"outputs": [
			{
				"internalType": "string",
				"name": "topic",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_topic",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			}
		],
		"name": "createContest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contestId",
				"type": "uint256"
			}
		],
		"name": "endContest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_startId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_endId",
				"type": "uint256"
			}
		],
		"name": "getAllPhotos",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "ipfsHash",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "inContest",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "contestId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "votes",
						"type": "uint256"
					}
				],
				"internalType": "struct RealYou.Photo[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contestId",
				"type": "uint256"
			}
		],
		"name": "getContestDetails",
		"outputs": [
			{
				"internalType": "string",
				"name": "topic",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "uint256[]",
				"name": "photoIds",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contestId",
				"type": "uint256"
			}
		],
		"name": "getContestLeaderboard",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "photoIds",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "voteCounts",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contestId",
				"type": "uint256"
			}
		],
		"name": "getContestPhotos",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "ipfsHash",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "inContest",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "contestId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "votes",
						"type": "uint256"
					}
				],
				"internalType": "struct RealYou.Photo[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_photoId",
				"type": "uint256"
			}
		],
		"name": "getPhotoDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "inContest",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "votes",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "getUserProfile",
		"outputs": [
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "reputation",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "photoCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "photos",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "inContest",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "contestId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "votes",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "uploadPhoto",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "reputation",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_photoId",
				"type": "uint256"
			}
		],
		"name": "voteForPhoto",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
