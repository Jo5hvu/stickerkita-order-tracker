import type { Order } from "@/types/order";

function cleanPhoneNumber(phone: string) {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = `60${cleaned.slice(1)}`;
  }

  if (!cleaned.startsWith("60")) {
    cleaned = `60${cleaned}`;
  }

  return cleaned;
}

export function getWhatsAppMessage(order: Order) {
  const invoiceNo = order.invoice_no || "-";
  const designer = order.designer_name || "-";
  const status = order.order_status || "";
  const trackingNote = order.tracking_pickup_note || "";

  if (status === "Waiting Customer to Respond") {
    return `Hi, StickerKita di sini 😊

Kami telah menerima pertanyaan / detail tempahan sticker anda.

No. Invoice: ${invoiceNo}

Team kami akan semak detail tempahan anda dan update anda sebentar lagi. Terima kasih!`;
  }

  if (status === "Design Confirm") {
    return `Hi, StickerKita di sini 😊

Design sticker anda telah disahkan.

No. Invoice: ${invoiceNo}
Designer: ${designer}

Kami akan teruskan ke proses seterusnya.`;
  }

  if (status === "Payment Made") {
    return `Hi, StickerKita di sini 😊

Bayaran untuk tempahan anda telah diterima.

No. Invoice: ${invoiceNo}

Terima kasih! Tempahan anda akan disediakan untuk proses printing.`;
  }

  if (status === "Submit for Printing") {
    return `Hi, StickerKita di sini 😊

Tempahan anda telah dihantar untuk proses printing.

No. Invoice: ${invoiceNo}

Kami akan update semula selepas sticker siap dicetak.`;
  }

  if (status === "Printed") {
    return `Hi, StickerKita di sini 😊

Sticker anda telah siap dicetak.

No. Invoice: ${invoiceNo}

Seterusnya, kami akan teruskan dengan proses cutting dan packing.`;
  }

  if (status === "Ready to be Cut") {
    return `Hi, StickerKita di sini 😊

Sticker anda sudah bersedia untuk proses cutting.

No. Invoice: ${invoiceNo}

Kami akan update semula selepas tempahan siap dipack.`;
  }

  if (status === "Packed") {
    return `Hi, StickerKita di sini 😊

Tempahan anda telah siap dipack.

No. Invoice: ${invoiceNo}

Tempahan akan dipos / diserahkan untuk pickup tidak lama lagi.`;
  }

  if (status === "Posted") {
    return `Hi, StickerKita di sini 😊

Tempahan anda telah dipos.

No. Invoice: ${invoiceNo}
Tracking / Nota: ${trackingNote || "-"}

Terima kasih kerana membuat tempahan dengan StickerKita!`;
  }

  if (status === "Delivered") {
    return `Hi, StickerKita di sini 😊

Tempahan anda telah berjaya dihantar.

No. Invoice: ${invoiceNo}

Terima kasih kerana memilih StickerKita. Semoga anda suka dengan sticker anda! 😊`;
  }

  return `Hi, StickerKita di sini 😊

Berikut adalah update untuk tempahan anda.

No. Invoice: ${invoiceNo}
Status: ${status}`;
}

export function getWhatsAppUrl(order: Order) {
  const phone = cleanPhoneNumber(order.customer_phone || "");
  const message = getWhatsAppMessage(order);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}