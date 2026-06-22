import type { Order } from "@/types/order";
import { countWorkingDays, getOrderAgeStatus } from "@/lib/orderAgeUtils";

type DashboardChartsProps = {
  orders: Order[];
};

function DonutChart({
  title,
  firstLabel,
  firstValue,
  secondLabel,
  secondValue,
}: {
  title: string;
  firstLabel: string;
  firstValue: number;
  secondLabel: string;
  secondValue: number;
}) {
  const total = firstValue + secondValue;
  const firstPercentage = total > 0 ? Math.round((firstValue / total) * 100) : 0;

  return (
    <div className="rounded-3xl bg-white/90 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <div
        className="mx-auto mt-5 flex h-44 w-44 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(#fd7c03 ${firstPercentage}%, #22c55e ${firstPercentage}% 100%)`,
        }}
      >
        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
          <p className="text-3xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-500">orders</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-green-600">{firstLabel}</span>
          <span className="font-bold text-gray-900">{firstValue}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-orange-600">{secondLabel}</span>
          <span className="font-bold text-gray-900">{secondValue}</span>
        </div>
      </div>
    </div>
  );
}

function BarStat({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="text-gray-500">{value}</span>
      </div>

      <div className="h-3 rounded-full bg-gray-100">
        <div
          className="h-3 rounded-full bg-[#fd7c03]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardCharts({ orders }: DashboardChartsProps) {
  const activeOrders = orders.filter(
    (order) =>
      order.order_status !== "Posted" &&
      order.order_status !== "Delivered"
  );

  const completedOrders = orders.filter(
    (order) =>
      order.order_status === "Posted" ||
      order.order_status === "Delivered"
  );

  const lateOrders = activeOrders.filter((order) => {
    const status = getOrderAgeStatus(order);
    return status === "Overdue" || status === "Warning" || status === "Customer Urgent";
  }).length;

  const onTrackOrders = activeOrders.filter(
    (order) => getOrderAgeStatus(order) === "On Track"
  ).length;

  const completedWithin3Days = completedOrders.filter((order) => {
    return countWorkingDays(order.order_date) <= 3;
  }).length;

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <DonutChart
        title="Order Completion Overview"
        firstLabel="Active Orders"
        firstValue={activeOrders.length}
        secondLabel="Completed Orders"
        secondValue={completedOrders.length}
      />

      <div className="rounded-3xl bg-white/90 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900">Active Order Health</h3>

        <p className="mt-1 text-sm text-gray-500">
          This chart only counts active orders, not completed orders.
        </p>

        <div className="mt-6 space-y-5">
          <BarStat
            label="On Track Active Orders"
            value={onTrackOrders}
            total={activeOrders.length}
          />

          <BarStat
            label="Late / Urgent Active Orders"
            value={lateOrders}
            total={activeOrders.length}
          />
        </div>
      </div>

      <DonutChart
        title="3-Day Completion Performance"
        firstLabel="Completed Within 3 Days"
        firstValue={completedWithin3Days}
        secondLabel="Completed After 3 Days"
        secondValue={completedOrders.length - completedWithin3Days}
      />
    </section>
  );
}