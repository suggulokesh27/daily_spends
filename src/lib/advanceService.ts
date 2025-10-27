import { Advance } from "@/types/advance_type";
import { supabase } from "./supabaseClient"; // or your db client

export const advanceService = {
getAll: async (): Promise<{ data?: (Advance & { member: { id: string; name: string } })[], error?: string }> => {
  try {
    // Join members table and select id & name
    const { data, error } = await supabase
      .from("advances")
      .select(`
        *,
        member:member_id (id, name)
      `);

    if (error) return { error: error.message };
    return { data: data || [] };
  } catch (err: any) {
    return { error: err.message || "Unknown error" };
  }
},


  create: async (advance: Omit<Advance, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase.from("advances").insert([advance]);
      if (error) return { error: error.message };
      return { data };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  },

  update: async (id: string, advance: Partial<Advance>) => {
    try {
      const { data, error } = await supabase.from("advances").update(advance).eq("id", id);
      if (error) return { error: error.message };
      return { data };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  },

  delete: async (id: string) => {
    try {
      const { error } = await supabase.from("advances").delete().eq("id", id);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  }
};
