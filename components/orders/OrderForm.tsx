"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import { designers, materials, shapes } from "@/lib/options";
import { generateFolderName } from "@/lib/orderUtils";

export default function OrderForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    invoice_no: "",
    customer_phone: "",
    product_type: "STICKER",
    designer_name: "Nadiah",
    material: "Mirrorcoate",
    shape: "Circle",
    quantity: "",
    total_amount: "",
    is_urgent: false,
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateCheckbox(name: string, checked: boolean) {
  setForm((prev) => ({ ...prev, [name]: checked }));
}

  const folderName = generateFolderName(
    form.invoice_no,
    form.customer_phone,
    form.product_type,
    form.designer_name
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setErrorMessage("");

    const { error } = await supabase.from("orders").insert({
      invoice_no: form.invoice_no,
      customer_phone: form.customer_phone,
      product_type: form.product_type,
      designer_name: form.designer_name,
      material: form.material,
      shape: form.shape,
      quantity: Number(form.quantity || 0),
      total_amount: Number(form.total_amount || 0),
      folder_name: folderName,
      order_status: "Waiting Invoice",
      order_date: new Date().toISOString().slice(0, 10),
      is_urgent: form.is_urgent,
    });

    setSaving(false);

    if (error) {
      if (error.message.includes("orders_invoice_no_key")) {
        setErrorMessage(
          "This invoice number already exists. Please use a different invoice number."
        );
      } else {
        setErrorMessage(error.message);
      }

      return;
    }

    router.push("/orders");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl bg-white p-6 shadow-sm"
    >
      {errorMessage && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Order Details
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Invoice Number"
            value={form.invoice_no}
            onChange={(v) => updateField("invoice_no", v)}
            placeholder="Example: STK1606101"
            required
          />

          <FormInput
            label="Customer Phone Number"
            value={form.customer_phone}
            onChange={(v) => updateField("customer_phone", v)}
            placeholder="Example: 0123456789"
            required
          />

          <FormSelect
            label="Assigned Designer"
            value={form.designer_name}
            options={designers}
            onChange={(v) => updateField("designer_name", v)}
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
            step="100"
            min="100"
            value={form.quantity}
            onChange={(v) => updateField("quantity", v)}
            placeholder="Example: 1000"
            required
          />

          <FormInput
            label="Price (RM)"
            type="number"
            value={form.total_amount}
            onChange={(v) => updateField("total_amount", v)}
            placeholder="Example: 59"
            required
          />

          <label className="flex items-center gap-3 rounded-2xl bg-red-50 p-4">
            <input
              type="checkbox"
              checked={form.is_urgent}
              onChange={(e) => updateCheckbox("is_urgent", e.target.checked)}
              className="h-5 w-5 accent-red-600"
            />

            <div>
              <p className="font-bold text-gray-900">Mark as Urgent Order</p>
              <p className="text-sm text-gray-500">
                Use this when customer wants the order completed in a short period of time.
              </p>
            </div>
          </label>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Local Folder Reference
        </h2>

        <div className="rounded-2xl bg-orange-50 p-4">
          <p className="text-sm text-gray-500">Generated Folder Name</p>
          <p className="mt-1 break-all font-semibold text-gray-900">
            {folderName}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Starting Status
        </h2>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Order Status</p>
          <p className="mt-1 font-semibold text-gray-900">
            Waiting Invoice
          </p>
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-[#fd7c03] px-5 py-4 font-bold text-white shadow-sm disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Order"}
      </button>
    </form>
  );
}