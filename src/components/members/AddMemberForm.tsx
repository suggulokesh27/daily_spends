"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { MemberFormData, memberSchema } from "@/types/schema/memberSchema";
import { memberService } from "@/lib/memberService";

export default function AddMemberForm({ onMemberAdded }: { onMemberAdded: () => void }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<MemberFormData>({ resolver: zodResolver(memberSchema) });

  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (memberData: MemberFormData) => {
    setMessage(null);
    const { data, error } = await memberService.create(memberData);
    if (error) setMessage("❌ " + error);
    else {
      setMessage("✅ Member added!");
      reset();
      onMemberAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 rounded-2xl space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Add Member</h2>

      <div>
        <input
          {...register("name")}
          placeholder="Name"
          className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register("phone")}
          placeholder="Phone"
          className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      {/* Joining Date Field */}
      <div>
        <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
          Joining Date
        </label>
        <input
          type="date"
          {...register("joined_date")}
          className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        />
        {errors.joined_date && (
          <p className="text-red-500 text-sm">{errors.joined_date.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        {isSubmitting ? "Adding..." : "Add Member"}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            message.startsWith("✅") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
