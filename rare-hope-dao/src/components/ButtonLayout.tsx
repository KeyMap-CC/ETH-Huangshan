export default function ButtonLayout({
  isProceed,
  isPending,
  isLoading,
  onClick, // New prop for generic click handler
  writeContract, // Keep for backward compatibility
  data, // Keep for backward compatibility
  label,
  loadingLabel,
}: {
  isProceed: boolean | undefined;
  isPending: boolean | undefined;
  isLoading: boolean | undefined;
  onClick?: () => void; // Optional generic click handler
  writeContract?: ((request: any) => void) | undefined; // Optional for contract calls
  data?: { request: any } | undefined; // Optional for contract data
  label: string;
  loadingLabel: string;
}) {
  // Determine the click handler: use onClick if provided, otherwise fallback to writeContract
  const handleClick = () => {
    if (onClick) {
      onClick(); // Use custom onClick if provided
    } else if (writeContract && data) {
      writeContract(data.request); // Fallback to writeContract for contract calls
    }
  };

  return (
    <>
      {isProceed && !isPending && !isLoading && (
        <button
          disabled={!isProceed || isPending || isLoading}
          onClick={handleClick}
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2 text-white transition-all duration-100 ease-in hover:scale-105"
        >
          {label}
        </button>
      )}

      {isPending && !isLoading && (
        <button className="rounded-full bg-red-500 bg-opacity-50 px-6 py-2 text-white">
          等待钱包批准
        </button>
      )}

      {isLoading && (
        <button className="animate-pulse rounded-full bg-gray-700 bg-opacity-20 px-6 py-2 text-white">
          {loadingLabel}
        </button>
      )}
    </>
  );
}
