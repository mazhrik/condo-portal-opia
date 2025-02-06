export interface MaintenanceRequest {
  id: string;
  resident_id: string;
  apartment_id: string;
  issue_type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'normal' | 'high';
  created_at: string;
}