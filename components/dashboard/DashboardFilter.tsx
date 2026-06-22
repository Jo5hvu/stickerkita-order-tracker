"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { designers, orderStatuses } from "@/lib/options";

type DashboardFiltersProps = {
  search: string;
  status: string;
  designer: string;
};

export default function DashboardFilters({
  search,
  status,
  designer,
}: DashboardFiltersProps) {
  const router = useRouter();

  const [filter, setFilter] = useState({
    search,
    status,
    designer,
  });

  function updateField(name: string, value: string) {
    setFilter((prev) => ({ ...prev, [name]: value }));
  }

  function applyFilter() {
    const params = new URLSearchParams();

    if (filter.search) {
      params.set("search", filter.search);
    }

    if (filter.status && filter.status !== "All") {
      params.set("status", filter.status);
    }

    if (filter.designer && filter.designer !== "All") {
      params.set("designer", filter.designer);
    }

    router.push(`/?${params.toString()}`);
  }

  function clearFilter() {
    router.push("/");
  }

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Dashboard Filter</h2>
        <p className="text-sm text-gray-500">
          Filter orders by invoice number, phone number, status or designer.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <input
          value={filter.search}
          onChange={(e) => updateField("search", e.target.value)}
          placeholder="Invoice or phone..."
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-400"
        />

        <select
          value={filter.status}
          onChange={(e) => updateField("status", e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-400"
        >
          <option value="All">All Status</option>
          {orderStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={filter.designer}
          onChange={(e) => updateField("designer", e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-400"
        >
          <option value="All">All Designers</option>
          {designers.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={applyFilter}
          className="rounded-2xl bg-[#fd7c03] px-4 py-3 font-bold text-white shadow-sm"
        >
          Apply Filter
        </button>

        <button
          type="button"
          onClick={clearFilter}
          className="rounded-2xl bg-gray-100 px-4 py-3 font-bold text-gray-700"
        >
          Clear
        </button>
      </div>
    </section>
  );
}