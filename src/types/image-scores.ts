export interface ImageScore {
  id: string;
  created_at: string;
  updated_at: string;
  file_name: string;
  file_type: string;
  file_data: string;
  score: number;
  reason: string;
  user_name: string;
}
