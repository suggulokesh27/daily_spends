"use client";

import { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Expense } from "@/types/expense_type";
import { expenseService } from "@/lib/expenseService";
import ExpenseForm from "./ExpenseForm";
import { CirclePlus, Pencil } from "lucide-react";
import PageHeader from "../comman/PageHeader";
import Modal from "../ui/Modal";
import TotalSpendLabel from "../comman/TotalSpendLabel";
import { totalmem } from "os";
import { useAuth } from "@/context/AuthContext";
import FilterButton from "../comman/FilterButton";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function ExpensesSection() {
  const [rowData, setRowData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { user } = useAuth();

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await expenseService.getAll();
      if (error) alert(error);
      else setRowData(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

    const handleFilter = async (filters: any) => {
    if (!filters.startDate && !filters.endDate && !filters.memberId) {
      fetchExpenses();
      return;
    }

    const { data, error } = await expenseService.expenseFilter(filters);
    if (error) alert(error);
    else setRowData(data || []);
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const columnDefs: ColDef<Expense>[] = [
    { field: "member.name", headerName: "Member", flex: 1, minWidth: 150 },
    { field: "category", headerName: "Category", flex: 1, minWidth: 150 },
    { field: "amount", headerName: "Amount", flex: 1, minWidth: 150 },
    {
      field: "expense_date",
      headerName: "Date",
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    { field: "description", headerName: "Notes", flex: 2, minWidth: 150 },
    ...(user?.role === "admin"
      ? [
          {
            headerName: "Edit",
            minWidth: 80,
            flex: 0.5,
            cellRenderer: (params: any) => (
              <button
                onClick={() => setEditingExpense(params.data)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" />
              </button>
            ),
          } as ColDef<Expense>,
        ]
      : []),
  ];

  return (
    <div className="p-3">
      <PageHeader
        title="Daily Expenses"
        addLabel="Add Expense"
        addIcon={<CirclePlus className="w-5 h-5" />}
        modalContent={<ExpenseForm onSaved={() => fetchExpenses()} />}
        handleFilter={handleFilter}
        isFilterable={true}
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
      <div className="flex flex-col md:flex-row justify-between md:justify-end gap-3">
        <TotalSpendLabel
          total={rowData.reduce((total, expense) => total + expense.amount, 0)}
        />
        <TotalSpendLabel
          label="Today Spent"
          total={rowData.reduce(
            (total, expense) =>
              total +
              (new Date(expense.expense_date).toDateString() ===
              new Date().toDateString()
                ? expense.amount
                : 0),
            0
          )}
        />
      </div>
      {editingExpense && (
        <Modal show={!!editingExpense} onClose={() => setEditingExpense(null)}>
          <ExpenseForm
            expense={editingExpense}
            onSaved={() => {
              fetchExpenses();
              setEditingExpense(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
