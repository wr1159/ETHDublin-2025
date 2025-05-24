import {
  Group,
  CreateGroupParams,
  JoinGroupParams,
  SettleGroupParams,
} from "@/types/group";
import { abi, CONTRACT_ADDRESS } from "@/abi";
import { Abi, parseEther } from "viem";

/**
 * Real contract interaction functions using OnChainKit
 * These return transaction data that can be used with OnChainKit Transaction component
 */

export interface TransactionCall {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  value?: bigint;
}

export async function createRoomOnChain(
  params: CreateGroupParams,
): Promise<TransactionCall[]> {
  const entryFeeWei = parseEther(params.entryFeeEth);

  return [
    {
      address: CONTRACT_ADDRESS,
      abi: abi as Abi,
      functionName: "createRoom",
      args: [entryFeeWei],
    },
  ];
}

export async function joinRoomOnChain(
  params: JoinGroupParams,
  entryFeeEth: string,
): Promise<TransactionCall[]> {
  const entryFeeWei = parseEther(entryFeeEth);

  return [
    {
      address: CONTRACT_ADDRESS,
      abi: abi as Abi,
      functionName: "joinRoom",
      args: [BigInt(params.groupId.replace("group_", ""))],
      value: entryFeeWei,
    },
  ];
}

export async function settleRoomOnChain(
  params: SettleGroupParams,
): Promise<TransactionCall[]> {
  return [
    {
      address: CONTRACT_ADDRESS,
      abi: abi as Abi,
      functionName: "settle",
      args: [
        BigInt(params.groupId.replace("group_", "")),
        params.winnerAddress as `0x${string}`,
      ],
    },
  ];
}

// Read functions for fetching data from the blockchain
export async function fetchGroupsFromChain(): Promise<Group[]> {
  // TODO: Implement contract reads to fetch all groups
  // For now, return mock data until we implement wagmi read hooks
  console.log(
    "TODO: fetchGroupsFromChain - implement with wagmi useReadContract",
  );
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  // Return mock data for now
  return [
    {
      id: "group_1",
      name: "Screen Time Challenge",
      owner: "0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9",
      entryFeeEth: "0.01",
      participants: [
        "0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9",
        "0x42C2d2809Cf1a9061BA8488D10Af9BfF81689d8b",
      ],
      settled: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "group_2",
      name: "Daily Steps Goal",
      owner: "0x99e49c6C91640C1B217ae6006fCD8898122b4bFb",
      entryFeeEth: "0.05",
      participants: [
        "0x42C2d2809Cf1a9061BA8488D10Af9BfF81689d8b",
        "0x99e49c6C91640C1B217ae6006fCD8898122b4bFb",
        "0xfaad30F15e36Cd319E1A717d8397b36707B4231a",
      ],
      settled: true,
      winner: "0xfaad30F15e36Cd319E1A717d8397b36707B4231a",
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ];
}

export async function fetchGroupById(id: string): Promise<Group | null> {
  // TODO: Implement contract read to fetch a specific group
  console.log(
    "TODO: fetchGroupById - implement with wagmi useReadContract",
    id,
  );
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  const groups = await fetchGroupsFromChain();
  return groups.find((group) => group.id === id) || null;
}
