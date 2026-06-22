export type StockMaterial = {
  id: string;
  material_name: string;
  supplier_name: string | null;
  stock_location: string | null;
  current_stock: number | null;
  current_needed_sheets: number | null;
  minimum_order_qty: number | null;
  reorder_level: number | null;
  extra_defect_buffer: number | null;
  sheet_price: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type StockMovement = {
  id: string;
  material_id: string;
  movement_type: string;
  quantity: number;
  price_per_sheet: number | null;
  total_amount: number | null;
  related_invoice_no: string | null;
  notes: string | null;
  movement_date: string | null;
  created_at: string | null;
};