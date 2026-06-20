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
      ? "bg-red-500 text-white"
      : status === "Customer Urgent"
      ? "bg-orange-500 text-white"
      : status === "Warning"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="flex flex-col gap-1">
      <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${className}`}>
        {label}
      </span>

      {status === "Customer Urgent" && (
        <span className="text-xs font-semibold text-orange-500">
          Urgent
        </span>
      )}

      {status === "Warning" && (
        <span className="text-xs font-semibold text-yellow-500">
          Attention
        </span>
      )}

      {status === "Overdue" && (
        <span className="text-xs font-semibold text-red-500">
          Follow-up
        </span>
      )}
    </div>
  );
}