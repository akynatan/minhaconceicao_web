export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  user_id_rd: string;
  role: "admin" | "seller";
  created_at: Date;
  updated_at: Date;
}
