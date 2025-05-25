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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRoomOnChain, TransactionCall } from "@/lib/contractPlaceholders";
import { CreateGroupParams } from "@/types/group";
import { Loader2 } from "lucide-react";

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated: (groupId: string) => void;
}

export function CreateGroupDialog({
  open,
  onClose,
  onGroupCreated,
}: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCalls, setTransactionCalls] = useState<TransactionCall[]>(
    [],
  );
  const [showTransaction, setShowTransaction] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !entryFee) {
      return;
    }

    setIsLoading(true);
    try {
      const params: CreateGroupParams = {
        name: name.trim(),
        entryFeeEth: entryFee,
      };

      const calls = await createRoomOnChain(params);
      console.log("calls", calls);
      setTransactionCalls(calls);
      setShowTransaction(true);
    } catch (error) {
      console.error("Error preparing transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionSuccess = () => {
    // Generate a mock group ID for now
    onGroupCreated("0");

    // Reset form
    setName("");
    setEntryFee("");
    setShowTransaction(false);
    setTransactionCalls([]);
    onClose();
  };

  const handleCancel = () => {
    setName("");
    setEntryFee("");
    setShowTransaction(false);
    setTransactionCalls([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Set up a new challenge group. All participants will stake the entry
            fee.
          </DialogDescription>
        </DialogHeader>

        {!showTransaction ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="e.g., Daily Steps Challenge"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee (ETH)</Label>
              <Input
                id="entryFee"
                type="number"
                placeholder="0.01"
                step="0.001"
                min="0.001"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
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
                type="submit"
                disabled={isLoading || !name.trim() || !entryFee}
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Please confirm the transaction to create your group.
            </div>
            <Transaction
              calls={transactionCalls}
              onSuccess={handleTransactionSuccess}
            >
              <TransactionButton text="Create Group" />
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
