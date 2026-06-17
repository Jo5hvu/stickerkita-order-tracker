"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/order";


type DeleteOrderButtonProps = {
  order: Order;
};

export default function DeleteOrderButton({ order }: DeleteOrderButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete order ${order.invoice_no}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    setDeleting(false);

    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }

    router.push("/orders");
    router.refresh();
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>

        <p className="mt-1 text-sm text-gray-500">
            Delete this order only if it was created by mistake.
        </p>

        <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="mt-5 w-full rounded-full border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-700 shadow-sm disabled:opacity-60"
        >
            {deleting ? "Deleting..." : "Delete Order"}
        </button>
  </div>
  );
}