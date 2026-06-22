import type { StockMaterial } from "@/types/stock";
import NeededSheetsInput from "@/components/stock/NeedSheetsInput";

type StockTableProps = {
  materials: StockMaterial[];
};

function getStockStatus(balance: number) {
  if (balance < 0) {
    return {
      label: "Not Enough",
      className: "bg-red-100 text-red-700",
    };
  }

  if (balance === 0) {
    return {
      label: "Exact Stock",
      className: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    label: "Enough",
    className: "bg-green-100 text-green-700",
  };
}

export default function StockTable({ materials }: StockTableProps) {
  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Current Stock</h2>
        <p className="text-sm text-gray-500">
          Manually enter the current needed sheets for active production.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th className="py-3">Material</th>
              <th className="py-3">Current Stock</th>
              <th className="py-3">Current Needed Sheets</th>
              <th className="py-3">Balance After Needed Sheets</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {materials.map((material) => {
              const currentStock = Number(material.current_stock || 0);
              const neededSheets = Number(material.current_needed_sheets || 0);
              const balance = currentStock - neededSheets;
              const status = getStockStatus(balance);

              return (
                <tr key={material.id} className="border-b text-sm">
                  <td className="py-4 font-semibold text-gray-900">
                    {material.material_name}
                  </td>

                  <td className="py-4 text-gray-700">
                    {currentStock} sheets
                  </td>

                  <td className="py-4 text-gray-700">
                    <NeededSheetsInput
                      materialId={material.id}
                      value={neededSheets}
                    />
                  </td>

                  <td
                    className={`py-4 font-bold ${
                      balance < 0 ? "text-red-700" : "text-gray-900"
                    }`}
                  >
                    {balance} sheets
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}

            {materials.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
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