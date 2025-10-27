"use client";

import { useEffect, useState, useCallback } from "react";
import MemberCard from "./MemberCard";
import { memberService } from "@/lib/memberService";
import AddMemberForm from "./AddMemberForm";
import PageHeader from "../comman/PageHeader";

export default function MemberList() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await memberService.getAll();
      if (error) alert(error);
      else setMembers(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
       <PageHeader
      title="Members"
      addLabel="Add Member"
      modalContent={
        <AddMemberForm
          onMemberAdded={() => {
            fetchMembers();
          }}
        />
      }
      onSaved={() => fetchMembers()}
    />
      {/* Members Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-6">Loading members...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {members.map((m) => (
            <MemberCard key={m.id} member={m} onUpdated={fetchMembers} />
          ))}
          {members.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No members found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
