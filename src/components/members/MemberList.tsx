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
    const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return members;
    return members.filter((m) =>
      m.name?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) || // optional: search by email
      m.phone?.toLowerCase().includes(term)    // optional: search by phone
    );
  }, [members, searchTerm]);

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
      {/* Members Grid */}
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
