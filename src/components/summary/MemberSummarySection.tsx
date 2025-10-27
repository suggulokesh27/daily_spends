"use client";

import { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import PageHeader from "../comman/PageHeader";
import { MemberSummary } from "@/types/member_summary_type";
import { supabase } from "@/lib/supabaseClient";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function MemberSummarySection() {
  const [rowData, setRowData] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("member_summary")
        .select("*");
      if (error) console.error(error);
      else setRowData(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const columnDefs: ColDef<MemberSummary>[] = [
    { field: "name", headerName: "Member", flex: 1, minWidth: 150 },
    { field: "total_advance", headerName: "Total Advance", flex: 1, minWidth: 120 },
    { field: "spent_from_advance", headerName: "Spent From Advance", flex: 1, minWidth: 140 },
    { field: "spent_from_own", headerName: "Spent From Own", flex: 1, minWidth: 140 },
    { field: "returned_amount", headerName: "Returned Amount", flex: 1, minWidth: 130 },
    { field: "balance", headerName: "Balance", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120,
      cellRenderer: (params : any) => {
        const status = params.value;
        let color = "text-gray-600";
        if (status === "return_due") color = "text-yellow-500";
        if (status === "extra_spent") color = "text-red-500";
        if (status === "settled") color = "text-green-500";
        return <span className={color}>{status.replace("_", " ").toUpperCase()}</span>;
      }
    },
  ];

  return (
    <div className="p-3 overflow-auto">
      {/* PageHeader */}
      <PageHeader
        title="Member Summary Report"
      />

      {/* Table */}
      <div className="w-full overflow-x-auto" style={{ height: 400 }}>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
          />
        )}
      </div>
    </div>
  );
}
