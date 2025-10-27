import { ServiceResult } from "@/types/service_type";
import { supabase } from "./supabaseClient";
import { MemberPeriod } from "@/types/member_type";

export const memberPeriodService = {
  // ✅ Get all member periods
  async getAll(): Promise<ServiceResult<MemberPeriod[]>> {
    try {
      const { data, error } = await supabase
        .from("member_periods")
        .select("*")
        .order("joined_date", { ascending: true });

      if (error) throw error;
      return { data: data || [] };
    } catch (err: any) {
      console.error("getAllMemberPeriods error:", err.message || err);
      return { error: err.message || "Failed to fetch member periods" };
    }
  },

  // ✅ Get single member period by ID
  async getById(id: string): Promise<ServiceResult<MemberPeriod>> {
    try {
      const { data, error } = await supabase
        .from("member_periods")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data };
    } catch (err: any) {
      console.error("getMemberPeriodById error:", err.message || err);
      return { error: err.message || "Failed to fetch member period" };
    }
  },

  // ✅ Get periods by member ID
  async getByMemberId(member_id: string): Promise<ServiceResult<MemberPeriod[]>> {
    try {
      const { data, error } = await supabase
        .from("member_periods")
        .select("*")
        .eq("member_id", member_id)
        .order("joined_date", { ascending: true });

      if (error) throw error;
      return { data: data || [] };
    } catch (err: any) {
      console.error("getMemberPeriodsByMemberId error:", err.message || err);
      return { error: err.message || "Failed to fetch member periods" };
    }
  },

  // ✅ Create new member period
  async create(period: Pick<MemberPeriod, "member_id" | "joined_date" | "leaving_date">): Promise<ServiceResult<MemberPeriod>> {
    try {
      const { data, error } = await supabase
        .from("member_periods")
        .insert(period)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (err: any) {
      console.error("createMemberPeriod error:", err.message || err);
      return { error: err.message || "Failed to create member period" };
    }
  },

  // ✅ Update member period
  async update(id: string, period: Partial<Pick<MemberPeriod, "joined_date" | "leaving_date" | "updated_at">>): Promise<ServiceResult<MemberPeriod>> {
    try {
      const { data, error } = await supabase
        .from("member_periods")
        .update({ ...period, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (err: any) {
      console.error("updateMemberPeriod error:", err.message || err);
      return { error: err.message || "Failed to update member period" };
    }
  },

  // ✅ Delete member period
  async delete(id: string): Promise<ServiceResult<null>> {
    try {
      const { error } = await supabase
        .from("member_periods")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { data: null };
    } catch (err: any) {
      console.error("deleteMemberPeriod error:", err.message || err);
      return { error: err.message || "Failed to delete member period" };
    }
  },
};
