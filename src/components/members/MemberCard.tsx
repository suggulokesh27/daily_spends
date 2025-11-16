"use client";

import { useState } from "react";
import { memberPeriodService } from "@/lib/memberPeriodService";
import { memberService } from "@/lib/memberService";
import MemberEdit from "./MemberEdit";
import MemberView from "./MemberView";

interface MemberCardProps {
  member: any;
  onUpdated: () => void;
}

export default function MemberCard({ member, onUpdated }: MemberCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Values received from MemberList (calculated there)
  const activeDays = member.active_days;
  const totalCost = member.total_cost;
  const advancePaid = member.latest_advance_amount || 0;
  const remainOrReturn = member.remaining_amount;

  // ================================
  // Handle Leave
  // ================================

  const handleLeaving = async () => {
    if (!confirm("Mark this member as leaving today?")) return;

    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const { error } = await memberService.update(member.id, {
      leaving_date: today,
      is_active: false,
      updated_at: new Date().toISOString(),
    });

    if (error) alert(error);

    setLoading(false);
    onUpdated();
  };

  // ================================
  // Handle Rejoin
  // ================================
  const handleRejoin = async () => {
    if (!confirm("Rejoin this member?")) return;

    const rejoinDate = prompt(
      "Enter Rejoin Date (YYYY-MM-DD)",
      new Date().toISOString().split("T")[0]
    );
    if (!rejoinDate) return;

    setLoading(true);

    await memberService.update(member.id, {
      joined_date: rejoinDate,
      leaving_date: null,
      is_active: true,
    });

    setLoading(false);
    onUpdated();
  };

  return (
    <div
      className={`${loading ? "opacity-50" : ""} ${
        member.leaving_date ? "bg-red-100" : "bg-white"
      } dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col gap-2`}
    >
      {isEditing ? (
        <MemberEdit
          member={member}
          setIsEditing={setIsEditing}
          onUpdated={onUpdated}
          loading={loading}
        />
      ) : (
        <>
          <MemberView
            member={member}
            setIsEditing={setIsEditing}
            handleLeaving={handleLeaving}
            handleRejoin={handleRejoin}
            loading={loading}
            activeDays={activeDays}
          />

          {/* Payment Box */}
          <div className="rounded-xl bg-gray-50 dark:bg-gray-700 p-3 mt-2 border border-gray-300 dark:border-gray-600">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Active Days</span>
              <span className="font-semibold">{activeDays}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Total Cost</span>
              <span className="font-semibold">₹{totalCost}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Advance Paid</span>
              <span className="font-semibold">₹{advancePaid}</span>
            </div>

            <div className="flex justify-between mt-2 pt-2 border-t">
              {remainOrReturn > 0 ? (
                <>
                  <span className="text-red-600 font-bold">Remaining</span>
                  <span className="text-red-600 font-bold">₹{remainOrReturn}</span>
                </>
              ) : (
                <>
                  <span className="text-green-600 font-bold">Return</span>
                  <span className="text-green-600 font-bold">
                    ₹{Math.abs(remainOrReturn)}
                  </span>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
