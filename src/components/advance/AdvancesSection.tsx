"use client";

import { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Pencil, CirclePlus } from "lucide-react";
import { Advance } from "@/types/advance_type";
import { advanceService } from "@/lib/advanceService";
import AdvanceForm from "./AdvanceForm";
import PageHeader from "../comman/PageHeader";
import Modal from "../ui/Modal";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AdvancesSection() {
  const [rowData, setRowData] = useState<Advance[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAdvance, setEditingAdvance] = useState<Advance | null>(null);

  const fetchAdvances = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await advanceService.getAll();
      if (error) alert(error);
      else setRowData(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvances();
  }, [fetchAdvances]);

  const columnDefs: ColDef<Advance>[] = [
    {
      field: "member",
      headerName: "Member",
      minWidth: 150, // minimum width for small screens
      flex: 1,
      valueGetter: (params) => params?.data?.member?.name || "",
    },
    { field: "amount", headerName: "Amount", minWidth: 100, flex: 1 },
    {
      field: "giving_date",
      headerName: "Giving Date",
      minWidth: 120,
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
      {/* PageHeader with Add Advance */}
      <PageHeader
        title="Advances"
        addLabel="Add Advance"
        addIcon={<CirclePlus className="w-5 h-5" />}
        modalContent={<AdvanceForm onSaved={() => fetchAdvances()} />}
      />

      {/* Horizontal scroll wrapper */}
      <div className="overflow-auto">
        <div style={{ minWidth: 700, height: 400 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            loading={loading}
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
