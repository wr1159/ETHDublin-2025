"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { joinGroupOnChain } from "@/lib/contractPlaceholders";
import { Group, JoinGroupParams } from "@/types/group";
import { EthDisplay } from "./EthDisplay";
import { AddressAvatar } from "./AddressAvatar";
import { Loader2, Users, AlertTriangle } from "lucide-react";

interface JoinGroupDialogProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  userAddress: string | undefined;
  onJoinSuccess: () => void;
}

export function JoinGroupDialog({
  open,
  onClose,
  group,
  userAddress,
  onJoinSuccess,
}: JoinGroupDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!group || !userAddress) return null;

  const poolAmount = (
    parseFloat(group.entryFeeEth) *
    (group.participants.length + 1)
  ).toFixed(4);

  const handleJoin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const params: JoinGroupParams = {
        groupId: group.id,
        userAddress: userAddress,
      };

      await joinGroupOnChain(params);
      onJoinSuccess();
      onClose();
    } catch (err) {
      setError("Failed to join group. Please try again.");
      console.error("Error joining group:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Group</DialogTitle>
          <DialogDescription>
            You&apos;re about to join &quot;{group.name}&quot;. You&apos;ll need
            to stake the entry fee to participate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group Info */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Entry Fee</span>
              <EthDisplay
                amount={group.entryFeeEth}
                className="text-lg font-bold"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Total Pool (after joining)
              </span>
              <EthDisplay
                amount={poolAmount}
                className="text-sm font-semibold text-green-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {group.participants.length + 1} participants (including you)
              </span>
            </div>
          </div>

          {/* Current Participants */}
          <div>
            <div className="text-sm font-medium mb-2">Current Participants</div>
            <div className="flex flex-wrap gap-2">
              {group.participants.map((participant) => (
                <div
                  key={participant}
                  className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
                >
                  <AddressAvatar address={participant} size="sm" />
                  <span className="text-xs font-mono">
                    {participant.slice(0, 6)}...{participant.slice(-4)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <div className="font-medium">
                Stakes are locked until settlement
              </div>
              <div className="text-xs mt-1">
                The group owner will determine the winner and distribute the
                pooled funds.
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoin}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Pay{" "}
                  <EthDisplay amount={group.entryFeeEth} showSymbol={false} />{" "}
                  ETH & Join
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
