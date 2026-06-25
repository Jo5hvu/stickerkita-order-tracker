import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/order";
import LogoBackground from "@/components/layout/LogoBackground";
import FullOrderEditForm from "@/components/orders/FullOrderEditForm";
import OrderUpdateForm from "@/components/orders/OrderUpdateForm";
import DeleteOrderButton from "@/components/orders/DeleteOrderButton";
import GenerateInvoiceButton from "@/components/orders/GenerateInvoiceButton";
import StatusBadge from "@/components/orders/StatusBadge";
import UrgentOrderToggle from "@/components/orders/UrgentOrderToggle";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const order = data as Order;

  return (
    <LogoBackground>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-white/90 p-6 shadow-sm">
          <Link href="/" className="text-sm font-semibold text-orange-600">
            ← Back to Dashboard
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p className="text-sm font-bold text-orange-600">Order Detail</p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                {order.invoice_no}
              </h1>

              <p className="mt-2 text-gray-500">
                {order.customer_phone || "-"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {order.material || "-"}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {order.shape || "-"}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {order.quantity || 0} pcs
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1">
                  RM {Number(order.total_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl bg-gray-50 p-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Current Status
                </p>
                <StatusBadge label={order.order_status} />
              </div>

              <UrgentOrderToggle order={order} />

              <GenerateInvoiceButton orderId={order.id} />
            </div>
          </div>
        </section>

        <FullOrderEditForm order={order} />

        <OrderUpdateForm order={order} />

        <section className="rounded-3xl border border-red-100 bg-white/90 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-red-700">Danger Zone</h2>
              <p className="text-sm text-gray-500">
                Delete this order only if it was created by mistake.
              </p>
            </div>

            <DeleteOrderButton order={order} />
          </div>
        </section>
      </div>
    </LogoBackground>
  );
}