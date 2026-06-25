"use client";

import { useState } from "react";
import type { Order } from "@/types/order";
import { getOrderAgeStatus } from "@/lib/orderAgeUtils";

type DashboardCardsProps = {
  orders?: Order[];
};

const SALES_PIN = "6789";

export default function DashboardCards({ orders = [] }: DashboardCardsProps) {
  const [showSales, setShowSales] = useState(false);

  const totalOrders = orders.length;

  const activeOrders = orders.filter(
    (order) =>
      order.order_status !== "Delivered" &&
      order.order_status !== "Posted"
  ).length;

  const urgentOrders = orders.filter((order) => {
    const isCompleted =
      order.order_status === "Posted" || order.order_status === "Delivered";

    if (isCompleted) return false;

    const status = getOrderAgeStatus(order);

    return status === "Overdue" || status === "Customer Urgent";
  }).length;

  const totalSales = orders.reduce((sum, order) => {
    return sum + Number(order.total_amount || 0);
  }, 0);

  function handleSalesVisibility() {
    if (showSales) {
      setShowSales(false);
      return;
    }

    const pin = window.prompt("Enter PIN to view total sales:");

    if (pin === SALES_PIN) {
      setShowSales(true);
    } else if (pin !== null) {
      alert("Incorrect PIN.");
    }
  }

  const cards = [
    {
      label: "Total Orders",
      value: totalOrders,
      helper: "All orders recorded",
    },
  
    {
      label: "Urgent Orders",
      value: urgentOrders,
      helper: "Incomplete urgent or overdue orders",
    },
    {
      label: "Total Sales",
      value: showSales ? `RM ${totalSales.toFixed(2)}` : "Hidden",
      helper: showSales ? "Recorded order value" : "PIN required to view",
      isSalesCard: true,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl bg-white/90 p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-gray-500">
              {card.label}
            </p>

            {card.isSalesCard && (
              <button
                type="button"
                onClick={handleSalesVisibility}
                className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700"
              >
                {showSales ? "Hide" : "Show"}
              </button>
            )}
          </div>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {card.value}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {card.helper}
          </p>
        </div>
      ))}
    </section>
  );
}