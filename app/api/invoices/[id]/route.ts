import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import path from "path";
import { supabase } from "@/lib/supabase";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    return NextResponse.json(
      { error: error?.message || "Order not found" },
      { status: 404 }
    );
  }

  const workbook = new ExcelJS.Workbook();

  const templatePath = path.join(
    process.cwd(),
    "public",
    "templates",
    "stickerkita_invoice_template.xlsx"
  );

  await workbook.xlsx.readFile(templatePath);

  const sheet = workbook.getWorksheet("STICKER");

  if (!sheet) {
    return NextResponse.json(
      { error: "STICKER sheet not found in template" },
      { status: 500 }
    );
  }

  const invoiceNo = order.invoice_no || "";
  const phone = order.customer_phone || "";
  const designer = order.designer_name || "";
  const material = order.material || "-";
  const shape = order.shape || "-";
  const quantity = Number(order.quantity || 0);
  const totalAmount = Number(order.total_amount || 0);

  const invoiceDate = order.order_date
    ? new Date(order.order_date)
    : new Date();

  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 10);

  const folderName =
    order.folder_name ||
    `${invoiceNo} ${phone} - STICKER - ${designer}`.trim();

  const stickerSize = Number(order.sticker_size_cm || 0);
  const stickerWidth = Number(order.sticker_width_cm || 0);
  const stickerHeight = Number(order.sticker_height_cm || 0);

  const sizeText =
    stickerSize > 0
      ? `${stickerSize}cm`
      : stickerWidth > 0 && stickerHeight > 0
      ? `${stickerWidth}cm x ${stickerHeight}cm`
      : "-";

  const cuttingType = order.cutting_type || order.shape || "-";

  const shapeTranslations: Record<string, string> = {
    Circle: "Bulat",
    Square: "Segi Empat Sama",
    Rectangle: "Segi Empat Tepat",
    Oval: "Bujur",
    "Custom Shape": "Bentuk Custom",
  };

  const stickerShape = shapeTranslations[order.shape || ""] || order.shape || "-";

  const description = [
    `Saiz Sticker : ${sizeText}`,
    `Bentuk Sticker : ${stickerShape}`,
    `Jenis Sticker : ${material}`,
    `Jenis Potongan : ${cuttingType}`,
  ].join("\n");

  // Header / folder reference
  sheet.getCell("D3").value = folderName;

  // Invoice info
  sheet.getCell("I6").value = invoiceNo;
  sheet.getCell("I7").value = invoiceDate;
  sheet.getCell("I8").value = dueDate;

  // Bill to section is left unchanged from the Excel template
  // sheet.getCell("D6").value = `BILL TO\n${phone}`;

  // Item row
  sheet.getCell("A15").value = 1;
  sheet.getCell("B15").value = description;
  sheet.getCell("G15").value = `${quantity}pcs`;
  sheet.getCell("H15").value = totalAmount;
  sheet.getCell("I15").value = totalAmount;

  // Summary
  sheet.getCell("I21").value = totalAmount;
  sheet.getCell("I22").value = 0;
  sheet.getCell("I23").value = 0;
  sheet.getCell("I24").value = totalAmount;

  // Number formats
  sheet.getCell("I7").numFmt = "dd/mm/yyyy";
  sheet.getCell("I8").numFmt = "dd/mm/yyyy";
  sheet.getCell("H15").numFmt = '"RM" #,##0.00';
  sheet.getCell("I15").numFmt = '"RM" #,##0.00';
  sheet.getCell("I21").numFmt = '"RM" #,##0.00';
  sheet.getCell("I22").numFmt = '"RM" #,##0.00';
  sheet.getCell("I23").numFmt = '"RM" #,##0.00';
  sheet.getCell("I24").numFmt = '"RM" #,##0.00';

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${invoiceNo || "invoice"}.xlsx"`,
    },
  });
}