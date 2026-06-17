"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import { stockMovementTypes } from "@/lib/options";
import StockMaterialSelect from "@/components/stock/StockMaterialSelect";
import type { StockMaterial } from "@/types/stock";


type StockMovementFormProps = {
  materials: StockMaterial[];
};

export default function StockMovementForm({ materials }: StockMovementFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    material_id: materials[0]?.id || "",
    movement_type: "Stock In",
    quantity: "",
    related_invoice_no: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const selectedMaterial = materials.find(
    (material) => material.id === form.material_id
  );

  function getNewStockBalance() {
    const currentStock = Number(selectedMaterial?.current_stock || 0);
    const quantity = Number(form.quantity || 0);

    if (form.movement_type === "Stock In") {
      return currentStock + quantity;
    }

    return currentStock - quantity;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedMaterial) {
      setErrorMessage("Please select a material.");
      return;
    }

    const quantity = Number(form.quantity || 0);

    if (quantity <= 0) {
      setErrorMessage("Quantity must be more than 0.");
      return;
    }

    const newStockBalance = getNewStockBalance();

    if (newStockBalance < 0) {
      setErrorMessage("Stock cannot become negative. Please check the quantity.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const { error: movementError } = await supabase
      .from("stock_movements")
      .insert({
        material_id: form.material_id,
        movement_type: form.movement_type,
        quantity,
        related_invoice_no: form.related_invoice_no || null,
        notes: form.notes || null,
        movement_date: new Date().toISOString().slice(0, 10),
      });

    if (movementError) {
      setSaving(false);
      setErrorMessage(movementError.message);
      return;
    }

    const { error: stockError } = await supabase
      .from("stock_materials")
      .update({
        current_stock: newStockBalance,
      })
      .eq("id", form.material_id);

    setSaving(false);

    if (stockError) {
      setErrorMessage(stockError.message);
      return;
    }

    router.push("/stock");
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
          Stock Movement
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <StockMaterialSelect
            label="Material"
            value={form.material_id}
            materials={materials}
            onChange={(v) => updateField("material_id", v)}
          />

          <FormSelect
            label="Movement Type"
            value={form.movement_type}
            options={stockMovementTypes}
            onChange={(v) => updateField("movement_type", v)}
          />

          <FormInput
            label="Quantity (Sheets)"
            type="number"
            value={form.quantity}
            onChange={(v) => updateField("quantity", v)}
            placeholder="Example: 100"
            required
          />

          <FormInput
            label="Related Invoice No. Optional"
            value={form.related_invoice_no}
            onChange={(v) => updateField("related_invoice_no", v)}
            placeholder="Example: STK1606101"
          />
        </div>
      </section>

      {selectedMaterial && (
        <section className="rounded-2xl bg-orange-50 p-4">
          <p className="text-sm text-gray-500">Selected Material</p>
          <p className="mt-1 font-bold text-gray-900">
            {selectedMaterial.material_name}
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedMaterial.current_stock || 0} sheets
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">After Movement</p>
              <p className="text-2xl font-bold text-gray-900">
                {form.quantity ? getNewStockBalance() : selectedMaterial.current_stock || 0} sheets
              </p>
            </div>
          </div>
        </section>
      )}

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700">
          Notes
        </span>
        <textarea
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-400"
          placeholder="Example: Stock received from Super Fine / Used for urgent order / Printing defect..."
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-[#fd7c03] px-5 py-4 font-bold text-white shadow-sm disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Stock Movement"}
      </button>
    </form>
  );
}