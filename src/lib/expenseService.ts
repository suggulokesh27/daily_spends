import { supabase } from "./supabaseClient"; // adjust your client path
import { Expense } from "@/types/expense_type";

export const expenseService = {
  async getAll(): Promise<{ data: Expense[] | null; error: string | null }> {
    const { data, error } = await supabase.from('expenses').select(`*, member:paid_by(*)`).order('expense_date', { ascending: false });
    return { data: data as Expense[] | null, error: error?.message || null };
  },

  async getById(id: string): Promise<{ data: Expense | null; error: string | null }> {
    const { data, error } = await supabase.from('expenses').select('*').eq('id', id).single();
    return { data: data as Expense | null, error: error?.message || null };
  },

  async create(expense: Omit<Expense, 'id' | 'created_at'>): Promise<{ data: Expense | null; error: string | null }> {
    const { data, error } = await supabase.from('expenses').insert(expense).select().single();
    return { data: data as Expense | null, error: error?.message || null };
  },

  async update(id: string, expense: Partial<Omit<Expense, 'id' | 'created_at'>>): Promise<{ data: Expense | null; error: string | null }> {
    const { data, error } = await supabase.from('expenses').update(expense).eq('id', id).select().single();
    return { data: data as Expense | null, error: error?.message || null };
  },

  async delete(id: string): Promise<{ data: null; error: string | null }> {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    return { data: null, error: error?.message || null };
  },

  async getByHandoverId(handoverId: string): Promise<{ data: Expense[] | null; error: string | null }> {
    const { data, error } = await supabase.from('expenses').select('*').eq('handover_id', handoverId);
    return { data: data as Expense[] | null, error: error?.message || null };
  }
};
