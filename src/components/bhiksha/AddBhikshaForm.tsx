"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { bhikshaService } from "@/lib/bhikshaService";

interface AddBhikshaFormProps {
  onSaved: () => void;
}

export default function AddBhikshaForm({ onSaved }: AddBhikshaFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: "",
      donated: 0,
      note: "",
      bhiksha_date: new Date().toISOString().slice(0,10),
    },
  });

  const [message, setMessage] = useState<any>(null);

  const onSubmit = async (data: any) => {
    setMessage(null);
    const result = await bhikshaService.create(data);
    if (result.error) {
      setMessage("❌ " + result.error?.details || result.error?.message || "An error occurred");
    }
    else {
      setMessage("✅ Bhiksha saved!");
      reset();
      onSaved();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="w-full p-2 rounded border"
          placeholder="Donor name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          {...register("bhiksha_date", { required: "Date is required" })}
          className="w-full p-2 rounded border"
        />
        {errors.bhiksha_date && <p className="text-red-500 text-sm">{errors.bhiksha_date.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Donated Amount</label>
        <input
          type="number"
          step="0.01"
          {...register("donated", { required: "Amount is required", valueAsNumber: true })}
          className="w-full p-2 rounded border"
          placeholder="₹0.00"
        />
        {errors.donated && <p className="text-red-500 text-sm">{errors.donated.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Note</label>
        <textarea
          {...register("note")}
          className="w-full p-2 rounded border"
          rows={3}
          placeholder="Optional note"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {isSubmitting ? "Saving..." : "Add Bhiksha"}
      </button>

      {message && (
        <p className={`text-sm text-center ${message.startsWith("✅") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
