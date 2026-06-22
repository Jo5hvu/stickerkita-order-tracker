"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type NeededSheetsInputProps = {
  materialId: string;
  value: number;
};

export default function NeededSheetsInput({
  materialId,
  value,
}: NeededSheetsInputProps) {
  const router = useRouter();
  const [neededSheets, setNeededSheets] = useState(value.toString());
  const [saving, setSaving] = useState(false);

  async function saveNeededSheets() {
    setSaving(true);

    const { error } = await supabase
      .from("stock_materials")
      .update({
        current_needed_sheets: Number(neededSheets || 0),
      })
      .eq("id", materialId);

    setSaving(false);

    if (error) {
      alert(`Failed to update needed sheets: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={neededSheets}
        onChange={(e) => setNeededSheets(e.target.value)}
        className="w-28 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-orange-400"
      />

      <button
        type="button"
        onClick={saveNeededSheets}
        disabled={saving}
        className="rounded-xl bg-[#fd7c03] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
      >
        {saving ? "Saving" : "Save"}
      </button>
    </div>
  );
}