"use client";

import * as XLSX from "xlsx";
import type { Order } from "@/types/order";

type ExportOrdersButtonProps = {
  orders: Order[];
};

function addDays(dateString: string | null, days: number) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
}

export default function ExportOrdersButton({ orders }: ExportOrdersButtonProps) {
  function exportToExcel() {
    const rows = orders.map((order) => ({
      "Invoice Number": order.invoice_no,
      "Invoice Open Date": order.order_date || "-",
      "Invoice Due Date": addDays(order.order_date, 10),
      "Phone Number": order.customer_phone,
      "Sticker Type": order.material || "-",
      Shape: order.shape || "-",
      Pcs: order.quantity || 0,
      "Price (RM)": Number(order.total_amount || 0),
      Designer: order.designer_name || "-",
      Status: order.order_status || "-",
      "Folder Name": order.folder_name || "-",
      Remarks: order.remarks || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    XLSX.writeFile(workbook, "stickerkita-order-record.xlsx");
  }

  return (
    <button
      type="button"
      onClick={exportToExcel}
      className="rounded-full border border-green-200 px-5 py-3 text-center font-semibold text-green-700"
    >
      Export Excel
    </button>
  );
}