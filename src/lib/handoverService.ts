/* eslint-disable @typescript-eslint/no-unused-vars */
import { Handover } from "@/types/handover_type";
import { supabase } from "./supabaseClient";
import { expenseService } from "./expenseService";

export const handoverService = {
  // Get all handovers with member details
  getAll: async (): Promise<{ data?: Handover[], error?: string }> => {
    try {
      const { data, error } = await supabase
        .from("handover")
        .select(`*, member:member_id (id, name)`)
        .order("handover_date", { ascending: false });

      if (error) return { error: error.message };
      return { data: data || [] };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  },

  getById: async (id: string): Promise<{ data?: Handover; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from("handover")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return { error: error.message };
      return { data };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  },  

  // Create new handover
  create: async (handover: Omit<Handover, "id" | "spent_amount" | "returned_amount" | "extra_spent">) => {
    try {
      const { data, error } = await supabase
        .from("handover")
        .insert([handover])
        .select("*");

      if (error) return { error: error.message };
      return { data: data[0] };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  },

  // Update handover manually
  update: async (id: string, handover: Partial<Handover>) => {
    try {
      const { member, ...updateData } = handover;
      const { data, error } = await supabase
        .from("handover")
        .update(updateData)
        .eq("id", id)
        .select("*, member:member_id(id, name)");

      if (error) return { error: error.message };
      return { data: data[0] };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  },

  getByMemberId: async (memberId: string): Promise<{ data?: Handover[], error?: string }> => {
    try {
      const { data, error } = await supabase
        .from("handover")
        .select("*")
        .eq("member_id", memberId)
        .order("handover_date", { ascending: false });

      if (error) return { error: error.message };
      return { data: data || [] };
    } catch (err: any) {
      return { error: err.message || "Unknown error" };
    }
  },

recalExpenseForHandover: async function(handoverId: string) {
  const { data: handover } = await this.getById(handoverId);

  if (!handover) return;

  const { data: expenses } = await expenseService.getByHandoverId(handover.id);

  const totalSpent = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

  console.log(`Recalculating handover ${handover.id}: Total Spent = ${totalSpent}`);

  const diff = handover.handed_amount - totalSpent;

  const enhnacedData = {
    spent_amount: totalSpent,
    returned_amount: diff > 0 ? diff : 0,
    extra_spent: diff < 0 ? Math.abs(diff) : 0,
  };

  await this.update(handover.id, enhnacedData);
},

};
