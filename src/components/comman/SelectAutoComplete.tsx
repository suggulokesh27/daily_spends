"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SelectAutoCompleteProps {
  table: string;
  labelField: string;
  valueField: string;
  value?: string;
  onChange: (value: string) => void;
}

export function SelectAutoComplete({
  table,
  labelField,
  valueField,
  value,
  onChange,
}: SelectAutoCompleteProps) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      const { data, error } = await supabase.from(table).select("*");
      if (!error && data) {
        setOptions(
          data.map((item: any) => ({
            label: item[labelField],
            value: item[valueField],
          }))
        );
      }
      setLoading(false);
    };
    fetchOptions();
  }, [table, labelField, valueField]);

  return (
    <select
      className="w-full h-10 border border-gray-300 rounded-md px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{loading ? "Loading..." : "Select..."}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
