import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AddressAvatarProps {
  address: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AddressAvatar({
  address,
  size = "md",
  className = "",
}: AddressAvatarProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  // Generate a simple identicon-style background based on address
  const generateColor = (addr: string) => {
    const hash = addr.slice(2, 8); // Take first 6 chars after 0x
    return `#${hash}`;
  };

  const backgroundColor = generateColor(address);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src="" /> {/* Could be ENS avatar in the future */}
      <AvatarFallback
        style={{ backgroundColor }}
        className="text-white text-xs font-semibold"
      >
        {address.slice(2, 4).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
