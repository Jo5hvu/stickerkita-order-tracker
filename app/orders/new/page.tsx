import Link from "next/link";
import OrderForm from "@/components/orders/OrderForm";

export default function NewOrderPage() {
  return (
    <main className="min-h-screen bg-orange-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <Link href="/orders" className="text-sm font-semibold text-orange-600">
            ← Back to Orders
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Add New Order
          </h1>

          <p className="mt-1 text-gray-500">
            Enter invoice, customer phone, designer, sticker type, shape, pcs and price.
          </p>
        </div>

        <OrderForm />
      </div>
    </main>
  );
}