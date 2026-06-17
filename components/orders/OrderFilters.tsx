"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { orderStatuses, designers, materials } from "@/lib/options";

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const designer = searchParams.get("designer") || "";
  const material = searchParams.get("material") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/orders?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/orders");
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            Search Invoice / Phone / Customer
          </span>
          <input
            value={search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Example: STK1606101"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
          />
        </label>

        <FilterSelect
          label="Order Status"
          value={status}
          options={orderStatuses}
          onChange={(value) => updateFilter("status", value)}
        />

        <FilterSelect
          label="Designer"
          value={designer}
          options={designers}
          onChange={(value) => updateFilter("designer", value)}
        />

        <FilterSelect
          label="Material"
          value={material}
          options={materials}
          onChange={(value) => updateFilter("material", value)}
        />
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="mt-4 rounded-full border border-orange-200 px-5 py-2 text-sm font-semibold text-orange-600"
      >
        Clear Filters
      </button>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}