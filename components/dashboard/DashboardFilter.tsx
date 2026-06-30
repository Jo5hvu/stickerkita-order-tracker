"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { designers, orderStatuses } from "@/lib/options";

type DashboardFiltersProps = {
  search?: string;
  status?: string;
  designer?: string;
  view?: string;
};

const views = [
  { label: "Active", value: "active" },
  { label: "Priority", value: "priority" },
  { label: "On Hold", value: "on-hold" },
  { label: "Unresponsive", value: "unresponsive" },
  { label: "Completed", value: "completed" },
  { label: "All", value: "all" },
];

export default function DashboardFilters({
  search = "",
  status = "All",
  designer = "All",
}: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "active";

  const [searchValue, setSearchValue] = useState(search);
  const [statusValue, setStatusValue] = useState(status);
  const [designerValue, setDesignerValue] = useState(designer);

  function updateUrl({
    newView = currentView,
    newSearch = searchValue,
    newStatus = statusValue,
    newDesigner = designerValue,
  }: {
    newView?: string;
    newSearch?: string;
    newStatus?: string;
    newDesigner?: string;
  }) {
    const params = new URLSearchParams();

    params.set("view", newView || "active");

    if (newSearch.trim()) {
      params.set("search", newSearch.trim());
    }

    if (newStatus && newStatus !== "All") {
      params.set("status", newStatus);
    }

    if (newDesigner && newDesigner !== "All") {
      params.set("designer", newDesigner);
    }

    router.push(`/?${params.toString()}`, { scroll: false });
    router.refresh();
  }

  function updateView(newView: string) {
    updateUrl({ newView });
  }

  function updateStatus(newStatus: string) {
    setStatusValue(newStatus);
    updateUrl({ newStatus });
  }

  function updateDesigner(newDesigner: string) {
    setDesignerValue(newDesigner);
    updateUrl({ newDesigner });
  }

  function clearFilter() {
    setSearchValue("");
    setStatusValue("All");
    setDesignerValue("All");

    router.push("/?view=active", { scroll: false });
    router.refresh();
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateUrl({ newSearch: searchValue });
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <section className="rounded-3xl bg-white/90 p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Filter Orders</h2>
        <p className="text-sm text-gray-500">
          Filter updates automatically when you type or select an option.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {views.map((item) => {
          const active = currentView === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => updateView(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                active
                  ? "bg-[#fd7c03] text-white"
                  : "bg-orange-50 text-orange-700 hover:bg-orange-100"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search invoice / phone"
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-orange-400"
        />

        <select
          value={statusValue}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-orange-400"
        >
          <option value="All">All Status</option>
          {orderStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={designerValue}
          onChange={(e) => updateDesigner(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-orange-400"
        >
          <option value="All">All Designer</option>
          {designers.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={clearFilter}
          className="rounded-2xl bg-gray-100 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200"
        >
          Clear Filter
        </button>
      </div>
    </section>
  );
}