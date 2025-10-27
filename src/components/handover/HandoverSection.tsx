"use client";

import { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Pencil, CirclePlus } from "lucide-react";
import { Handover } from "@/types/handover_type";
import HandoverForm from "./HandoverForm";
import PageHeader from "../comman/PageHeader";
import Modal from "../ui/Modal";
import { handoverService } from "@/lib/handoverService";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function HandoverSection() {
  const [rowData, setRowData] = useState<Handover[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Handover | null>(null);

  const fetchHandovers = useCallback(async () => {
    try {
      const { data, error } = await handoverService.getAll();
      if (error) alert(error);
      else setRowData(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHandovers(); }, [fetchHandovers]);

  const columnDefs: ColDef<Handover>[] = [
    { field: "member.name", headerName: "Member", flex: 1, width: 150, valueGetter: (params:any) => params.data.member?.name },
    { field: "handed_amount", headerName: "Handed Amount", flex: 1, width: 150 },
    { field: "spent_amount", headerName: "Spent Amount", flex: 1, width: 150 },
    { field: "returned_amount", headerName: "Returned", flex: 1, width: 150 },
    { field: "extra_spent", headerName: "Extra Spent", flex: 1, width: 150 },
    { field: "handover_date", headerName: "Date", flex: 1, width: 150,
      valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : ""
    },
    {
      headerName: "Edit",
      width: 80,
      cellRenderer: (params: any) => (
        <button onClick={() => setEditing(params.data)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <Pencil className="w-4 h-4"/>
        </button>
      )
    }
  ];

  return (
    <div className="p-3">
      <PageHeader
        title="Handover"
        addLabel="Add Handover"
        addIcon={<CirclePlus className="w-5 h-5"/>}
        modalContent={<HandoverForm onSaved={fetchHandovers} />}
      />

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

      {editing && (
        <Modal show={!!editing} onClose={() => setEditing(null)}>
          <HandoverForm
            handover={editing}
            onSaved={() => {
              fetchHandovers();
              setEditing(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
