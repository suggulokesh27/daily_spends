"use client";

import { useEffect, useState, useCallback } from "react";
import PageHeader from "../comman/PageHeader";
import AddBhikshaForm from "./AddBhikshaForm";
import BhikshaCard from "./BhikshaCard";
import { bhikshaService } from "@/lib/bhikshaService";

export default function BhikshaList() {
  const [bhikshaList, setBhikshaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBhiksha = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await bhikshaService.getAll();
      if (error) alert(error);
      else setBhikshaList(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBhiksha();
  }, [fetchBhiksha]);

  // Determine card background based on bhiksha_date
  const getBgColor = (bhiksha: any) => {
    const today = new Date();
    const bhikshaDate = new Date(bhiksha.bhiksha_date);

    // Same day as today
    if (
      bhikshaDate.getFullYear() === today.getFullYear() &&
      bhikshaDate.getMonth() === today.getMonth() &&
      bhikshaDate.getDate() === today.getDate()
    ) {
      return "bg-green-100 dark:bg-green-800"; // today
    }

    // Past date
    if (bhikshaDate < today) {
      return "bg-red-200 dark:bg-gray-700"; // past
    }

    // Future date
    if (bhikshaDate > today) {
      return "bg-blue-100 dark:bg-blue-800"; // upcoming
    }

    return "bg-white dark:bg-gray-800"; // fallback
  };

  return (
    <div className="p-6">
      {/* Header */}
      <PageHeader
        title="Bhiksha Donations"
        addLabel="Add Bhiksha"
        modalContent={<AddBhikshaForm onSaved={fetchBhiksha} />}
        onSaved={fetchBhiksha}
      />

      {/* Bhiksha Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-6 animate-pulse">Loading Bhiksha records...</p>
      ) : bhikshaList.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No Bhiksha records found.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {bhikshaList.map((b) => (
            <div
              key={b.id}
              className={`${getBgColor(b)} p-5 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700`}
            >
              <BhikshaCard bhiksha={b} onUpdated={fetchBhiksha} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
