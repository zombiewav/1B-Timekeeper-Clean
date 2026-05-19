export type AlarmRequestStatus = "pending" | "approved" | "rejected";

export interface AlarmRequest {
  id: string;
  title: string;
  reason: string;
  alarmTime: string;

  status: AlarmRequestStatus;
  timestamp: Date;
}
