import type { StockMaterial } from "@/types/stock";
import { getStockStatus, getSuggestedReorderQty } from "@/lib/stockUtils";
import StockStatusBadge from "@/components/stock/StockStatusBadge";

type StockTableProps = {
  materials: StockMaterial[];
};

export default function StockTable({ materials }: StockTableProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Material Stock</h2>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th className="py-3">Material</th>
              <th className="py-3">Current Stock</th>
              <th className="py-3">Reorder Level</th>
              <th className="py-3">Min Order Qty</th>
              <th className="py-3">Defect Buffer</th>
              <th className="py-3">Suggested Reorder</th>
              <th className="py-3">Supplier</th>
              <th className="py-3">Location</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {materials.map((material) => {
              const status = getStockStatus(material);
              const suggestedReorder = getSuggestedReorderQty(material);

              return (
                <tr key={material.id} className="border-b text-sm">
                  <td className="py-3 font-semibold text-gray-900">
                    {material.material_name}
                  </td>

                  <td className="py-3 text-gray-600">
                    {material.current_stock || 0} sheets
                  </td>

                  <td className="py-3 text-gray-600">
                    {material.reorder_level || 0} sheets
                  </td>

                  <td className="py-3 text-gray-600">
                    {material.minimum_order_qty || 0} sheets
                  </td>

                  <td className="py-3 text-gray-600">
                    {material.extra_defect_buffer || 0} sheets
                  </td>

                  <td className="py-3 font-semibold text-gray-900">
                    {suggestedReorder > 0
                      ? `${suggestedReorder} sheets`
                      : "-"}
                  </td>

                  <td className="py-3 text-gray-600">
                    {material.supplier_name || "-"}
                  </td>

                  <td className="py-3 text-gray-600">
                    {material.stock_location || "-"}
                  </td>

                  <td className="py-3">
                    <StockStatusBadge status={status} />
                  </td>
                </tr>
              );
            })}

            {materials.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  No stock materials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}