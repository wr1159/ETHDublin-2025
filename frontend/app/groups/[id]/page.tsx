"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  Trophy,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { Group } from "@/types/group";
import { fetchGroupById } from "@/lib/contractPlaceholders";
import { AddressAvatar } from "@/components/AddressAvatar";
import { EthDisplay } from "@/components/EthDisplay";
import { JoinGroupDialog } from "@/components/JoinGroupDialog";
import { SettleGroupDialog } from "@/components/SettleGroupDialog";

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { setFrameReady, isFrameReady } = useMiniKit();

  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [settleDialogOpen, setSettleDialogOpen] = useState(false);

  // Mock user address - in real app this would come from wallet connection
  const mockUserAddress = "0x1234567890123456789012345678901234567890";

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    if (params.id) {
      loadGroup(params.id as string);
    }
  }, [params.id]);

  const loadGroup = async (groupId: string) => {
    setIsLoading(true);
    try {
      const fetchedGroup = await fetchGroupById(groupId);
      setGroup(fetchedGroup);
    } catch (error) {
      console.error("Error loading group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSuccess = () => {
    if (params.id) {
      loadGroup(params.id as string); // Refresh group data
    }
  };

  const handleSettleSuccess = () => {
    if (params.id) {
      loadGroup(params.id as string); // Refresh group data
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Group Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The group you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Groups
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = mockUserAddress === group.owner;
  const isParticipant = group.participants.includes(mockUserAddress);
  const canJoin = !isParticipant && !group.settled;
  const canSettle = isOwner && !group.settled && group.participants.length > 1;
  const poolAmount = (
    parseFloat(group.entryFeeEth) * group.participants.length
  ).toFixed(4);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{group.name}</h1>
            <div className="flex items-center gap-2">
              {group.settled && <Badge variant="secondary">Settled</Badge>}
              {isOwner && <Badge variant="outline">Owner</Badge>}
              {isParticipant && !isOwner && (
                <Badge variant="default">Joined</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pool Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Prize Pool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <EthDisplay
                    amount={poolAmount}
                    className="text-4xl font-bold text-green-600"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    From {group.participants.length} participants ×{" "}
                    <EthDisplay amount={group.entryFeeEth} />
                  </p>
                </div>

                {group.settled && group.winner && (
                  <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Trophy className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">Winner:</span>
                    <AddressAvatar address={group.winner} size="sm" />
                    <span className="text-green-800 font-mono">
                      {group.winner.slice(0, 10)}...{group.winner.slice(-8)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants ({group.participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.participants.map((participant) => (
                    <div
                      key={participant}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <AddressAvatar address={participant} size="md" />
                      <div className="flex-1">
                        <div className="font-mono text-sm">
                          {participant.slice(0, 16)}...{participant.slice(-8)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {participant === group.owner && (
                            <Badge variant="outline" className="text-xs">
                              Owner
                            </Badge>
                          )}
                          {group.settled && participant === group.winner && (
                            <Badge
                              variant="default"
                              className="text-xs bg-green-600"
                            >
                              Winner
                            </Badge>
                          )}
                        </div>
                      </div>
                      <EthDisplay
                        amount={group.entryFeeEth}
                        className="text-sm text-muted-foreground"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canJoin && (
                  <Button
                    onClick={() => setJoinDialogOpen(true)}
                    className="w-full"
                  >
                    Join Group
                  </Button>
                )}

                {canSettle && (
                  <Button
                    onClick={() => setSettleDialogOpen(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Settle Group
                  </Button>
                )}

                {!canJoin && !canSettle && !group.settled && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {isParticipant
                        ? "You have already joined this group"
                        : "Group is not available for joining"}
                    </p>
                  </div>
                )}

                {group.settled && (
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-800">
                      Group Settled
                    </p>
                    <p className="text-xs text-green-700">
                      Winner has been determined
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Group Info */}
            <Card>
              <CardHeader>
                <CardTitle>Group Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(group.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Entry Fee:</span>
                  <EthDisplay
                    amount={group.entryFeeEth}
                    className="font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={
                      group.settled ? "text-green-600" : "text-blue-600"
                    }
                  >
                    {group.settled ? "Settled" : "Active"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Warning for non-participants */}
            {!isParticipant && !group.settled && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <div className="font-medium mb-1">Not a participant</div>
                      <div className="text-xs">
                        Join this group to participate in the challenge and
                        compete for the prize pool.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <JoinGroupDialog
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
        group={group}
        userAddress={mockUserAddress}
        onJoinSuccess={handleJoinSuccess}
      />

      <SettleGroupDialog
        open={settleDialogOpen}
        onClose={() => setSettleDialogOpen(false)}
        group={group}
        onSettleSuccess={handleSettleSuccess}
      />
    </div>
  );
}
