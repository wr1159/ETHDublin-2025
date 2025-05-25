"use client";

import { GroupCard } from "./GroupCard";
import { Group } from "@/types/group";

interface GroupListProps {
  groups: Group[];
  onViewDetails: (group: Group) => void;
  currentUserAddress?: string;
  isLoading?: boolean;
}

export function GroupList({
  groups,
  onViewDetails,
  currentUserAddress,
  isLoading = false,
}: GroupListProps) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl shadow-md bg-muted animate-pulse"
          >
            <div className="h-32 bg-muted-foreground/20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">
          No groups found
        </div>
        <div className="text-sm text-muted-foreground">
          Create a new group to get started!
        </div>
      </div>
    );
  }

  const sortedGroups = groups.reverse().sort((a, b) => {
    if (a.settled && !b.settled) return 1;
    if (!a.settled && b.settled) return -1;
    return 0;
  });
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedGroups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          onViewDetails={onViewDetails}
          currentUserAddress={currentUserAddress}
        />
      ))}
    </div>
  );
}
