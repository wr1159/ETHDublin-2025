import { Avatar } from "@coinbase/onchainkit/identity";

interface AddressAvatarProps {
  address: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showAddress?: boolean;
}

export function AddressAvatar({
  address,
  size = "md",
  className = "",
  showAddress = false,
}: AddressAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (showAddress) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Avatar
          address={address as `0x${string}`}
          className={sizeClasses[size]}
        />
        <span className="font-mono text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <Avatar
      address={address as `0x${string}`}
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}
