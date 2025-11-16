"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import MemberCard from "./MemberCard";
import { memberService } from "@/lib/memberService";
import AddMemberForm from "./AddMemberForm";
import PageHeader from "../comman/PageHeader";
import { Search } from "lucide-react";

export default function MemberList() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = useCallback(async () => {
  setLoading(true);
  try {
    const { data, error } = await memberService.getAll();
    if (error) {
      alert(error);
    } else {
      const EXPENSE = 90000; // 🔥 Hard-coded total monthly expense

      // STEP 1: extract active days
      const activeDaysList = data?.map((m) => m.days_active || 0);

      // STEP 2: total active days of everyone
      const totalActiveDays = activeDaysList?.reduce((a, b) => a + b, 0);

      // STEP 3: per-day cost
      const perDayCost = EXPENSE / totalActiveDays;

      // STEP 4: map members with calculated cost
      const updatedMembers = (data || []).map((m) => {
        const activeDays = m.days_active || 0;

        const memberCost = +(activeDays * perDayCost).toFixed(2);

        return {
          ...m,
          active_days: activeDays,
          total_cost: memberCost,    // now this is expense-based
         remaining_amount: Math.ceil(memberCost - (m.latest_advance_amount || 0)),
          per_day_cost: perDayCost.toFixed(2),
          global_total_days: totalActiveDays
        };
      });

      setMembers(updatedMembers);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return members;

    return members.filter((m) =>
      m.name?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.phone?.toLowerCase().includes(term)
    );
  }, [members, searchTerm]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <PageHeader
        title="Members"
        addLabel="Add Member"
        modalContent={<AddMemberForm onMemberAdded={fetchMembers} />}
        onSaved={fetchMembers}
      >
        <div className="relative w-60">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Member name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </PageHeader>

      {loading ? (
        <p className="text-center text-gray-500 mt-6">Loading members...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredMembers.map((m) => (
            <MemberCard key={m.id} member={m} onUpdated={fetchMembers} />
          ))}

          {filteredMembers.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No members found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
