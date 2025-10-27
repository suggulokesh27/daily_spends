export interface Expense {
  id: string;             // UUID of the expense
  paid_by: string | null; // References member who paid (nullable)
  paid_from: 'advance' | 'own'; // Paid from advance or own money
  amount: number;         // Expense amount
  category: string | null; // Text category
  description?: string | null; // Optional notes/description
  expense_date: string;   // ISO date string
  created_at?: string;    // Timestamp of creation
  handover_id?: string | null; // References handover (nullable)
  member: {
    id: string;
    name: string;
  };
}
