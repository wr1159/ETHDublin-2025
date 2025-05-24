import {
  Group,
  CreateGroupParams,
  JoinGroupParams,
  SettleGroupParams,
} from "@/types/group";

/**
 * Placeholder contract interaction functions
 * These will be replaced with actual wagmi hooks and contract calls
 */

export async function createGroupOnChain(
  params: CreateGroupParams,
): Promise<string> {
  // TODO: Implement actual contract call to create a group
  // Should return the group ID (transaction hash or UUID)
  console.log("TODO: createGroupOnChain", params);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  return `group_${Date.now()}`;
}

export async function joinGroupOnChain(params: JoinGroupParams): Promise<void> {
  // TODO: Implement actual contract call to join a group
  // Should transfer entry fee to contract
  console.log("TODO: joinGroupOnChain", params);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
}

export async function settleGroupOnChain(
  params: SettleGroupParams,
): Promise<void> {
  // TODO: Implement actual contract call to settle a group
  // Should transfer pooled funds to winner
  console.log("TODO: settleGroupOnChain", params);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
}

export async function fetchGroupsFromChain(): Promise<Group[]> {
  // TODO: Implement actual contract read to fetch all groups
  console.log("TODO: fetchGroupsFromChain");
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
  // TODO: Implement actual contract read to fetch a specific group
  console.log("TODO: fetchGroupById", id);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  const groups = await fetchGroupsFromChain();
  return groups.find((group) => group.id === id) || null;
}
