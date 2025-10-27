export interface Handover {
  id: string;
  member_id: string;
  handed_amount: number;
  spent_amount: number;
  returned_amount: number;
  extra_spent: number;
  handover_date: string;
  member?: { id: string; name: string }; 
}