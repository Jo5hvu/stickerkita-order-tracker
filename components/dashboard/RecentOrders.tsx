import Link from "next/link";
import type { Order } from "@/types/order";
import OrderAgeBadge from "@/components/orders/OrderAgeBadge";
import InlineStatusSelect from "@/components/orders/InlineStatusSelect";
import { getOrderAgeStatus } from "@/lib/orderAgeUtils";

type RecentOrdersProps = {
  orders: Order[];
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const dashboardOrders = [...orders].sort((a, b) => {
    const aCompleted =
      a.order_status === "Posted" || a.order_status === "Delivered";

    const bCompleted =
      b.order_status === "Posted" || b.order_status === "Delivered";

    const aUnresponsive = a.order_status === "Customer Unresponsive";
    const bUnresponsive = b.order_status === "Customer Unresponsive";

    const aOnHold = a.order_status === "Customer On Hold";
    const bOnHold = b.order_status === "Customer On Hold";

    // Customer Unresponsive goes to the very bottom
    if (aUnresponsive && !bUnresponsive) return 1;
    if (!aUnresponsive && bUnresponsive) return -1;

    // Customer On Hold goes near bottom, above unresponsive
    if (aOnHold && !bOnHold) return 1;
    if (!aOnHold && bOnHold) return -1;

    // Posted / Delivered goes near bottom, above on hold and unresponsive
    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;

    // Customer design orders appear higher among active orders
    if (a.has_customer_design && !b.has_customer_design) return -1;
    if (!a.has_customer_design && b.has_customer_design) return 1;

    const priority = {
      "Customer Urgent": 4,
      Overdue: 3,
      Warning: 2,
      "On Track": 1,
    };

    const aPriority = priority[getOrderAgeStatus(a)] || 0;
    const bPriority = priority[getOrderAgeStatus(b)] || 0;

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    // If same priority, newest orders appear first
    return (
      new Date(b.created_at || b.order_date || "").getTime() -
      new Date(a.created_at || a.order_date || "").getTime()
    );
  });

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Orders</h2>
          <p className="text-sm text-gray-500">
            Target: process each order within 3 working days before postage or pickup.
          </p>
        </div>


      </div>

      <div className="max-h-[650px] overflow-auto">
        <table className="w-full min-w-[1200px] text-left">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b text-sm text-gray-500">
              <th className="py-3">Invoice</th>
              <th className="py-3">Phone</th>
              <th className="py-3">Sticker Type</th>
              <th className="py-3">Shape</th>
              <th className="py-3">Pcs</th>
              <th className="py-3">Price</th>
              <th className="py-3">Designer</th>
              <th className="py-3">Days in System</th>
              <th className="py-3">Status</th>
              <th className="py-3">Open</th>
            </tr>
          </thead>

          <tbody>
            {dashboardOrders.map((order) => {
              const isUnresponsive = order.order_status === "Customer Unresponsive";
              const isOnHold = order.order_status === "Customer On Hold";
              const isCompleted =
                order.order_status === "Posted" || order.order_status === "Delivered";

              const rowBg = isUnresponsive
                ? "bg-gray-100"
                : isOnHold
                ? "bg-yellow-50"
                : order.has_customer_design
                ? "bg-sky-100"
                : isCompleted
                ? "bg-green-50"
                : "bg-white/60";

              const rowText = isUnresponsive ? "line-through text-gray-400" : "";

              return (
                <tr key={order.id} className="border-b text-sm transition">
                  <td className={`py-3 font-semibold text-gray-900 ${rowBg} ${rowText}`}>
                    <div className="flex flex-col gap-1">
                      <span>{order.invoice_no}</span>

                      {order.has_customer_design && (
                        <span className="w-fit rounded-full bg-blue-200 px-2 py-1 text-xs font-bold text-blue-800">
                          Customer Design
                        </span>
                      )}

                      {order.order_status === "Customer On Hold" && (
                        <span className="w-fit rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-700">
                          Customer On Hold
                        </span>
                      )}

                      {order.order_status === "Customer Unresponsive" && (
                        <span className="w-fit rounded-full bg-gray-200 px-2 py-1 text-xs font-bold text-gray-700">
                          Customer Unresponsive
                        </span>
                      )}
                    </div>
                  </td>

                  <td className={`py-3 text-gray-600 ${rowBg} ${rowText}`}>
                    {order.customer_phone}
                  </td>

                  <td className={`py-3 text-gray-600 ${rowBg} ${rowText}`}>
                    {order.material || "-"}
                  </td>

                  <td className={`py-3 text-gray-600 ${rowBg} ${rowText}`}>
                    {order.shape || "-"}
                  </td>

                  <td className={`py-3 text-gray-600 ${rowBg} ${rowText}`}>
                    {order.quantity || "-"}
                  </td>

                  <td className={`py-3 text-gray-600 ${rowBg} ${rowText}`}>
                    RM {Number(order.total_amount || 0).toFixed(2)}
                  </td>

                  <td className={`py-3 text-gray-600 ${rowBg} ${rowText}`}>
                    {order.designer_name || "-"}
                  </td>

                  <td className={`py-3 ${rowBg}`}>
                    <OrderAgeBadge order={order} />
                  </td>

                  <td className={`py-3 ${rowBg}`}>
                    <InlineStatusSelect order={order} />
                  </td>

                  <td className={`py-3 ${rowBg}`}>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-semibold text-orange-600"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              );
            })}

            {dashboardOrders.length === 0 && (
              <tr>
                <td colSpan={10} className="py-6 text-center text-gray-500">
                  No orders yet. Add your first order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}