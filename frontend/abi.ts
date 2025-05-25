export const CONTRACT_ADDRESS =
  "0x679b6A75E47E2e0118c26FbdbC987e86A7De5a26" as `0x${string}`;
export const abi = [
  {
    type: "function",
    name: "createRoom",
    inputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "fee", type: "uint256", internalType: "uint256" },
    ],
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
    name: "getRoomInfo",
    inputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct LockedInRooms.RoomInfo",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "name", type: "string", internalType: "string" },
          { name: "owner", type: "address", internalType: "address" },
          { name: "entryFee", type: "uint256", internalType: "uint256" },
          { name: "players", type: "address[]", internalType: "address[]" },
          { name: "settled", type: "bool", internalType: "bool" },
          { name: "winner", type: "address", internalType: "address" },
          { name: "totalPrize", type: "uint256", internalType: "uint256" },
          { name: "playerCount", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRoomInfoBatch",
    inputs: [{ name: "ids", type: "uint256[]", internalType: "uint256[]" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct LockedInRooms.RoomInfo[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "name", type: "string", internalType: "string" },
          { name: "owner", type: "address", internalType: "address" },
          { name: "entryFee", type: "uint256", internalType: "uint256" },
          { name: "players", type: "address[]", internalType: "address[]" },
          { name: "settled", type: "bool", internalType: "bool" },
          { name: "winner", type: "address", internalType: "address" },
          { name: "totalPrize", type: "uint256", internalType: "uint256" },
          { name: "playerCount", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
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
      { name: "name", type: "string", internalType: "string" },
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
      { name: "name", type: "string", indexed: false, internalType: "string" },
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
