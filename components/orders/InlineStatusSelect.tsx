"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { orderStatuses } from "@/lib/options";
import type { Order } from "@/types/order";

type InlineStatusSelectProps = {
  order: Order;
};

function getStatusClass(status: string) {
  if (status === "Posted" || status === "Delivered") {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (status === "Packed" || status === "Ready to be Cut") {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }

  if (status === "Printed" || status === "Submit for Printing") {
    return "bg-purple-100 text-purple-700 border-purple-200";
  }

  if (status === "Payment Made" || status === "Design Confirm") {
    return "bg-orange-100 text-orange-700 border-orange-200";
  }

  return "bg-gray-100 text-gray-700 border-gray-200";
}

export default function InlineStatusSelect({ order }: InlineStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(order.order_status || "");
  const [updating, setUpdating] = useState(false);

  async function updateStatus(newStatus: string) {
    setStatus(newStatus);
    setUpdating(true);

    const updateData: {
      order_status: string;
      completion_date?: string;
    } = {
      order_status: newStatus,
    };

    if (
      (newStatus === "Posted" || newStatus === "Delivered") &&
      !order.completion_date
    ) {
      updateData.completion_date = new Date().toISOString().slice(0, 10);
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", order.id);

    setUpdating(false);

    if (error) {
      alert(`Failed to update status: ${error.message}`);
      setStatus(order.order_status || "");
      return;
    }

    router.refresh();
  }

  return (
    <select
      value={status}
      disabled={updating}
      onChange={(e) => updateStatus(e.target.value)}
      className={`rounded-xl border px-3 py-2 text-sm font-bold outline-none disabled:opacity-60 ${getStatusClass(
        status
      )}`}
    >
      {orderStatuses.map((item) => (
        <option key={item} value={item} className="bg-white text-gray-900">
          {item}
        </option>
      ))}
    </select>
  );
}