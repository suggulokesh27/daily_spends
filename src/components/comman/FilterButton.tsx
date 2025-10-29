"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { SelectAutoComplete } from "./SelectAutoComplete";

export interface FilterValues {
  startDate?: string;
  endDate?: string;
  memberId?: string;
}

interface FilterButtonProps {
  onApply?: (filters: FilterValues) => void;
  showMember?: boolean;
}

export default function FilterButton({
  onApply,
  showMember = true,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    startDate: "",
    endDate: "",
    memberId: "",
  });

  // ✅ Check if any filter is active
  const isActive = useMemo(() => {
    return (
      filters.startDate !== "" ||
      filters.endDate !== "" ||
      (showMember && filters.memberId !== "")
    );
  }, [filters, showMember]);

  const handleApply = () => {
    onApply?.(filters);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = { startDate: "", endDate: "", memberId: "" };
    setFilters(cleared);
    onApply?.(cleared);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={`flex items-center gap-2 relative ${
            isActive ? "border border-blue-500 bg-blue-50 text-blue-600" : ""
          }`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <Filter className="w-4 h-4" />
          Filter
          {/* 🔵 Small active indicator dot */}
          {isActive && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-4 space-y-3">
        <div>
          <label className="text-sm text-gray-500">Start Date</label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">End Date</label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>

        {showMember && (
          <div>
            <label className="text-sm text-gray-500">Member</label>
            <SelectAutoComplete
              table="members"
              labelField="name"
              valueField="id"
              value={filters.memberId || ""}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, memberId: val }))
              }
            />
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Button className="w-full" onClick={handleApply}>
            Apply
          </Button>
          <Button
            className="w-full"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
