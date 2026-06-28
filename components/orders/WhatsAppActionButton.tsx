"use client";

import type { Order } from "@/types/order";
import { getWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsappMessages";

type WhatsAppActionButtonProps = {
  order: Order;
};

export default function WhatsAppActionButton({
  order,
}: WhatsAppActionButtonProps) {
  async function copyMessage() {
    const message = getWhatsAppMessage(order);
    await navigator.clipboard.writeText(message);
    alert("WhatsApp message copied.");
  }

  function openWhatsApp() {
    window.open(getWhatsAppUrl(order), "_blank");
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={openWhatsApp}
        className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-700"
      >
        Open WhatsApp Update
      </button>

      <button
        type="button"
        onClick={copyMessage}
        className="rounded-2xl bg-green-50 px-5 py-3 text-sm font-bold text-green-700 shadow-sm hover:bg-green-100"
      >
        Copy WhatsApp Message
      </button>
    </div>
  );
}