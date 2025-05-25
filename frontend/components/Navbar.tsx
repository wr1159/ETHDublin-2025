import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Identity,
  Name,
  Avatar,
  Address,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";

interface NavbarProps {
  onCreateGroup?: () => void;
  showCreateButton?: boolean;
}

export function Navbar({
  onCreateGroup,
  showCreateButton = true,
}: NavbarProps) {
  const { address } = useAccount();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">LockedIn</h1>
            <p className="text-muted-foreground text-sm">
              Stake ETH with friends and compete in challenges
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
            {showCreateButton && (
              <Button
                onClick={onCreateGroup}
                className="flex items-center gap-2"
                disabled={!address}
              >
                <Plus className="h-4 w-4" />
                New Group
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
