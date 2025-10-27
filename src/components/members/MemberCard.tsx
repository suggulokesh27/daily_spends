"use client";

import { useState, useEffect, useMemo } from "react";
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
  const [periods, setPeriods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [joinedDate, setJoinedDate] = useState(member.joined_date || "");
  const [leavingDate, setLeavingDate] = useState(member.leaving_date || "");

  useEffect(() => {
    if (showHistory) {
      const fetchPeriods = async () => {
        const { data, error } = await memberPeriodService.getByMemberId(member.id);
        if (!error && data) setPeriods(data);
      };
      fetchPeriods();
    }
  }, [showHistory, member.id]);

  // 🔹 Calculate total active days
  const activeDays = useMemo(() => {
    let totalDays = 0;
    for (const p of periods) {
      if (p.leaving_date) {
        const start = new Date(p.joined_date).getTime();
        const end = new Date(p.leaving_date).getTime();
        totalDays += Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    if (member.is_active && joinedDate) {
      const start = new Date(joinedDate).getTime();
      const end = new Date().getTime();
      totalDays += Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }
    return totalDays;
  }, [joinedDate, periods, member.is_active]);

  // 🔹 Handle Leave
  const handleLeaving = async () => {
    if (!confirm("Mark this member as leaving today?")) return;
    setLoading(true);
    const joinedDate = new Date(member?.joined_date).getTime();
    const today = new Date().toISOString().split("T")[0];
    const todayDate = new Date(today).getTime();
    const daysActive = Math.floor((todayDate - joinedDate) / (1000 * 60 * 60 * 24)) + 1;

    const lastPeriod = periods[periods.length - 1];
    if (lastPeriod?.joined_date === today) {
      alert("This member already has an active period without leaving.");
      setLoading(false);
      return;
    }

    const { error: memberError } = await memberService.update(member.id, {
      leaving_date: today,
      is_active: false,
      days_active: daysActive + (member.days_active || 0),
      updated_at: new Date().toISOString(),
    });

    const { error: periodError } = await memberPeriodService.create({
      member_id: member.id,
      joined_date: member.joined_date,
      leaving_date: today,
    });

    if (memberError || periodError) {
      alert("Error while marking leave: " + (memberError || periodError));
    } else {
      setLeavingDate(today);
      setPeriods((prev) => [
        ...prev,
        { member_id: member.id, joined_date: joinedDate, leaving_date: today },
      ]);
    }

    setLoading(false);
    onUpdated();
  };

  // 🔹 Handle Rejoin
  const handleRejoin = async () => {
    if (!confirm("Rejoin this member?")) return;
    setLoading(true);

    const rejoinDate = prompt(
      "Enter Rejoin Date (YYYY-MM-DD)",
      new Date().toISOString().split("T")[0]
    );
    if (!rejoinDate) {
      setLoading(false);
      return;
    }

    const lastLeave = periods[periods.length - 1];
    if (lastLeave?.leaving_date === rejoinDate) {
      alert("Cannot rejoin on the same day as leaving — choose next day");
      setLoading(false);
      return;
    }

    const { error: periodError } = await memberPeriodService.create({
      member_id: member.id,
      joined_date: rejoinDate,
      leaving_date: null,
    });

    const { error: memberError } = await memberService.update(member.id, {
      joined_date: rejoinDate,
      leaving_date: null,
      is_active: true,
      updated_at: new Date().toISOString(),
    });

    if (memberError || periodError) {
      alert("Error while rejoining: " + (memberError || periodError));
    } else {
      setJoinedDate(rejoinDate);
      setLeavingDate("");
      setPeriods((prev) => [
        ...prev,
        { member_id: member.id, joined_date: rejoinDate, leaving_date: null },
      ]);
    }

    setLoading(false);
    onUpdated();
  };

  return (
    <div
      className={`${loading ? "opacity-50" : ""} ${
        member?.leaving_date ? "bg-red-100" : "bg-white"
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
        <MemberView
          member={member}
          joinedDate={joinedDate}
          leavingDate={leavingDate}
          periods={periods}
          activeDays={activeDays}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          handleLeaving={handleLeaving}
          handleRejoin={handleRejoin}
          setIsEditing={setIsEditing}
          loading={loading}
        />
      )}
    </div>
  );
}
