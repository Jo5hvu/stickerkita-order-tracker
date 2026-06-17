import type { Order } from "@/types/order";

export function countWorkingDays(startDate: string | null) {
  if (!startDate) return 0;

  const start = new Date(startDate);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (start > today) return 0;

  let workingDays = 0;
  const current = new Date(start);

  while (current <= today) {
    const day = current.getDay();

    if (day !== 0 && day !== 6) {
      workingDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return Math.max(workingDays - 1, 0);
}

export function isCompletedOrder(order: Order) {
  return order.order_status === "Posted" || order.order_status === "Delivered";
}

export function getOrderAgeStatus(order: Order) {
  if (isCompletedOrder(order)) {
    return "Completed";
  }

  if (order.is_urgent) {
    return "Customer Urgent";
  }

  const workingDays = countWorkingDays(order.order_date);

  if (workingDays >= 5) {
    return "Overdue";
  }

  if (workingDays >= 3) {
    return "Warning";
  }

  return "On Track";
}

export function getOrderAgeLabel(order: Order) {
  if (isCompletedOrder(order)) {
    return "Completed";
  }

  const workingDays = countWorkingDays(order.order_date);

  if (order.is_urgent) {
    return `Urgent • ${workingDays} working days`;
  }

  if (workingDays === 1) {
    return "1 working day";
  }

  return `${workingDays} working days`;
}