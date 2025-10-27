// types/member_summary_type.ts
export interface MemberSummary {
  member_id: string;
  name: string;
  total_advance: number;
  spent_from_advance: number;
  spent_from_own: number;
  returned_amount: number;
  balance: number;
  status: "return_due" | "extra_spent" | "settled";
}
