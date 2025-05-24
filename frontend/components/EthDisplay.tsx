interface EthDisplayProps {
  amount: string;
  className?: string;
  showSymbol?: boolean;
  precision?: number;
}

export function EthDisplay({
  amount,
  className = "",
  showSymbol = true,
  precision = 4,
}: EthDisplayProps) {
  const numericAmount = parseFloat(amount);
  const formattedAmount = numericAmount.toFixed(precision);

  // Remove trailing zeros after decimal point
  const cleanAmount = parseFloat(formattedAmount).toString();

  return (
    <span className={`font-mono ${className}`} title={`${amount} ETH`}>
      {cleanAmount} {showSymbol && "ETH"}
    </span>
  );
}

// Alternative component that could integrate with OnChainKit's EthBalance in the future
export function EthBalance({
  address,
  className = "",
}: {
  address?: string;
  className?: string;
}) {
  // For now, this is a placeholder. In the future, this could use:
  // import { EthBalance } from '@coinbase/onchainkit/identity';

  if (!address) {
    return <span className={`font-mono ${className}`}>0.0000 ETH</span>;
  }

  // Mock balance - in real implementation, this would fetch from OnChainKit
  return (
    <span className={`font-mono ${className}`} title="ETH Balance">
      0.0000 ETH
    </span>
  );
}
