import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/order";
import OrderTable from "@/components/orders/OrderTable";
import OrderFilters from "@/components/orders/OrderFilters";

type OrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    designer?: string;
    material?: string;
  }>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("order_status", params.status);
  }

  if (params.designer) {
    query = query.eq("designer_name", params.designer);
  }

  if (params.material) {
    query = query.eq("material", params.material);
  }

  if (params.search) {
    query = query.or(
      `invoice_no.ilike.%${params.search}%,customer_phone.ilike.%${params.search}%,customer_name.ilike.%${params.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return (
      <main className="min-h-screen bg-orange-50 p-6">
        <p className="text-red-600">Error loading orders: {error.message}</p>
      </main>
    );
  }

  const orders = (data || []) as Order[];

  return (
    <main className="min-h-screen bg-orange-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-orange-600">
              ← Back to Dashboard
            </Link>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Order Tracker
            </h1>

            <p className="text-gray-500">
              Search, filter and monitor all StickerKita orders.
            </p>
          </div>

          <Link
            href="/orders/new"
            className="rounded-full bg-[#fd7c03] px-5 py-3 text-center font-semibold text-white shadow-sm"
          >
            Add Order
          </Link>
        </div>

        <OrderFilters />

        <OrderTable orders={orders} />
      </div>
    </main>
  );
}