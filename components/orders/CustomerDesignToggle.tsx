"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/order";

type CustomerDesignToggleProps = {
  order: Order;
};

export default function CustomerDesignToggle({
  order,
}: CustomerDesignToggleProps) {
  const router = useRouter();
  const [hasDesign, setHasDesign] = useState(Boolean(order.has_customer_design));
  const [saving, setSaving] = useState(false);

  async function updateCustomerDesign(value: boolean) {
    setHasDesign(value);
    setSaving(true);

    const { error } = await supabase
      .from("orders")
      .update({ has_customer_design: value })
      .eq("id", order.id);

    setSaving(false);

    if (error) {
      alert(`Failed to update customer design status: ${error.message}`);
      setHasDesign(Boolean(order.has_customer_design));
      return;
    }

    router.refresh();
  }

  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3">
      <input
        type="checkbox"
        checked={hasDesign}
        disabled={saving}
        onChange={(e) => updateCustomerDesign(e.target.checked)}
        className="h-5 w-5 accent-blue-600"
      />

      <div>
        <p className="text-sm font-bold text-blue-700">
          Customer already has design
        </p>
        <p className="text-xs text-gray-500">
          Prioritize this order because the customer has provided their design.
        </p>
      </div>
    </label>
  );
}