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
  const [isUrgent, setIsUrgent] = useState(Boolean(order.is_urgent));
  const [saving, setSaving] = useState(false);

  async function updateUrgent(value: boolean) {
    setIsUrgent(value);
    setSaving(true);

    const { error } = await supabase
      .from("orders")
      .update({ is_urgent: value })
      .eq("id", order.id);

    setSaving(false);

    if (error) {
      alert(`Failed to update urgent status: ${error.message}`);
      setIsUrgent(Boolean(order.is_urgent));
      return;
    }

    router.refresh();
  }

  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-red-50 px-4 py-3">
      <input
        type="checkbox"
        checked={isUrgent}
        disabled={saving}
        onChange={(e) => updateUrgent(e.target.checked)}
        className="h-5 w-5 accent-red-600"
      />

      <div>
        <p className="text-sm font-bold text-red-700">
          Mark order as urgent
        </p>
        <p className="text-xs text-gray-500">
          Use this when customer requests a short turnaround time.
        </p>
      </div>
    </label>
  );
}