import { supabase } from "@/lib/supabaseClient";
import { Bhiksha } from "@/types/bhiksha_type";

export const bhikshaService = {
  async getAll() {
    const { data, error } = await supabase.from("bhiksha").select("*").order("bhiksha_date", { ascending: false });
    return { data, error };
  },
  async create(bhiksha: Omit<Bhiksha, "id" | "created_at">) {
    const { data, error } = await supabase.from("bhiksha").insert([bhiksha]);
    return { data, error };
  },
  async update(id: string, bhiksha: Partial<Bhiksha>) {
    const { data, error } = await supabase.from("bhiksha").update(bhiksha).eq("id", id);
    return { data, error };
  },
  async delete(id: string) {
    const { error } = await supabase.from("bhiksha").delete().eq("id", id);
    return { error };
  },
};
