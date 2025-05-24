"use client";

import { useState } from "react";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { joinRoomOnChain, TransactionCall } from "@/lib/contractPlaceholders";
import { Group, JoinGroupParams } from "@/types/group";
import { EthDisplay } from "./EthDisplay";
import { Loader2, AlertTriangle, Users } from "lucide-react";

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
  const [transactionCalls, setTransactionCalls] = useState<TransactionCall[]>(
    [],
  );
  const [showTransaction, setShowTransaction] = useState(false);

  if (!group || !userAddress) return null;

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      const params: JoinGroupParams = {
        groupId: group.id,
        userAddress,
      };

      const calls = await joinRoomOnChain(params, group.entryFeeEth);
      setTransactionCalls(calls);
      setShowTransaction(true);
    } catch (err) {
      console.error("Error preparing join transaction:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionSuccess = () => {
    onJoinSuccess();
    setShowTransaction(false);
    setTransactionCalls([]);
    onClose();
  };

  const handleCancel = () => {
    setShowTransaction(false);
    setTransactionCalls([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Group</DialogTitle>
          <DialogDescription>
            Stake your ETH to join this challenge group.
          </DialogDescription>
        </DialogHeader>

        {!showTransaction ? (
          <div className="space-y-4">
            {/* Group Info */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{group.name}</h3>
                <Badge variant={group.settled ? "secondary" : "default"}>
                  {group.settled ? "Settled" : "Active"}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {group.participants.length} participants
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Entry Fee</div>
                <EthDisplay
                  amount={group.entryFeeEth}
                  className="text-lg font-mono"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Prize Pool</div>
                <EthDisplay
                  amount={(
                    parseFloat(group.entryFeeEth) * group.participants.length
                  ).toString()}
                  className="text-lg font-mono text-green-600"
                />
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <div className="text-sm font-medium text-yellow-800">
                  Stake Warning
                </div>
                <div className="text-sm text-yellow-700">
                  Your ETH will be locked until the group owner settles the
                  challenge. Only the winner receives the full prize pool.
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Please confirm the transaction to join the group and stake your
              ETH.
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="text-sm font-medium mb-2">You will stake:</div>
              <EthDisplay
                amount={group.entryFeeEth}
                className="text-lg font-mono"
              />
            </div>

            <Transaction
              calls={transactionCalls}
              onStatus={(status) => {
                if (status.statusName === "success") {
                  handleTransactionSuccess();
                }
              }}
            >
              <TransactionButton text="Join Group & Stake ETH" />
              <TransactionStatus />
            </Transaction>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
