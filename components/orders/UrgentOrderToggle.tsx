"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/order";

type UrgentOrderToggleProps = {
  order: Order;
};

export default function UrgentOrderToggle({ order }: UrgentOrderToggleProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function toggleUrgent() {
    setUpdating(true);

    const { error } = await supabase
      .from("orders")
      .update({
        is_urgent: !order.is_urgent,
      })
      .eq("id", order.id);

    setUpdating(false);

    if (error) {
      alert(`Failed to update urgent label: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <div className="rounded-3xl bg-white/90 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Urgent Label</h2>

      <p className="mt-1 text-sm text-gray-500">
        Mark this order as urgent if the customer wants it in a short period of time.
      </p>

      <button
        type="button"
        onClick={toggleUrgent}
        disabled={updating}
        className={`mt-5 w-full rounded-full px-5 py-4 font-bold shadow-sm disabled:opacity-60 ${
          order.is_urgent
            ? "bg-red-600 text-white"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}
      >
        {updating
          ? "Updating..."
          : order.is_urgent
          ? "Remove Urgent Label"
          : "Mark as Urgent"}
      </button>
    </div>
  );
}