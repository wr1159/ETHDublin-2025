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
import { settleGroupOnChain } from "@/lib/contractPlaceholders";
import { Group, SettleGroupParams } from "@/types/group";
import { EthDisplay } from "./EthDisplay";
import { AddressAvatar } from "./AddressAvatar";
import { Loader2, Trophy, AlertTriangle } from "lucide-react";

interface SettleGroupDialogProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
  onSettleSuccess: () => void;
}

export function SettleGroupDialog({
  open,
  onClose,
  group,
  onSettleSuccess,
}: SettleGroupDialogProps) {
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!group) return null;

  const poolAmount = (
    parseFloat(group.entryFeeEth) * group.participants.length
  ).toFixed(4);

  const handleSettle = async () => {
    if (!selectedWinner) {
      setError("Please select a winner");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const params: SettleGroupParams = {
        groupId: group.id,
        winnerAddress: selectedWinner,
      };

      await settleGroupOnChain(params);
      onSettleSuccess();
      onClose();
    } catch (err) {
      setError("Failed to settle group. Please try again.");
      console.error("Error settling group:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedWinner("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settle Group</DialogTitle>
          <DialogDescription>
            Select the winner of &quot;{group.name}&quot;. The entire pool will
            be transferred to the selected participant.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Pool Info */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Prize Pool</span>
            </div>
            <EthDisplay
              amount={poolAmount}
              className="text-2xl font-bold text-green-600"
            />
            <div className="text-sm text-green-700 mt-1">
              From {group.participants.length} participants ×{" "}
              <EthDisplay amount={group.entryFeeEth} />
            </div>
          </div>

          {/* Winner Selection */}
          <div>
            <div className="text-sm font-medium mb-3">Select Winner</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {group.participants.map((participant) => (
                <div
                  key={participant}
                  onClick={() => setSelectedWinner(participant)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedWinner === participant
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <AddressAvatar address={participant} size="md" />
                    <div>
                      <div className="font-mono text-sm">
                        {participant.slice(0, 10)}...{participant.slice(-8)}
                      </div>
                      {participant === group.owner && (
                        <div className="text-xs text-muted-foreground">
                          Group Owner
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedWinner === participant && (
                    <Trophy className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <div className="font-medium">This action cannot be undone</div>
              <div className="text-xs mt-1">
                Once settled, the entire pool will be transferred to the
                selected winner and the group will be closed.
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
              onClick={handleSettle}
              disabled={isLoading || !selectedWinner}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Settling...
                </>
              ) : (
                <>
                  <Trophy className="mr-2 h-4 w-4" />
                  Settle Group
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
