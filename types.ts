export enum AttendanceType {
  CHECK_IN = 'MASUK',
  CHECK_OUT = 'PULANG'
}

export interface AttendanceRecord {
  id: string;
  teacherName: string;
  type: AttendanceType;
  timestamp: Date;
  aiMessage?: string;
}

export interface Stats {
  totalCheckIns: number;
  totalCheckOuts: number;
  uniqueTeachers: number;
}