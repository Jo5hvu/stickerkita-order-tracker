type StatusBadgeProps = {
  label: string | null;
  type?: "order" | "design" | "print" | "payment" | "danger";
};

export default function StatusBadge({ label, type = "order" }: StatusBadgeProps) {
  const colorClass =
    type === "design"
      ? "bg-purple-100 text-purple-700"
      : type === "print"
      ? "bg-blue-100 text-blue-700"
      : type === "payment"
      ? "bg-green-100 text-green-700"
      : type === "danger"
      ? "bg-red-100 text-red-700"
      : "bg-orange-100 text-orange-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}>
      {label || "-"}
    </span>
  );
}