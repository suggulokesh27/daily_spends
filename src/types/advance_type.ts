import { Bhiksha } from "./bhiksha_type";

export interface Advance {
  id: string;
  member_id?: string | null;
  source_type: "member" | "bhiksha" | "donation";
  amount: number;
  note?: string | null;
  giving_date: string;
  created_at?: string;
  member?: { id: string; name: string };
  bhiksha_id?: string | null;
  bhiksha?: Bhiksha;
  donation_name?: string | null;
}
