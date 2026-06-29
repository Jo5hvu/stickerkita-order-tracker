type StatusBadgeProps = {
  label?: string | null;
};

export default function StatusBadge({ label }: StatusBadgeProps) {
  const status = label || "-";

  const className =
    status === "Customer Unresponsive"
      ? "bg-gray-200 text-gray-700"
      : status === "Delivered" || status === "Posted"
      ? "bg-green-100 text-green-700"
      : status === "Packed" || status === "Ready to be Cut"
      ? "bg-blue-100 text-blue-700"
      : status === "Printed" || status === "Submit for Printing"
      ? "bg-purple-100 text-purple-700"
      : status === "Payment Made" || status === "Design Confirm"
      ? "bg-orange-100 text-orange-700"
      : status === "Submitted to Designer"
      ? "bg-sky-100 text-sky-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {status}
    </span>
  );
}