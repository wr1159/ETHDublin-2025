import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddressAvatar } from "./AddressAvatar";
import { EthDisplay } from "./EthDisplay";
import { Group } from "@/types/group";
import { Users, Trophy, Calendar } from "lucide-react";

interface GroupCardProps {
  group: Group;
  onViewDetails: (group: Group) => void;
  currentUserAddress?: string;
}

export function GroupCard({
  group,
  onViewDetails,
  currentUserAddress,
}: GroupCardProps) {
  const isOwner = currentUserAddress === group.owner;
  const isParticipant =
    currentUserAddress && group.participants.includes(currentUserAddress);
  const canJoin = currentUserAddress && !isParticipant && !group.settled;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const poolAmount = (
    parseFloat(group.entryFeeEth) * group.participants.length
  ).toFixed(4);

  return (
    <Card className="p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {group.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {group.settled && <Badge variant="secondary">Settled</Badge>}
            {isOwner && <Badge variant="outline">Owner</Badge>}
            {isParticipant && !isOwner && (
              <Badge variant="default">Joined</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pool Info */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Entry Fee</div>
          <EthDisplay
            amount={group.entryFeeEth}
            className="text-sm font-semibold"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Total Pool</div>
          <EthDisplay
            amount={poolAmount}
            className="text-sm font-semibold text-green-600"
          />
        </div>

        {/* Participants */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {group.participants.length} participants
          </span>
          <div className="flex -space-x-2 ml-2">
            {group.participants.slice(0, 3).map((participant) => (
              <AddressAvatar
                key={participant}
                address={participant}
                size="sm"
                className="border-2 border-white"
              />
            ))}
            {group.participants.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-white flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  +{group.participants.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Winner Display */}
        {group.settled && group.winner && (
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <Trophy className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">Winner:</span>
            <AddressAvatar address={group.winner} size="sm" />
            <span className="text-sm text-green-800 font-mono">
              {group.winner.slice(0, 6)}...{group.winner.slice(-4)}
            </span>
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Created {formatDate(group.createdAt)}</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onViewDetails(group)}
          variant={canJoin ? "default" : "outline"}
          className="w-full"
        >
          {canJoin ? "Join Group" : "View Details"}
        </Button>
      </CardContent>
    </Card>
  );
}
