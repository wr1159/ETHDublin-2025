interface EthDisplayProps {
  amount: string;
  className?: string;
  showSymbol?: boolean;
}

export function EthDisplay({
  amount,
  className = "",
  showSymbol = true,
}: EthDisplayProps) {
  const formattedAmount = parseFloat(amount).toFixed(4);

  return (
    <span className={`font-mono ${className}`}>
      {formattedAmount} {showSymbol && "ETH"}
    </span>
  );
}
