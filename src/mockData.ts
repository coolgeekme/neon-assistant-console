// Mock data backing the personal-assistant console.
// Swap these functions for real API calls (Hermes tools, Google Calendar, etc.) later.

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

export type Vital = {
  label: string;
  icon: string;
  value: string;
  tone: "green" | "blue" | "purple" | "amber";
};

export type CronJob = {
  name: string;
  schedule: string;
  az: string;
  next: string;
  status: "ok" | "idle";
};

export const initialLog: LogLine[] = [
  {
    id: "l1",
    ts: "08:02:11",
    role: "hermes",
    text: "SYSTEM INITIALIZATION. Secure tunnel established. Neon Assistant Console v1.0 initialized. Ready for command input.",
  },
  {
    id: "l2",
    ts: "08:02:14",
    role: "operator",
    text: "@hermes run morning briefing. What's on my plate today?",
  },
  {
    id: "l3",
    ts: "08:02:16",
    role: "hermes",
    text: "Initiating Daily_Recall_v1... 3 calendars synced · 4 email accounts reachable · 2 LinkedIn drafts pending.",
  },
];

export const sampleAnomalies: Anomaly[] = [
  {
    id: "a1",
    title: "BRIEF CONFLICT",
    detail:
      "Swim Meet STATE Finals (4:00 PM) overlaps a 3:30 PM calendar hold on Archeforge. Suggest re-slotting the hold.",
    severity: "warn",
  },
  {
    id: "a2",
    title: "DRAFT AGED",
    detail: "LinkedIn AI news draft from Jul 24 is still unpublished. Green-light or archive?",
    severity: "info",
  },
];

export const vitals: Vital[] = [
  { label: "Bash Exec", icon: "▣", value: "node_v18 active", tone: "green" },
  { label: "Vector DB", icon: "⛁", value: "Latency: 12ms", tone: "blue" },
  { label: "K8s Client", icon: "⬡", value: "Status: Connected", tone: "green" },
  { label: "SMTP Relay", icon: "✉", value: "Idle", tone: "blue" },
];

export const cronJobs: CronJob[] = [
  { name: "Daily Calendar Brief — 6:30 AM", schedule: "30 13 * * *", az: "6:30 AM", next: "tomorrow", status: "ok" },
  { name: "Daily Calendar Brief — 9 PM", schedule: "0 4 * * *", az: "9:00 PM", next: "tonight", status: "ok" },
  { name: "Daily LinkedIn AI news draft", schedule: "15 13 * * *", az: "6:15 AM", next: "tomorrow", status: "ok" },
];

export const calendarPreview: { time: string; cal: string; title: string }[] = [
  { time: "07:00 AM", cal: "Reggie Alcos Gmail", title: "Swim Meet (USA) — Prelims | STATE · Diego" },
  { time: "10:00 AM", cal: "Archeforge", title: "Client review — Emporio Zeva" },
  { time: "12:45 PM", cal: "Reggie-DH", title: "School Pickup" },
  { time: "04:00 PM", cal: "Reggie Alcos Gmail", title: "Swim Meet (USA) — Finals | STATE · Diego" },
];

// Fake live "ACTV" activity bars that wiggle over time.
export function liveActivity(): number[] {
  return Array.from({ length: 12 }, () => Math.round(Math.random() * 100));
}
