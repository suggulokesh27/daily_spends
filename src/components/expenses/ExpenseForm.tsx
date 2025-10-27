"use client";

import { useForm } from "react-hook-form";
import { expenseService } from "@/lib/expenseService";
import { handoverService } from "@/lib/handoverService";
import { memberService } from "@/lib/memberService";
import { useState, useEffect } from "react";
import { Expense } from "@/types/expense_type";
import { Handover } from "@/types/handover_type";

interface ExpenseFormProps {
  onSaved: () => void;
  expense?: Expense;
}

export default function ExpenseForm({ onSaved, expense }: ExpenseFormProps) {
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } =
    useForm<Omit<Expense, "id">>({
      defaultValues: expense || {
        paid_by: "",
        category: "",
        amount: 0,
        expense_date: new Date().toISOString().slice(0, 10),
        description: "",
        paid_from: "advance",
      },
    });

  const [message, setMessage] = useState<string | null>(null);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([{
    id: expense?.paid_by || "", name: ""
  }]);
  const [handovers, setHandovers] = useState<Handover[]>([{
    id: expense?.handover_id || "", member_id: "", handed_amount: 0, spent_amount: 0, returned_amount: 0, extra_spent: 0, handover_date: ""
  }]);
  const [selectedHandover, setSelectedHandover] = useState<Handover | null>(null);

  const selectedMember = watch("paid_by");
  const paidFrom = watch("paid_from");

  // 🧠 Fetch members for dropdown
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await memberService.getAll();
      if (!error && data) setMembers(data);
    };
    fetchMembers();
  }, []);

  // 🧠 Fetch handovers when member changes
  useEffect(() => {
    if (!selectedMember) return;

    const fetchHandovers = async () => {
      const { data, error } = await handoverService.getByMemberId(selectedMember || "");
      if (!error && data) {
        setHandovers(data);
      }
    };
    fetchHandovers();
  }, [selectedMember]);

  // 🔄 Update selected handover info
  const handleHandoverChange = (id: string) => {
    const h = handovers.find((x) => x.id === id);
    setSelectedHandover(h || null);
  };

  // 🧾 Submit logic
  const onSubmit = async (data: Omit<Expense, "id">) => {
    setMessage(null);
    try {

    // 🧾 Save or update expense
    const result = expense
      ? await expenseService.update(expense.id, data)
      : await expenseService.create(data);

      if (result.error) {
        setMessage("❌ " + result.error);
        return;
      }

      // 🔁 Recalculate handover usage
      if (data.paid_from === "advance" && data.paid_by && selectedHandover) {
        await handoverService.recalExpenseForHandover(selectedHandover.id);
      }

      setMessage("✅ Expense saved!");
      reset();
      setSelectedHandover(null);
      onSaved();
    } catch (err: any) {
      setMessage("❌ " + (err.message || "Unknown error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg"
    >
      {/* Member */}
      <div>
        <label className="block mb-1 font-medium">Member</label>
        <select
          {...register("paid_by", { required: "Please select a member" })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        >
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        {errors.paid_by && (
          <p className="text-red-500 text-sm">{errors.paid_by.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input
          {...register("category", { required: "Category is required" })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      {/* Handover Selection (only when paid_from = advance) */}
      {paidFrom === "advance" && (
        <div>
          <label className="block mb-1 font-medium">Select Handover</label>
          <select
            onChange={(e) => handleHandoverChange(e.target.value)}
            className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
          >
            <option value="">Select Handover</option>
            {handovers.map((h) => {
              const remaining =
                Number(h.handed_amount) - Number(h.spent_amount || 0);
              return (
                <option key={h.id} value={h.id}>
                  {h.handover_date} — ₹{h.handed_amount} (Left: ₹{remaining})
                </option>
              );
            })}
          </select>

          {selectedHandover && (
            <p className="text-sm text-gray-500 mt-1">
              <strong>Date:</strong> {selectedHandover.handover_date} |{" "}
              <strong>Given:</strong> ₹{selectedHandover.handed_amount} |{" "}
              <strong>Spent:</strong> ₹{selectedHandover.spent_amount || 0} |{" "}
              <strong>Returned:</strong> ₹{selectedHandover.returned_amount || 0}
            </p>
          )}
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", {
            required: "Amount is required",
            valueAsNumber: true,
          })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          {...register("expense_date", { required: "Date is required" })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        />
        {errors.expense_date && (
          <p className="text-red-500 text-sm">{errors.expense_date.message}</p>
        )}
      </div>

      {/* Paid From */}
      <div>
        <label className="block mb-1 font-medium">Paid From</label>
        <select
          {...register("paid_from", { required: true })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        >
          <option value="advance">Advance</option>
          <option value="own">Own</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <input
          {...register("description")}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {isSubmitting ? "Saving..." : "Save Expense"}
      </button>

      {/* Message */}
      {message && (
        <p
          className={`text-sm text-center ${
            message.startsWith("✅") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
