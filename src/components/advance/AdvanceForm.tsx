"use client";

import { useForm } from "react-hook-form";
import { advanceService } from "@/lib/advanceService";
import { memberService } from "@/lib/memberService";
import { useState, useEffect } from "react";
import { Advance } from "@/types/advance_type";

interface AdvanceFormProps {
  onSaved: () => void;
  advance?: Advance;
}

export default function AdvanceForm({ onSaved, advance }: AdvanceFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<Omit<Advance, "id" | "created_at">>({
      defaultValues: {
        member_id: "",
        amount: 0,
        note: "",
        giving_date: new Date().toISOString().slice(0, 10),
      },
    });

  const [message, setMessage] = useState<string | null>(null);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);

  // 🔹 Fetch all members
  useEffect(() => {
    if (advance) return; // No need to fetch members when editing
    const fetchMembers = async () => {
      const { data, error } = await memberService.getAll();
      if (!error && data) setMembers(data);
    };
    fetchMembers();
  }, []);

  // 🔹 When editing, populate existing values
  useEffect(() => {
    if (advance) {
      reset({
        member_id: advance.member_id,
        amount: advance.amount,
        note: advance.note || "",
        giving_date: advance.giving_date?.slice(0, 10),
      });
    }
  }, [advance, reset]);

  const onSubmit = async (data: Omit<Advance, "id" | "created_at">) => {
    setMessage(null);
    const result = advance
      ? await advanceService.update(advance.id, data)
      : await advanceService.create(data);

    if (result.error) setMessage("❌ " + result.error);
    else {
      setMessage("✅ Advance saved!");
      reset();
      onSaved();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg"
    >
      {/* 🔹 Member Select */}
      <div>
        <label>Member</label>
        {advance ? (
          <p className="text-gray-600 dark:text-gray-400">
            {advance?.member?.name || "Unknown Member"}
          </p>
        ) : (
          <>
        <select
          {...register("member_id", { required: "Please select a member" })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        >
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        {errors.member_id && (
          <p className="text-red-500 text-sm">{errors.member_id.message}</p>
        )}
        </>
        )}
      </div>

      {/* 🔹 Amount */}
      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("amount", { required: "Amount is required", valueAsNumber: true })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">{errors.amount.message}</p>
        )}
      </div>

      {/* 🔹 Giving Date */}
      <div>
        <label>Giving Date</label>
        <input
          type="date"
          {...register("giving_date", { required: "Date is required" })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        />
        {errors.giving_date && (
          <p className="text-red-500 text-sm">{errors.giving_date.message}</p>
        )}
      </div>

      {/* 🔹 Note */}
      <div>
        <label>Note</label>
        <input
          {...register("note")}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        />
      </div>

      {/* 🔹 Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {isSubmitting ? "Saving..." : "Save Advance"}
      </button>

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
