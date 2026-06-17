"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { orderStatuses } from "@/lib/options";
import type { Order } from "@/types/order";

type QuickActionsProps = {
  order: Order;
};

export default function QuickActions({ order }: QuickActionsProps) {
  const router = useRouter();
  const [loadingStatus, setLoadingStatus] = useState("");

  async function updateStatus(status: string) {
    setLoadingStatus(status);

    const { data, error } = await supabase
      .from("orders")
      .update({
        order_status: status,
      })
      .eq("id", order.id)
      .select();

    setLoadingStatus("");

    if (error) {
      alert(`Update failed: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      alert("No order was updated. Please check Supabase policy.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Quick Status Update</h2>

      <p className="mt-1 text-sm text-gray-500">
        Current status:{" "}
        <span className="font-semibold text-orange-600">
          {order.order_status || "-"}
        </span>
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {orderStatuses.map((status) => (
          <button
            key={status}
            type="button"
            disabled={loadingStatus === status}
            onClick={() => updateStatus(status)}
            className={`rounded-2xl px-4 py-3 text-sm font-bold shadow-sm disabled:opacity-60 ${
              order.order_status === status
                ? "bg-[#fd7c03] text-white"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {loadingStatus === status ? "Updating..." : status}
          </button>
        ))}
      </div>
    </div>
  );
}