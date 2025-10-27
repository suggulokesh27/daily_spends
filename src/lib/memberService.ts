import { ServiceResult } from "@/types/service_type";
import { supabase } from "./supabaseClient";
import { Member } from "@/types/member_type";



export const memberService = {
  // ✅ Get all members
async getAll(): Promise<ServiceResult<any[]>> {
  try {
    const { data, error } = await supabase
      .from("member_with_latest_advance")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return { data: data || [] };
  } catch (err: any) {
    console.error("getAllWithAdvance error:", err.message || err);
    return { error: err.message || "Failed to fetch members with advance" };
  }
},

  // ✅ Get single member by ID
  async getById(id: string): Promise<ServiceResult<Member>> {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data };
    } catch (err: any) {
      console.error("getMemberById error:", err.message || err);
      return { error: err.message || "Failed to fetch member" };
    }
  },

  // ✅ Create new member
  async create(member: Pick<Member, "name" | "phone" | "joined_date" | "created_at" | "updated_at">): Promise<ServiceResult<Member>> {
    try {
      const { data, error } = await supabase
        .from("members")
        .insert(member)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (err: any) {
      console.error("createMember error:", err.message || err);
      return { error: err.message || "Failed to create member" };
    }
  },

  // ✅ Update member
  async update(id: string, member: Partial<Pick<Member, "name" | "phone" | "joined_date" | "days_active" | "leaving_date" | "is_active" | "created_at" | "updated_at">>): Promise<ServiceResult<Member>> {
    try {
      const { data, error } = await supabase
        .from("members")
        .update(member)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (err: any) {
      console.error("updateMember error:", err.message || err);
      return { error: err.message || "Failed to update member" };
    }
  },

  // ✅ Delete member
  async delete(id: string): Promise<ServiceResult<null>> {
    try {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;
      return { data: null };
    } catch (err: any) {
      console.error("deleteMember error:", err.message || err);
      return { error: err.message || "Failed to delete member" };
    }
  },
};
