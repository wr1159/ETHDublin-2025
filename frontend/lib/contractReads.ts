import { useReadContract, useReadContracts } from "wagmi";
import { abi, CONTRACT_ADDRESS } from "@/abi";
import { Group } from "@/types/group";
import { formatEther } from "viem";

// Type for the RoomInfo struct returned by the contract
interface RoomInfo {
  id: bigint;
  name: string;
  owner: `0x${string}`;
  entryFee: bigint;
  players: `0x${string}`[];
  settled: boolean;
  winner: `0x${string}`;
  totalPrize: bigint;
  playerCount: bigint;
}

// Hook to get the total number of rooms
export function useRoomCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getRoomCount",
    chainId: 84532,
  });
}

// Hook to get room details by ID using the new consolidated function
export function useRoom(roomId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getRoomInfo",
    args: [roomId],
    chainId: 84532,
  });
}

// Hook to get all rooms data using batch function (preferred method)
export function useAllRoomsBatch() {
  const { data: roomCount, isLoading: isCountLoading } = useRoomCount();
  console.log("roomCount", roomCount);

  const roomIds = roomCount
    ? Array.from({ length: Number(roomCount) }, (_, i) => BigInt(i + 1))
    : [];
  console.log("roomIds", roomIds);

  const roomsData = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getRoomInfoBatch",
    args: [roomIds],
    chainId: 84532,
    query: {
      enabled: roomIds.length > 0,
    },
  });

  console.log("roomsData (batch)", roomsData);
  console.log("roomsData.data (batch)", roomsData.data);

  const groups: Group[] = [];

  if (roomsData.data && Array.isArray(roomsData.data)) {
    (roomsData.data as RoomInfo[]).forEach((roomInfo) => {
      if (
        roomInfo &&
        roomInfo.owner &&
        roomInfo.owner !== "0x0000000000000000000000000000000000000000"
      ) {
        groups.push({
          id: roomInfo.id.toString(),
          name: roomInfo.name,
          owner: roomInfo.owner,
          entryFeeEth: formatEther(roomInfo.entryFee),
          participants: [...roomInfo.players],
          settled: roomInfo.settled,
          winner:
            roomInfo.winner &&
            roomInfo.winner !== "0x0000000000000000000000000000000000000000"
              ? roomInfo.winner
              : undefined,
          createdAt: new Date().toISOString(),
        });
      }
    });
  }

  console.log("groups (batch)", groups);

  return {
    data: groups,
    isLoading: isCountLoading || roomsData.isLoading,
    error: roomsData.error,
    refetch: () => {
      roomsData.refetch();
    },
  };
}

// Hook to get all rooms data using individual getRoomInfo calls (fallback method)
export function useAllRoomsIndividual() {
  const { data: roomCount, isLoading: isCountLoading } = useRoomCount();
  console.log("roomCount", roomCount);

  const roomIds = roomCount
    ? Array.from({ length: Number(roomCount) }, (_, i) => BigInt(i + 1))
    : [];
  console.log("roomIds", roomIds);

  // Use individual getRoomInfo calls for each room ID
  const roomsData = useReadContracts({
    contracts: roomIds.map((roomId) => ({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "getRoomInfo",
      args: [roomId],
      chainId: 84532,
    })),
    query: {
      enabled: roomIds.length > 0,
    },
  });

  console.log("roomsData (individual)", roomsData);
  console.log("roomsData.data (individual)", roomsData.data);

  const groups: Group[] = [];

  if (roomsData.data && Array.isArray(roomsData.data)) {
    roomsData.data.forEach((result) => {
      if (result.status === "success" && result.result) {
        const roomInfo = result.result as unknown as RoomInfo;
        if (
          roomInfo &&
          roomInfo.owner &&
          roomInfo.owner !== "0x0000000000000000000000000000000000000000"
        ) {
          groups.push({
            id: roomInfo.id.toString(),
            name: roomInfo.name,
            owner: roomInfo.owner,
            entryFeeEth: formatEther(roomInfo.entryFee),
            participants: [...roomInfo.players],
            settled: roomInfo.settled,
            winner:
              roomInfo.winner &&
              roomInfo.winner !== "0x0000000000000000000000000000000000000000"
                ? roomInfo.winner
                : undefined,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });
  }

  console.log("groups (individual)", groups);

  return {
    data: groups,
    isLoading: isCountLoading || roomsData.isLoading,
    error: roomsData.error,
    refetch: () => {
      roomsData.refetch();
    },
  };
}

// Main hook that tries batch first, falls back to individual calls
export function useAllRooms() {
  const batchResult = useAllRoomsBatch();
  const individualResult = useAllRoomsIndividual();

  // If batch has an error, use individual calls
  if (batchResult.error && !individualResult.error) {
    console.log("Batch failed, using individual calls:", batchResult.error);
    return individualResult;
  }

  // Otherwise use batch (preferred)
  return batchResult;
}
