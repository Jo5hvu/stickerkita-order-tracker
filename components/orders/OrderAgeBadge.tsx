import type { Order } from "@/types/order";
import { getOrderAgeLabel, getOrderAgeStatus } from "@/lib/orderAgeUtils";

type OrderAgeBadgeProps = {
  order: Order;
};

export default function OrderAgeBadge({ order }: OrderAgeBadgeProps) {
  const status = getOrderAgeStatus(order);
  const label = getOrderAgeLabel(order);

  const className =
    status === "Overdue"
      ? "bg-red-100 text-red-700"
      : status === "Warning"
      ? "bg-yellow-100 text-yellow-700"
      : status === "Completed"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="flex flex-col gap-1">
      <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${className}`}>
        {label}
      </span>

      {status === "Warning" && (
        <span className="text-xs font-semibold text-yellow-700">
          Needs attention
        </span>
      )}

      {status === "Overdue" && (
        <span className="text-xs font-semibold text-red-700">
          Urgent follow-up
        </span>
      )}
    </div>
  );
}