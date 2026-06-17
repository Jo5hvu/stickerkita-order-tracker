import type { Order } from "@/types/order";
import { isOrderOverdue } from "@/lib/orderUtils";

export function getDashboardSummary(orders: Order[]) {
  const totalOrders = orders.length;

  const designPending = orders.filter(
    (order) =>
      order.design_status === "Not Started" ||
      order.design_status === "Waiting Customer Details" ||
      order.order_status === "Design Pending"
  ).length;

  const waitingApproval = orders.filter(
    (order) =>
      order.design_status === "Waiting Approval" ||
      order.order_status === "Waiting Approval"
  ).length;

  const readyToPrint = orders.filter(
    (order) =>
      order.order_status === "Ready to Print" ||
      order.print_status === "Ready to Print"
  ).length;

  const printing = orders.filter(
    (order) =>
      order.order_status === "Printing" ||
      order.print_status === "Printing"
  ).length;

  const completed = orders.filter(
    (order) =>
      order.order_status === "Completed" ||
      order.completion_date
  ).length;

  const overdue = orders.filter((order) =>
    isOrderOverdue(order.design_deadline, order.completion_date)
  ).length;

  const totalUnpaidBalance = orders.reduce((sum, order) => {
    const isCompleted = order.order_status === "Completed" || order.completion_date;

    if (isCompleted) return sum;

    return sum + Number(order.balance_amount || 0);
  }, 0);

  return {
    totalOrders,
    designPending,
    waitingApproval,
    readyToPrint,
    printing,
    completed,
    overdue,
    totalUnpaidBalance,
  };
}