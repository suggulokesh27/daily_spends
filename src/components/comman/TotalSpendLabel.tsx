"use client";

import React from "react";

interface TotalSpendLabelProps {
  total: number;
  label?: string;
  className?: string;
}

export default function TotalSpendLabel({
  total,
  label = "Total Spent",
  className = "",
}: TotalSpendLabelProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm ${className}`}
    >
      <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
        {label} :
      </span>
      <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
         ₹ {total.toLocaleString()}
      </span>
    </div>
  );
}
