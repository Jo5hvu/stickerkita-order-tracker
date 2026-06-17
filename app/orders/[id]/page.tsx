import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/order";
import StatusBadge from "@/components/orders/StatusBadge";
import QuickActions from "@/components/orders/QuickActions";
import OrderUpdateForm from "@/components/orders/OrderUpdateForm";
import DeleteOrderButton from "@/components/orders/DeleteOrderButton";
import UrgentOrderToggle from "@/components/orders/UrgentOrderToggle";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function addDays(dateString: string | null, days: number) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
}

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
  const invoiceDueDate = addDays(order.order_date, 10);

  return (
    <main className="min-h-screen bg-orange-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <Link href="/orders" className="text-sm font-semibold text-orange-600">
            ← Back to Orders
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-600">
                Order Detail
              </p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                {order.invoice_no}
              </h1>

              <p className="mt-1 text-gray-500">
                {order.customer_phone}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge label={order.order_status} />
            </div>
          </div>
        </div>

        <InfoCard title="Local File Reference">
          <div className="rounded-2xl bg-orange-50 p-4">
            <p className="text-sm text-gray-500">Folder Name</p>
            <p className="mt-1 break-all text-lg font-bold text-gray-900">
              {order.folder_name || "-"}
            </p>
          </div>
        </InfoCard>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <InfoCard title="Order Information">
              <InfoRow label="Invoice Number" value={order.invoice_no} />
              <InfoRow label="Phone Number" value={order.customer_phone} />
              <InfoRow label="Sticker Type" value={order.material || order.product_type} />
              <InfoRow label="Shape" value={order.shape} />
              <InfoRow label="Pcs" value={order.quantity?.toString()} />
              <InfoRow label="Price" value={`RM ${Number(order.total_amount || 0).toFixed(2)}`} />
              <InfoRow label="Assigned Designer" value={order.designer_name} />
            </InfoCard>

            <InfoCard title="Invoice Dates">
              <InfoRow label="Invoice Open Date" value={order.order_date} />
              <InfoRow label="Invoice Due Date" value={invoiceDueDate} />
            </InfoCard>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <UrgentOrderToggle order={order} />
            <QuickActions order={order} />
            <OrderUpdateForm order={order} />
            <DeleteOrderButton order={order} />
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-900">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-100 pb-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-semibold text-gray-900">
        {value || "-"}
      </span>
    </div>
  );
}