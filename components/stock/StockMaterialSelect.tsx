import type { StockMaterial } from "@/types/stock";

type StockMaterialSelectProps = {
  label: string;
  value: string;
  materials: StockMaterial[];
  onChange: (value: string) => void;
};

export default function StockMaterialSelect({
  label,
  value,
  materials,
  onChange,
}: StockMaterialSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-400"
      >
        {materials.map((material) => (
          <option key={material.id} value={material.id} className="text-gray-900">
            {material.material_name}
          </option>
        ))}
      </select>
    </label>
  );
}