export const CONTRACT_ADDRESS =
  "0xb2cdb876c4705776be5e97918f78fc385c27d998" as `0x${string}`;
export const abi = [
  {
    type: "function",
    name: "createRoom",
    inputs: [{ name: "fee", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getRoomCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRoomEntryFee",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRoomOwner",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRoomPlayers",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRoomWinner",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalPrize",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isRoomSettled",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "joinRoom",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "rooms",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "entryFee", type: "uint256", internalType: "uint256" },
      { name: "settled", type: "bool", internalType: "bool" },
      { name: "winner", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "settle",
    inputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "winner", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Joined",
    inputs: [
      { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
      {
        name: "player",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoomCreated",
    inputs: [
      { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      { name: "fee", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Settled",
    inputs: [
      { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
      {
        name: "winner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "prize",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "ReentrancyGuardReentrantCall", inputs: [] },
] as const;
