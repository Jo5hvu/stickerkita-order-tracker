import Link from "next/link";
import type { Order } from "@/types/order";
import StatusBadge from "@/components/orders/StatusBadge";

type OrderTableProps = {
  orders: Order[];
};

export default function OrderTable({ orders }: OrderTableProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th className="py-3">Invoice</th>
              <th className="py-3">Date</th>
              <th className="py-3">Phone</th>
              <th className="py-3">Designer</th>
              <th className="py-3">Folder Name</th>
              <th className="py-3">Price</th>
              <th className="py-3">Status</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b text-sm">
                <td className="py-3 font-semibold text-gray-900">
                  {order.invoice_no}
                </td>

                <td className="py-3 text-gray-600">
                  {order.order_date || "-"}
                </td>

                <td className="py-3 text-gray-600">
                  {order.customer_phone}
                </td>

                <td className="py-3 text-gray-600">
                  {order.designer_name || "-"}
                </td>

                <td className="max-w-[350px] break-all py-3 text-gray-600">
                  {order.folder_name || "-"}
                </td>

                <td className="py-3 text-gray-600">
                  RM {Number(order.total_amount || 0).toFixed(2)}
                </td>

                <td className="py-3">
                  <StatusBadge label={order.order_status} />
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

            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}