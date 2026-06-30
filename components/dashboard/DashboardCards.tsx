import type { Order } from "@/types/order";
import { getOrderAgeStatus } from "@/lib/orderAgeUtils";

type DashboardCardsProps = {
  orders?: Order[];
};

type StatusGroup = {
  label: string;
  count: number;
  color: string;
};

function normalizeStatus(order: Order) {
  return (order.order_status || "").trim().toLowerCase();
}

function isCompletedOrder(order: Order) {
  const status = normalizeStatus(order);

  return status === "posted" || status === "delivered";
}

function isUnresponsiveOrder(order: Order) {
  return normalizeStatus(order) === "customer unresponsive";
}

function isOnHoldOrder(order: Order) {
  return normalizeStatus(order) === "customer on hold";
}

function isPriorityOrder(order: Order) {
  const ageStatus = getOrderAgeStatus(order);

  if (isCompletedOrder(order)) return false;
  if (isUnresponsiveOrder(order)) return false;
  if (isOnHoldOrder(order)) return false;

  return (
    Boolean(order.is_urgent) ||
    Boolean(order.has_customer_design) ||
    ageStatus === "Overdue" ||
    ageStatus === "Warning" ||
    ageStatus === "Customer Urgent"
  );
}

function isWaitingInvoiceOrder(order: Order) {
  const status = normalizeStatus(order);

  return status === "waiting invoice";
}

function isSubmitToPrintOrder(order: Order) {
  return normalizeStatus(order) === "submit for printing";
}

function getOrderGroups(orders: Order[]): StatusGroup[] {
  const groups = {
    priority: 0,
    waitingInvoice: 0,
    submitToPrint: 0,
    onHold: 0,
    completed: 0,
    unresponsive: 0,
  };

  orders.forEach((order) => {
    // These counts are independent.
    // One order can be counted in more than one category.

    if (isPriorityOrder(order)) {
      groups.priority += 1;
    }

    if (isWaitingInvoiceOrder(order)) {
      groups.waitingInvoice += 1;
    }

    if (isSubmitToPrintOrder(order)) {
      groups.submitToPrint += 1;
    }

    if (isOnHoldOrder(order)) {
      groups.onHold += 1;
    }

    if (isCompletedOrder(order)) {
      groups.completed += 1;
    }

    if (isUnresponsiveOrder(order)) {
      groups.unresponsive += 1;
    }
  });

  return [
    {
      label: "Priority",
      count: groups.priority,
      color: "#ef4444",
    },
    {
      label: "Waiting Invoice",
      count: groups.waitingInvoice,
      color: "#f97316",
    },
    {
      label: "Submit for Printing",
      count: groups.submitToPrint,
      color: "#8b5cf6",
    },
    {
      label: "On Hold",
      count: groups.onHold,
      color: "#eab308",
    },
    {
      label: "Completed",
      count: groups.completed,
      color: "#22c55e",
    },
    {
      label: "Unresponsive",
      count: groups.unresponsive,
      color: "#9ca3af",
    },
  ];
}

function buildConicGradient(groups: StatusGroup[], total: number) {
  if (total === 0) {
    return "conic-gradient(#e5e7eb 0% 100%)";
  }

  let currentPercentage = 0;

  const gradientParts = groups
    .filter((group) => group.count > 0)
    .map((group) => {
      const percentage = (group.count / total) * 100;
      const start = currentPercentage;
      const end = currentPercentage + percentage;

      currentPercentage = end;

      return `${group.color} ${start}% ${end}%`;
    });

  return `conic-gradient(${gradientParts.join(", ")})`;
}

export default function DashboardCards({ orders = [] }: DashboardCardsProps) {
  const groups = getOrderGroups(orders);
  const totalUniqueOrders = orders.length;
  const totalCategoryCount = groups.reduce((sum, group) => sum + group.count, 0);
  const chartBackground = buildConicGradient(groups, totalCategoryCount);

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Order Status Overview
        </h2>
        <p className="text-sm text-gray-500">
          Counts are shown by category. Priority may overlap with other statuses.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-center">
        <div className="flex justify-center">
          <div
            className="relative flex h-64 w-64 items-center justify-center rounded-full"
            style={{
              background: chartBackground,
            }}
          >
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white shadow-sm">
              <p className="text-3xl font-bold text-gray-900">
                {totalUniqueOrders}
              </p>
              <p className="text-sm font-semibold text-gray-500">
                Total Orders
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group.label}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <p className="text-sm font-bold text-gray-700">
                  {group.label}
                </p>
              </div>

              <p className="text-2xl font-bold text-gray-900">
                {group.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}