import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { StockMaterial } from "@/types/stock";
import StockTable from "@/components/stock/StockTable";
import LogoBackground from "@/components/layout/LogoBackground";

export default async function StockPage() {
  const { data, error } = await supabase
    .from("stock_materials")
    .select("*")
    .order("material_name", { ascending: true });

  if (error) {
    return (
      <LogoBackground>
        <div className="mx-auto max-w-7xl">
          <p className="text-red-600">Error loading stock: {error.message}</p>
        </div>
      </LogoBackground>
    );
  }

  const materials = (data || []) as StockMaterial[];

  return (
    <LogoBackground>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-orange-600">
              ← Back to Dashboard
            </Link>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Stock Tracker
            </h1>

            <p className="text-gray-500">
              Track sticker paper stock at Super Saver and restock from Super Fine.
            </p>
          </div>

          <Link
            href="/stock/movement"
            className="rounded-full bg-[#fd7c03] px-5 py-3 text-center font-semibold text-white shadow-sm"
          >
            Add Stock Movement
          </Link>
        </div>

        <StockTable materials={materials} />
      </div>
    </LogoBackground>
  );
}