"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Order } from "@/types/order";
import OrderAgeBadge from "@/components/orders/OrderAgeBadge";
import InlineStatusSelect from "@/components/orders/InlineStatusSelect";
import { getOrderAgeStatus } from "@/lib/orderAgeUtils";

type RecentOrdersProps = {
  orders: Order[];
};

function isCompletedOrder(order: Order) {
  const status = (order.order_status || "").trim().toLowerCase();
  return status === "posted" || status === "delivered";
}

function isUnresponsiveOrder(order: Order) {
  const status = (order.order_status || "").trim().toLowerCase();
  return status === "customer unresponsive";
}

function isOnHoldOrder(order: Order) {
  const status = (order.order_status || "").trim().toLowerCase();
  return status === "customer on hold";
}

function isPriorityOrder(order: Order) {
  const ageStatus = getOrderAgeStatus(order);

  return (
    Boolean(order.has_customer_design) ||
    Boolean(order.is_urgent) ||
    ageStatus === "Overdue" ||
    ageStatus === "Warning" ||
    ageStatus === "Customer Urgent"
  );
}

function filterOrdersByView(orders: Order[], view: string) {
  if (view === "priority") {
    return orders.filter(
      (order) =>
        !isCompletedOrder(order) &&
        !isUnresponsiveOrder(order) &&
        !isOnHoldOrder(order) &&
        isPriorityOrder(order)
    );
  }

  if (view === "on-hold") {
    return orders.filter((order) => isOnHoldOrder(order));
  }

  if (view === "unresponsive") {
    return orders.filter((order) => isUnresponsiveOrder(order));
  }

  if (view === "completed") {
    return orders.filter((order) => isCompletedOrder(order));
  }

  if (view === "all") {
    return orders;
  }

  // Default: Active
  return orders.filter(
    (order) =>
      !isCompletedOrder(order) &&
      !isUnresponsiveOrder(order) &&
      !isOnHoldOrder(order)
  );
}

function getOrderSortScore(order: Order) {
  if (isUnresponsiveOrder(order)) return 0;
  if (isOnHoldOrder(order)) return 10;
  if (isCompletedOrder(order)) return 20;

  const ageStatus = getOrderAgeStatus(order);

  if (order.has_customer_design && order.is_urgent) return 100;
  if (order.is_urgent) return 95;
  if (ageStatus === "Customer Urgent") return 90;
  if (ageStatus === "Overdue") return 85;
  if (order.has_customer_design) return 80;
  if (ageStatus === "Warning") return 70;

  return 50;
}

function getViewTitle(view: string) {
  if (view === "priority") return "Priority Orders";
  if (view === "on-hold") return "Customer On Hold Orders";
  if (view === "unresponsive") return "Customer Unresponsive Orders";
  if (view === "completed") return "Completed Orders";
  if (view === "all") return "All Orders";

  return "Active Orders";
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const searchParams = useSearchParams();

  const view = searchParams.get("view") || "active";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "All";
  const designer = searchParams.get("designer") || "All";

  const filteredByView = filterOrdersByView(orders, view);

  const filteredOrders = filteredByView.filter((order) => {
    const matchesSearch =
      !search ||
      order.invoice_no?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_phone?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || order.order_status === status;

    const matchesDesigner =
      designer === "All" || order.designer_name === designer;

    return matchesSearch && matchesStatus && matchesDesigner;
  });

  const dashboardOrders = [...filteredOrders].sort((a, b) => {
    const scoreDifference = getOrderSortScore(b) - getOrderSortScore(a);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return (
      new Date(b.created_at || b.order_date || "").getTime() -
      new Date(a.created_at || a.order_date || "").getTime()
    );
  });

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {getViewTitle(view)}
        </h2>
        <p className="text-sm text-gray-500">
          Showing {dashboardOrders.length} order
          {dashboardOrders.length === 1 ? "" : "s"} for this view.
        </p>
      </div>

      <div className="max-h-[650px] overflow-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b text-sm text-gray-500">
              <th className="py-3">Invoice</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Order Info</th>
              <th className="py-3">Designer</th>
              <th className="py-3">Badges</th>
              <th className="py-3">Status</th>
              <th className="py-3">Days</th>
              <th className="py-3">Open</th>
            </tr>
          </thead>

          <tbody>
            {dashboardOrders.map((order) => {
              const isUnresponsive = isUnresponsiveOrder(order);
              const isOnHold = isOnHoldOrder(order);
              const isCompleted = isCompletedOrder(order);

              const rowBg = isUnresponsive
                ? "bg-gray-100"
                : isOnHold
                ? "bg-yellow-50"
                : isCompleted
                ? "bg-green-50"
                : "bg-white/60";

              const rowText = isUnresponsive
                ? "line-through text-gray-400"
                : "text-gray-700";

              return (
                <tr key={order.id} className="border-b text-sm transition">
                  <td className={`py-3 font-semibold ${rowBg} ${rowText}`}>
                    {order.invoice_no}
                  </td>

                  <td className={`py-3 ${rowBg} ${rowText}`}>
                    {order.customer_phone || "-"}
                  </td>

                  <td className={`py-3 ${rowBg} ${rowText}`}>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {order.material || "-"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.shape || "-"} • {order.quantity || 0} pcs • RM{" "}
                        {Number(order.total_amount || 0).toFixed(2)}
                      </span>
                    </div>
                  </td>

                  <td className={`py-3 ${rowBg} ${rowText}`}>
                    {order.designer_name || "-"}
                  </td>

                  <td className={`py-3 ${rowBg}`}>
                    <div className="flex flex-wrap gap-1">
                      {order.has_customer_design && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                          Customer Design
                        </span>
                      )}

                      {order.is_urgent && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                          Urgent
                        </span>
                      )}

                      {isOnHold && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-700">
                          On Hold
                        </span>
                      )}

                      {isUnresponsive && (
                        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-bold text-gray-700">
                          Unresponsive
                        </span>
                      )}

                      {isCompleted && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                          Completed
                        </span>
                      )}

                      {!order.has_customer_design &&
                        !order.is_urgent &&
                        !isOnHold &&
                        !isUnresponsive &&
                        !isCompleted && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600">
                            Normal
                          </span>
                        )}
                    </div>
                  </td>

                  <td className={`py-3 ${rowBg}`}>
                    <InlineStatusSelect order={order} />
                  </td>

                  <td className={`py-3 ${rowBg}`}>
                    <OrderAgeBadge order={order} />
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
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  No orders found for this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}