import type { StockMaterial } from "@/types/stock";

export function getSuggestedReorderQty(material: StockMaterial) {
  const currentStock = Number(material.current_stock || 0);
  const reorderLevel = Number(material.reorder_level || 0);
  const minimumOrderQty = Number(material.minimum_order_qty || 100);
  const defectBuffer = Number(material.extra_defect_buffer || 0);

  if (currentStock > reorderLevel) return 0;

  const neededQty = reorderLevel - currentStock + defectBuffer;

  return Math.ceil(neededQty / minimumOrderQty) * minimumOrderQty;
}

export function getStockStatus(material: StockMaterial) {
  const currentStock = Number(material.current_stock || 0);
  const reorderLevel = Number(material.reorder_level || 0);

  if (currentStock <= 0) return "Out of Stock";
  if (currentStock <= reorderLevel) return "Low Stock";

  return "OK";
}