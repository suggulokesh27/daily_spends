export interface Member {
  id: string;
  name: string;
  phone: string;
  joined_date?: string | null;
  created_at?: string;
  updated_at?: string;
  leaving_date?: string | null;
  days_active?: number;
  is_active?: boolean;
}

export interface MemberPeriod {
  id: string; // UUID
  member_id: string; // UUID of the member
  joined_date: string; // ISO date string
  leaving_date?: string | null; // ISO date string or null
  created_at?: string; // Timestamp string, optional
  updated_at?: string; // Timestamp string, optional
}
