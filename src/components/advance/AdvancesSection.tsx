"use client";

import { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Pencil, CirclePlus, Search } from "lucide-react";
import { Advance } from "@/types/advance_type";
import { advanceService } from "@/lib/advanceService";
import AdvanceForm from "./AdvanceForm";
import PageHeader from "../comman/PageHeader";
import Modal from "../ui/Modal";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AdvancesSection() {
  const [rowData, setRowData] = useState<Advance[]>([]);
  const [filteredData, setFilteredData] = useState<Advance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingAdvance, setEditingAdvance] = useState<Advance | null>(null);

  const fetchAdvances = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await advanceService.getAll();
      if (error) alert(error);
      else {
        setRowData(data || []);
        setFilteredData(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvances();
  }, [fetchAdvances]);

  // 🔍 Filter rows by search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(rowData);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredData(
      rowData.filter((item) => {
        const memberName = item?.member?.name?.toLowerCase() || "";
        const bhikshaName = item?.bhiksha?.name?.toLowerCase() || "";
        const donationName = item?.donation_name?.toLowerCase() || "";
        return (
          memberName.includes(term) ||
          bhikshaName.includes(term) ||
          donationName.includes(term)
        );
      })
    );
  }, [searchTerm, rowData]);

  const columnDefs: ColDef<Advance>[] = [
    {
      headerName: "Source Type",
      field: "source_type",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params) =>
        params.value
          ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
          : "",
    },
    {
      headerName: "Source Name",
      minWidth: 150,
      flex: 1.5,
      valueGetter: (params) => {
        const data = params.data;
        if (data?.source_type === "member") return data?.member?.name || "";
        if (data?.source_type === "bhiksha")
          return data?.bhiksha?.name || "";
        if (data?.source_type === "donation") return data?.donation_name || "";
        return "";
      },
    },
    { field: "amount", headerName: "Amount", minWidth: 100, flex: 1, cellClassRules: {
    "bg-bhiksha": (params) => params?.data?.source_type === "bhiksha",
    "bg-donation": (params) => params?.data?.source_type === "donation",
  }, },
    {
      field: "giving_date",
      headerName: "Giving Date",
      minWidth: 130,
      flex: 1,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    { field: "note", headerName: "Note", minWidth: 200, flex: 2 },
    {
      headerName: "Edit",
      minWidth: 80,
      flex: 0.5,
      cellRenderer: (params: any) => (
        <button
          onClick={() => setEditingAdvance(params.data)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Pencil className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-3">
      {/* PageHeader with Add Advance and Search */}
      <PageHeader
        title="Advances"
        addLabel="Add Advance"
        addIcon={<CirclePlus className="w-5 h-5" />}
        modalContent={<AdvanceForm onSaved={fetchAdvances} />}
      >
        {/* 🔍 Search Input */}
        <div className="relative w-60">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </PageHeader>

      {/* Table */}
      <div className="overflow-auto">
        <div style={{ minWidth: 800, height: 400 }}>
          <AgGridReact
            rowData={filteredData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            loading={loading}
            getRowStyle={(params) => {
    switch (params.data?.source_type) {
      case "bhiksha":
        return { backgroundColor: "#f0f9ff" }; // light blue
      case "donation":
        return { backgroundColor: "#fff7ed" }; // light orange
      default:
        return undefined; // for member or any other
    }
  }}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {editingAdvance && (
        <Modal show={!!editingAdvance} onClose={() => setEditingAdvance(null)}>
          <AdvanceForm
            advance={editingAdvance}
            onSaved={() => {
              fetchAdvances();
              setEditingAdvance(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
