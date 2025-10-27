"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { memberService } from "@/lib/memberService";
import { Handover } from "@/types/handover_type";
import { handoverService } from "@/lib/handoverService";

interface HandoverFormProps {
  onSaved: () => void;
  handover?: Handover;
}

export default function HandoverForm({ onSaved, handover }: HandoverFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Omit<Handover, "id" | "spent_amount" | "returned_amount" | "extra_spent">>({
    defaultValues: handover || { member_id: "", handed_amount: 0, handover_date: new Date().toISOString().slice(0,10) },
  });
  const [message, setMessage] = useState<string | null>(null);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await memberService.getAll();
      if (!error && data) setMembers(data);
    };
    fetchMembers();
  }, []);

  const onSubmit = async (data: Omit<Handover, "id" | "spent_amount" | "returned_amount" | "extra_spent">) => {
    setMessage(null);
    const result = handover
      ? await handoverService.update(handover.id, data)
      : await handoverService.create(data);

    if (result.error) setMessage("❌ " + result.error);
    else {
      setMessage("✅ Handover saved!");
      reset();
      onSaved();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg">

      {/* Member */}
      <div>
        <label className="block mb-1 font-medium">Member</label>
        {handover ? (
          <p>{handover?.member?.name || "Unknown Member"}</p>
        ) : (
          <>
        <select
          {...register("member_id", { required: "Please select a member" })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        >
          <option value="">Select Member</option>
          {members.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        {errors.member_id && <p className="text-red-500 text-sm">{errors.member_id.message}</p>}
        </>
        )}
      </div>

      {/* Handed Amount */}
      <div>
        <label className="block mb-1 font-medium">Handed Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("handed_amount", { required: "Amount is required", valueAsNumber: true })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        />
        {errors.handed_amount && <p className="text-red-500 text-sm">{errors.handed_amount.message}</p>}
      </div>

      {/* Handover Date */}
      <div>
        <label className="block mb-1 font-medium">Handover Date</label>
        <input
          type="date"
          {...register("handover_date", { required: "Date is required" })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        />
        {errors.handover_date && <p className="text-red-500 text-sm">{errors.handover_date.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {isSubmitting ? "Saving..." : "Save Handover"}
      </button>

      {message && <p className={`text-sm text-center ${message.startsWith("✅") ? "text-green-500" : "text-red-500"}`}>{message}</p>}
    </form>
  );
}
