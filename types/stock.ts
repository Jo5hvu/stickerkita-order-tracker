export type StockMaterial = {
  id: string;
  material_name: string;
  supplier_name: string | null;
  stock_location: string | null;
  current_stock: number | null;
  minimum_order_qty: number | null;
  reorder_level: number | null;
  extra_defect_buffer: number | null;
  sheet_price: number | null;
  created_at: string;
  updated_at: string;
};

export type StockMovement = {
  id: string;
  material_id: string;
  movement_type: string;
  quantity: number;
  related_invoice_no: string | null;
  defect_quantity: number | null;
  notes: string | null;
  movement_date: string | null;
  created_at: string;
};