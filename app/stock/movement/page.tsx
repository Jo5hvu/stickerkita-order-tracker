import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { StockMaterial } from "@/types/stock";
import StockMovementForm from "@/components/stock/StockMovementForm";

export default async function StockMovementPage() {
  const { data, error } = await supabase
    .from("stock_materials")
    .select("*")
    .order("material_name", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-orange-50 p-6">
        <p className="text-red-600">
          Error loading stock materials: {error.message}
        </p>
      </main>
    );
  }

  const materials = (data || []) as StockMaterial[];

  return (
    <main className="min-h-screen bg-orange-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <Link href="/stock" className="text-sm font-semibold text-orange-600">
            ← Back to Stock
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Add Stock Movement
          </h1>

          <p className="mt-1 text-gray-500">
            Record stock in, stock used, or defective sheets.
          </p>
        </div>

        {materials.length > 0 ? (
          <StockMovementForm materials={materials} />
        ) : (
          <div className="rounded-3xl bg-white p-6 text-gray-600 shadow-sm">
            No stock materials found. Please add stock materials in Supabase first.
          </div>
        )}
      </div>
    </main>
  );
}