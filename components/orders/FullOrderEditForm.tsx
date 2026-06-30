"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import { designers, materials, shapes } from "@/lib/options";
import type { Order } from "@/types/order";

type FullOrderEditFormProps = {
  order: Order;
};

export default function FullOrderEditForm({ order }: FullOrderEditFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    invoice_no: order.invoice_no || "",
    order_date: order.order_date || "",
    customer_phone: order.customer_phone || "",
    material: order.material || "Mirrorcoate",
    shape: order.shape || "Circle",
    quantity: order.quantity?.toString() || "",
    total_amount: order.total_amount?.toString() || "",
    designer_name: order.designer_name || "Nadiah",
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
        invoice_no: form.invoice_no,
        order_date: form.order_date || null,
        customer_phone: form.customer_phone,
        material: form.material,
        shape: form.shape,
        quantity: Number(form.quantity || 0),
        total_amount: Number(form.total_amount || 0),
        designer_name: form.designer_name,
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
    <form
      onSubmit={handleUpdate}
      className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Edit Order Details
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Edit invoice, date, phone, price, shape, pcs and designer.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          label="Invoice Number"
          value={form.invoice_no}
          onChange={(v) => updateField("invoice_no", v)}
          required
        />

        <FormInput
          label="Order Date"
          type="date"
          value={form.order_date}
          onChange={(v) => updateField("order_date", v)}
          required
        />

        <FormInput
          label="Phone Number"
          value={form.customer_phone}
          onChange={(v) => updateField("customer_phone", v)}
          required
        />

        <FormSelect
          label="Sticker Type"
          value={form.material}
          options={materials}
          onChange={(v) => updateField("material", v)}
        />

        <FormSelect
          label="Shape"
          value={form.shape}
          options={shapes}
          onChange={(v) => updateField("shape", v)}
        />

        <FormInput
          label="Pcs"
          type="number"
          step="1"
          min="1"
          value={form.quantity}
          onChange={(v) => updateField("quantity", v)}
          required
        />

        <FormInput
          label="Price (RM)"
          type="number"
          step="0.01"
          min="0"
          value={form.total_amount}
          onChange={(v) => updateField("total_amount", v)}
          required
        />

        <FormSelect
          label="Designer"
          value={form.designer_name}
          options={designers}
          onChange={(v) => updateField("designer_name", v)}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-[#fd7c03] px-5 py-4 font-bold text-white shadow-sm disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Edited Order"}
      </button>
    </form>
  );
}