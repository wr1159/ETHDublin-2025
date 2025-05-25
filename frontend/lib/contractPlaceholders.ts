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
      args: [params.name, entryFeeWei],
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
      args: [BigInt(params.groupId)],
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
      args: [BigInt(params.groupId), params.winnerAddress as `0x${string}`],
    },
  ];
}

// Read functions for fetching data from the blockchain
export async function fetchGroupsFromChain(): Promise<Group[]> {
  // This function is deprecated - we now use wagmi hooks in contractReads.ts
  console.log(
    "DEPRECATED: fetchGroupsFromChain - use useAllRooms hook instead",
  );
  return [];
}

export async function fetchGroupById(id: string): Promise<Group | null> {
  // This function is deprecated - we now use wagmi hooks in contractReads.ts
  console.log("DEPRECATED: fetchGroupById - use useRoom hook instead", id);
  return null;
}
