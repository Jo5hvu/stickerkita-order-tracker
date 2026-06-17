export function generateFolderName(
  invoiceNo: string,
  customerPhone: string,
  productType: string,
  designerName: string
) {
  return `${invoiceNo} - ${customerPhone} - ${productType} - ${designerName}`;
}

export function calculateOrderTotal(
  material: string,
  quantity: string,
  pricePerPackage: string
) {
  const qty = Number(quantity || 0);
  const price = Number(pricePerPackage || 0);

  if (!qty || !price) return 0;

  const baseQty = material === "Transparent White Ink" ? 500 : 1000;

  return (qty / baseQty) * price;
}

export function calculateBalance(totalAmount: number, depositPaid: string) {
  return totalAmount - Number(depositPaid || 0);
}

export function isOrderOverdue(
  designDeadline: string | null,
  completionDate: string | null
) {
  if (!designDeadline || completionDate) return false;

  const today = new Date();
  const deadline = new Date(designDeadline);

  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  return today > deadline;
}