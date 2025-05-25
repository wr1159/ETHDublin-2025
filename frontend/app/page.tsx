"use client";

import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Loader2 } from "lucide-react";
import { GroupList } from "@/components/GroupList";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { JoinGroupDialog } from "@/components/JoinGroupDialog";
import { Navbar } from "@/components/Navbar";
import { Group } from "@/types/group";
import { useAllRooms, useRoomCount } from "@/lib/contractReads";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export default function HomePage() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const router = useRouter();
  const { address } = useAccount();
  const { data: roomCount } = useRoomCount();
  console.log("roomCount", roomCount);
  const { data: groups = [], isLoading, refetch } = useAllRooms();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleGroupCreated = (groupId: string) => {
    console.log("Group created:", groupId);
    refetch(); // Refresh the blockchain data
  };

  const handleViewDetails = (group: Group) => {
    const isParticipant = address && group.participants.includes(address);
    const canJoin = address && !isParticipant && !group.settled;

    if (canJoin) {
      setSelectedGroup(group);
      setJoinDialogOpen(true);
    } else {
      // Navigate to group details page
      router.push(`/groups/${group.id}`);
    }
  };

  const handleJoinSuccess = () => {
    refetch(); // Refresh the blockchain data
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar onCreateGroup={() => setCreateDialogOpen(true)} />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-card-foreground">
              {groups.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Groups</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-card-foreground">
              {groups.filter((g) => !g.settled).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Groups</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-card-foreground">
              {groups.reduce((sum, g) => sum + g.participants.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Participants
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">All Groups</h2>
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            )}
          </div>

          <GroupList
            groups={groups}
            onViewDetails={handleViewDetails}
            currentUserAddress={address}
            isLoading={isLoading}
          />
        </div>

        {/* MiniKit Debug Info */}
        {context && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">MiniKit Context</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Frame Ready: {isFrameReady ? "Yes" : "No"}</div>
              <div>User FID: {context.user?.fid || "Not connected"}</div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateGroupDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      <JoinGroupDialog
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
        group={selectedGroup}
        userAddress={address}
        onJoinSuccess={handleJoinSuccess}
      />
    </div>
  );
}
