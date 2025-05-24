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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroupOnChain } from "@/lib/contractPlaceholders";
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
  const [entryFeeEth, setEntryFeeEth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    if (!entryFeeEth || parseFloat(entryFeeEth) <= 0) {
      setError("Entry fee must be greater than 0");
      return;
    }

    setIsLoading(true);

    try {
      const params: CreateGroupParams = {
        name: name.trim(),
        entryFeeEth: entryFeeEth,
      };

      const groupId = await createGroupOnChain(params);
      onGroupCreated(groupId);

      // Reset form
      setName("");
      setEntryFeeEth("");
      onClose();
    } catch (err) {
      setError("Failed to create group. Please try again.");
      console.error("Error creating group:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setEntryFeeEth("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Set up a new challenge group. Participants will need to stake the
            entry fee to join.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Screen Time Challenge"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              maxLength={50}
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
              value={entryFeeEth}
              onChange={(e) => setEntryFeeEth(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
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
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
