"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import { orderStatuses } from "@/lib/options";
import type { Order } from "@/types/order";

type OrderUpdateFormProps = {
  order: Order;
};

export default function OrderUpdateForm({ order }: OrderUpdateFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    order_status: order.order_status || "Waiting Customer to Respond",
    tracking_pickup_note: order.tracking_pickup_note || "",
    completion_date: order.completion_date || "",
    remarks: order.remarks || "",
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("orders")
      .update({
        order_status: form.order_status,
        tracking_pickup_note: form.tracking_pickup_note,
        completion_date: form.completion_date || null,
        remarks: form.remarks,
      })
      .eq("id", order.id);

    setSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Update Order</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update the main order status, tracking note and remarks.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <FormSelect
        label="Order Status"
        value={form.order_status}
        options={orderStatuses}
        onChange={(v) => updateField("order_status", v)}
      />

      <FormInput
        label="Tracking / Pickup Note"
        value={form.tracking_pickup_note}
        onChange={(v) => updateField("tracking_pickup_note", v)}
        placeholder="Example: J&T 6300xxxxxxx / Pickup at shop"
      />

      <FormInput
        label="Completion Date"
        type="date"
        value={form.completion_date}
        onChange={(v) => updateField("completion_date", v)}
      />

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700">
          Remarks
        </span>
        <textarea
          value={form.remarks}
          onChange={(e) => updateField("remarks", e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
          placeholder="Add customer request, issue, revision note, production note..."
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-[#fd7c03] px-5 py-4 font-bold text-white shadow-sm disabled:opacity-60"
      >
        {saving ? "Updating..." : "Update Order"}
      </button>
    </form>
  );
}