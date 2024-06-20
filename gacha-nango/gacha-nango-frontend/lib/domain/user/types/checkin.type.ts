
export interface Checkin {
  userId: string;
  checkinDate: string;
  continues: number;
  message: string;
}

export interface CheckinConfig {
  id: string;
  days: number;
  points: number;
  clearPoints: number;
}

