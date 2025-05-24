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
import { settleRoomOnChain, TransactionCall } from "@/lib/contractPlaceholders";
import { Group, SettleGroupParams } from "@/types/group";
import { EthDisplay } from "./EthDisplay";
import { AddressAvatar } from "./AddressAvatar";
import { Loader2, Trophy } from "lucide-react";

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
  const [transactionCalls, setTransactionCalls] = useState<TransactionCall[]>(
    [],
  );
  const [showTransaction, setShowTransaction] = useState(false);

  if (!group || group.settled) return null;

  const totalPrize = (
    parseFloat(group.entryFeeEth) * group.participants.length
  ).toString();

  const handleSettle = async () => {
    if (!selectedWinner) return;

    setIsLoading(true);
    try {
      const params: SettleGroupParams = {
        groupId: group.id,
        winnerAddress: selectedWinner,
      };

      const calls = await settleRoomOnChain(params);
      setTransactionCalls(calls);
      setShowTransaction(true);
    } catch (error) {
      console.error("Error preparing settle transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionSuccess = () => {
    onSettleSuccess();
    setSelectedWinner("");
    setShowTransaction(false);
    setTransactionCalls([]);
    onClose();
  };

  const handleCancel = () => {
    setSelectedWinner("");
    setShowTransaction(false);
    setTransactionCalls([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Settle Group
          </DialogTitle>
          <DialogDescription>
            Select the challenge winner to distribute the prize pool.
          </DialogDescription>
        </DialogHeader>

        {!showTransaction ? (
          <div className="space-y-4">
            {/* Prize Pool Display */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-sm text-green-700 font-medium mb-2">
                Total Prize Pool
              </div>
              <EthDisplay
                amount={totalPrize}
                className="text-2xl font-bold text-green-600"
              />
              <div className="text-xs text-green-600 mt-1">
                {group.participants.length} participants × {group.entryFeeEth}{" "}
                ETH
              </div>
            </div>

            {/* Winner Selection */}
            <div className="space-y-3">
              <div className="text-sm font-medium">Select Winner</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {group.participants.map((participant) => (
                  <div
                    key={participant}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                      ${
                        selectedWinner === participant
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }
                    `}
                    onClick={() => setSelectedWinner(participant)}
                  >
                    <input
                      type="radio"
                      checked={selectedWinner === participant}
                      onChange={() => setSelectedWinner(participant)}
                      className="text-primary"
                    />
                    <AddressAvatar
                      address={participant}
                      size="sm"
                      showAddress
                      className="flex-1"
                    />
                  </div>
                ))}
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
                onClick={handleSettle}
                disabled={isLoading || !selectedWinner}
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
              Please confirm the transaction to settle the group and transfer
              the prize pool to the winner.
            </div>

            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Winner:</span>
                <AddressAvatar address={selectedWinner} size="sm" showAddress />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Prize Amount:</span>
                <EthDisplay
                  amount={totalPrize}
                  className="font-mono font-medium"
                />
              </div>
            </div>

            <Transaction
              calls={transactionCalls}
              onStatus={(status) => {
                if (status.statusName === "success") {
                  handleTransactionSuccess();
                }
              }}
            >
              <TransactionButton text="Settle Group & Transfer Prize" />
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
