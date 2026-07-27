export type LogLine = {
  id: string;
  ts: string;
  role: "operator" | "hermes";
  text: string;
};

export type Anomaly = {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "warn" | "alert";
};

export type CronJob = {
  name: string;
  schedule: string;
  next_run_at?: string;
  status: "ok" | "error";
  deliver?: string;
};

export type CalendarEvent = {
  time: string;
  cal: string;
  title: string;
};

export type LinkedInDraft = {
  file: string;
  date: string;
  age_days: number;
  preview_chars: number;
  preview: string;
};
