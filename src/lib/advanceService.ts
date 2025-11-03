import { Advance } from "@/types/advance_type";
import { supabase } from "./supabaseClient"; // or your db client
import { Bhiksha } from "@/types/bhiksha_type";

export const advanceService = {
getAll: async (): Promise<{ data?: (Advance & { member: { id: string; name: string }; bhiksha?: Bhiksha })[], error?: string }> => {
    try {
      // Select advances + join member + join bhiksha (list columns explicitly)
      const { data, error } = await supabase
        .from("advances")
        .select(`
          *,
          member:member_id (id, name),
          bhiksha:bhiksha_id (id, name, bhiksha_date, donated, note)
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
