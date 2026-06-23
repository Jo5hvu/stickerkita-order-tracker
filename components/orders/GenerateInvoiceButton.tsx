"use client";

type GenerateInvoiceButtonProps = {
  orderId: string;
};

export default function GenerateInvoiceButton({
  orderId,
}: GenerateInvoiceButtonProps) {
  function downloadInvoice() {
    window.open(`/api/invoices/${orderId}`, "_blank");
  }

  return (
    <button
      type="button"
      onClick={downloadInvoice}
      className="rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-700"
    >
      Generate Invoice Excel
    </button>
  );
}