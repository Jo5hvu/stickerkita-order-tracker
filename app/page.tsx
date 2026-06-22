import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/order";
import DashboardCards from "@/components/dashboard/DashboardCards";
import DashboardCharts from "@/components/dashboard/DashBoardChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import ExportOrdersButton from "@/components/dashboard/ExportOrdersButton";
import LogoBackground from "@/components/layout/LogoBackground";
import DashboardFilters from "@/components/dashboard/DashboardFilter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type HomePageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    designer?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const status = params.status || "All";
  const designer = params.designer || "All";

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `invoice_no.ilike.%${search}%,customer_phone.ilike.%${search}%`
    );
  }

  if (status !== "All") {
    query = query.eq("order_status", status);
  }

  if (designer !== "All") {
    query = query.eq("designer_name", designer);
  }

  const { data, error } = await query;

  if (error) {
    return (
      <LogoBackground>
        <div className="mx-auto max-w-7xl">
          <p className="text-red-600">Error loading orders: {error.message}</p>
        </div>
      </LogoBackground>
    );
  }

  const orders = (data || []) as Order[];

  return (
    <LogoBackground>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/stickerkita-logo.png"
              alt="StickerKita Logo"
              className="h-16 w-auto object-contain"
            />

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Production Dashboard
              </h1>

              <p className="text-gray-500">
                Monitor StickerKita orders, production status and stock.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href="/stock"
              className="rounded-full border border-orange-200 bg-white px-5 py-3 text-center font-semibold text-orange-600"
            >
              View Stock
            </Link>

            <ExportOrdersButton orders={orders} />

            <Link
              href="/orders/new"
              className="rounded-full bg-[#fd7c03] px-5 py-3 text-center font-semibold text-white shadow-sm"
            >
              Add Order
            </Link>
          </div>
        </div>

        <DashboardFilters search={search} status={status} designer={designer} />

        <DashboardCards orders={orders} />

        <DashboardCharts orders={orders} />

        <RecentOrders orders={orders} />
      </div>
    </LogoBackground>
  );
}