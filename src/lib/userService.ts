import { supabase } from "./supabaseClient";

export const userService = {
  // Get user by username & password
  login: async (username: string, password: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password) 
      .single();

    if (error) return { error: error.message };
    return { data };
  },

  getAll: async () => {
    const { data, error } = await supabase.from("users").select("*");
    return { data, error };
  },

  create: async (username: string, password: string, role: "admin" | "user") => {
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password, role }])
      .select()
      .single();
    return { data, error };
  }
};
