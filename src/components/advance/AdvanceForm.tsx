"use client";

import { useForm } from "react-hook-form";
import { advanceService } from "@/lib/advanceService";
import { memberService } from "@/lib/memberService";
import { bhikshaService } from "@/lib/bhikshaService";
import { useState, useEffect } from "react";
import { Advance } from "@/types/advance_type";
import { Bhiksha } from "@/types/bhiksha_type";

interface AdvanceFormProps {
  onSaved: () => void;
  advance?: Advance;
}

export default function AdvanceForm({ onSaved, advance }: AdvanceFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Advance, "id" | "created_at">>({
    defaultValues: advance || {
      member_id: "",
      bhiksha_id: "",
      donation_name: "",
      amount: 0,
      note: "",
      giving_date: new Date().toISOString().slice(0, 10),
      source_type: "member",
    },
  });

  const [message, setMessage] = useState<string | null>(null);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [bhikshas, setBhikshas] = useState< Bhiksha[]>([]);
  const sourceType = watch("source_type");

  // 🔹 Fetch members and bhikshas when needed
  useEffect(() => {
    const fetchData = async () => {
      const [mRes, bRes] = await Promise.all([
        memberService.getAll(),
        bhikshaService.getAll(),
      ]);
      if (!mRes.error && mRes.data) setMembers(mRes.data);
      if (!bRes.error && bRes.data) setBhikshas(bRes.data);
    };
    fetchData();
  }, []);

  // 🔹 Populate existing values on edit
  useEffect(() => {
    if (advance) {
      reset({
        member_id: advance.member_id || "",
        bhiksha_id: advance.bhiksha_id || "",
        donation_name: advance.donation_name || "",
        amount: advance.amount,
        note: advance.note || "",
        giving_date: advance.giving_date?.slice(0, 10),
        source_type: advance.source_type || "member",
      });
    }
  }, [advance, reset]);

  const onSubmit = async (formData: Omit<Advance, "id" | "created_at">) => {
  const data = { ...formData }; // ✅ make a mutable copy

  if (data.source_type === "member") {
    data.bhiksha_id = null;
    data.donation_name = null;
  } else if (data.source_type === "bhiksha") {
    data.member_id = null;
    data.donation_name = null;
  } else if (data.source_type === "donation") {
    data.member_id = null;
    data.bhiksha_id = null;
  }

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
      className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      {/* 🔹 Source Type */}
      <div>
        <label className="block mb-1 font-medium">Source Type</label>
        <select
          {...register("source_type", { required: "Please select a source type" })}
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
        >
          <option value="member">Member</option>
          <option value="bhiksha">Bhiksha</option>
          <option value="donation">Donation</option>
        </select>
        {errors.source_type && (
          <p className="text-red-500 text-sm">{errors.source_type.message}</p>
        )}
      </div>

      {/* 🔹 Member Select (if source_type = member) */}
      {sourceType === "member" && (
        <div>
          <label className="block mb-1 font-medium">Member</label>
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
        </div>
      )}

      {/* 🔹 Bhiksha Select (if source_type = bhiksha) */}
      {sourceType === "bhiksha" && (
        <div>
          <label className="block mb-1 font-medium">Bhiksha</label>
          <select
            {...register("bhiksha_id", { required: "Please select a Bhiksha" })}
            className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
          >
            <option value="">Select Bhiksha</option>
            {bhikshas.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}-({b.donated})
              </option>
            ))}
          </select>
          {errors.bhiksha_id && (
            <p className="text-red-500 text-sm">{errors.bhiksha_id.message}</p>
          )}
        </div>
      )}

      {/* 🔹 Donation Name Input (if source_type = donation) */}
      {sourceType === "donation" && (
        <div>
          <label className="block mb-1 font-medium">Donation Name</label>
          <input
            {...register("donation_name", { required: "Donation name is required" })}
            className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-700"
            placeholder="e.g. Temple Fund, Anonymous Donor"
          />
          {errors.donation_name && (
            <p className="text-red-500 text-sm">{errors.donation_name.message}</p>
          )}
        </div>
      )}

      {/* 🔹 Amount */}
      <div>
        <label className="block mb-1 font-medium">Amount</label>
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
        <label className="block mb-1 font-medium">Giving Date</label>
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
        <label className="block mb-1 font-medium">Note</label>
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
