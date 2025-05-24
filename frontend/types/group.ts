export interface Group {
  id: string; // UUID or tx hash
  name: string;
  owner: string; // 0x address
  entryFeeEth: string; // display-ready (e.g. "0.05")
  participants: string[]; // addresses
  settled: boolean;
  winner?: string; // address
  createdAt: string; // ISO
}

export interface CreateGroupParams {
  name: string;
  entryFeeEth: string;
}

export interface JoinGroupParams {
  groupId: string;
  userAddress: string;
}

export interface SettleGroupParams {
  groupId: string;
  winnerAddress: string;
}
