type StockStatusBadgeProps = {
  status: string;
};

export default function StockStatusBadge({ status }: StockStatusBadgeProps) {
  const className =
    status === "Out of Stock"
      ? "bg-red-100 text-red-700"
      : status === "Low Stock"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {status}
    </span>
  );
}