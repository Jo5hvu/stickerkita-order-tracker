export type Order = {
  id: string;
  invoice_no: string;
  order_date: string | null;
  customer_name: string | null;
  customer_phone: string;
  product_type: string;
  designer_name: string | null;

  material: string | null;
  size: string | null;
  shape: string | null;
  quantity: number | null;

  folder_name: string | null;

  payment_status: string | null;
  order_status: string | null;

  courier: string | null;
  tracking_no: string | null;

  due_date: string | null;
  posted_date: string | null;
  notes: string | null;

  price_per_package: number | null;
  total_amount: number | null;
  deposit_paid: number | null;
  balance_amount: number | null;
  deposit_status: string | null;

  design_status: string | null;
  assigned_date: string | null;
  design_deadline: string | null;
  draft_sent_date: string | null;
  approval_date: string | null;

  full_payment_status: string | null;
  print_status: string | null;
  delivery_method: string | null;
  tracking_pickup_note: string | null;
  completion_date: string | null;

  design_file_link: string | null;
  remarks: string | null;

  has_customer_design: boolean | null;
  is_urgent: boolean | null;

  created_at: string;
  updated_at: string;

  sticker_size_cm: number | null;
  sticker_width_cm: number | null;
  sticker_height_cm: number | null;
  cutting_type: string | null;

};