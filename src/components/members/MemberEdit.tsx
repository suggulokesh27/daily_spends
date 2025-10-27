"use client";

import { Authorized } from "@/context/AuthContext";
import { memberPeriodService } from "@/lib/memberPeriodService";
import { memberService } from "@/lib/memberService";
import { useState } from "react";

export default function MemberEdit({
  member,
  setIsEditing,
  onUpdated,
  loading,
}: any) {
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [joinedDate, setJoinedDate] = useState(member.joined_date || "");
  const [leavingDate, setLeavingDate] = useState(member.leaving_date || "");
  const [saving, setSaving] = useState(false);

  const normalize = (v: any) => (v === "" ? null : v);

  const handleSave = async () => {
    setSaving(true);
    let totalDays = 0
     if (leavingDate) {
      const start = new Date(joinedDate).getTime() as any;
      const end = new Date(leavingDate).getTime() as any;
       totalDays += Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const { error: periodError } = await memberPeriodService.create({
        member_id: member.id,
        joined_date: joinedDate,
        leaving_date: leavingDate,
      });
       if (periodError) {
        alert("Error: " + periodError);
        return;
      }
    }
    const { error } = await memberService.update(member.id, {
      name,
      phone,
      joined_date: normalize(joinedDate),
      leaving_date: normalize(leavingDate),
      is_active: leavingDate ? false : true,
      days_active: leavingDate ? totalDays : 0,
      updated_at: new Date().toISOString(),
    });

    if (error) alert("Error: " + error);
    else alert("Member updated successfully");
    setSaving(false);
    setIsEditing(false);
    onUpdated();
  };

  return (
    <>
      <input
        value={name || ""}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        className="p-2 rounded-lg border bg-gray-50 dark:bg-gray-700"
      />
      <input
        value={phone || ""}
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        className="p-2 rounded-lg border bg-gray-50 dark:bg-gray-700"
      />
      <input
        type="date"
        value={joinedDate || ""}
        onChange={(e) => setJoinedDate(e.target.value)}
        className="p-2 rounded-lg border bg-gray-50 dark:bg-gray-700"
      />
      <Authorized roles={["admin"]}>
        <input
          type="date"
          value={leavingDate || ""}
          onChange={(e) => setLeavingDate(e.target.value)}
          className="p-2 rounded-lg border bg-gray-50 dark:bg-gray-700"
        />
      </Authorized>

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => setIsEditing(false)}
          className="text-gray-500 hover:text-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
