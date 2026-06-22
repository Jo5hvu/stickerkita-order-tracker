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
    const priority = {
      "Customer Urgent": 4,
      Overdue: 3,
      Warning: 2,
      "On Track": 1,
      Completed: 0,
    };

    return priority[getOrderAgeStatus(b)] - priority[getOrderAgeStatus(a)];
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
            {dashboardOrders.map((order) => (
              <tr key={order.id} className="border-b text-sm">
                <td className="py-3 font-semibold text-gray-900">
                  {order.invoice_no}
                </td>

                <td className="py-3 text-gray-600">
                  {order.customer_phone}
                </td>

                <td className="py-3 text-gray-600">
                  {order.material || "-"}
                </td>

                <td className="py-3 text-gray-600">
                  {order.shape || "-"}
                </td>

                <td className="py-3 text-gray-600">
                  {order.quantity || "-"}
                </td>

                <td className="py-3 text-gray-600">
                  RM {Number(order.total_amount || 0).toFixed(2)}
                </td>

                <td className="py-3 text-gray-600">
                  {order.designer_name || "-"}
                </td>

                <td className="py-3">
                  <OrderAgeBadge order={order} />
                </td>

                <td className="py-3">
                  <InlineStatusSelect order={order} />
                </td>

                <td className="py-3">
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-semibold text-orange-600"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}

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