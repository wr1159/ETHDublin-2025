"use client";

import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { GroupList } from "@/components/GroupList";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { JoinGroupDialog } from "@/components/JoinGroupDialog";
import { Group } from "@/types/group";
import { fetchGroupsFromChain } from "@/lib/contractPlaceholders";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Mock user address - in real app this would come from wallet connection
  const mockUserAddress = "0x1234567890123456789012345678901234567890";

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const fetchedGroups = await fetchGroupsFromChain();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupCreated = (groupId: string) => {
    console.log("Group created:", groupId);
    loadGroups(); // Refresh the list
  };

  const handleViewDetails = (group: Group) => {
    const isParticipant = group.participants.includes(mockUserAddress);
    const canJoin = !isParticipant && !group.settled;

    if (canJoin) {
      setSelectedGroup(group);
      setJoinDialogOpen(true);
    } else {
      // Navigate to group details page
      router.push(`/groups/${group.id}`);
    }
  };

  const handleJoinSuccess = () => {
    loadGroups(); // Refresh the list to show updated participant count
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">LockedIn</h1>
            <p className="text-muted-foreground mt-1">
              Stake ETH with friends and compete in challenges
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Group
          </Button>
        </div>

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
            currentUserAddress={mockUserAddress}
            isLoading={isLoading}
          />
        </div>

        {/* MiniKit Debug Info */}
        {context && (
          <div className="mt-12 p-4 bg-muted rounded-lg">
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
        userAddress={mockUserAddress}
        onJoinSuccess={handleJoinSuccess}
      />
    </div>
  );
}
