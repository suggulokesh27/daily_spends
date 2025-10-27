export interface Advance {
  id: string;
  member_id: string;
  member: { id: string; name: string };
  amount: number;
  note?: string;
  giving_date: string; 
  created_at?: string;
}