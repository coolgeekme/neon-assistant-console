import { useEffect, useRef, useState } from "react";
import {
  type LogLine,
  type Anomaly,
  type CronJob,
  type CalendarEvent,
  type LinkedInDraft,
} from "./types";

const DATA_URL =
  "https://raw.githubusercontent.com/coolgeekme/neon-assistant-console/main/public/dashboard-data.json";

const initialLog: LogLine[] = [
  {
    id: "l1",
    ts: "08:02:11",
    role: "hermes",
    text: "SYSTEM INITIALIZATION. Secure tunnel established. Neon Assistant Console v1.1 initialized. Fetching live data...",
  },
];

function nowStamp(): string {
  return new Date().toTimeString().slice(0, 8);
}

export default function App() {
  const [log, setLog] = useState<LogLine[]>(initialLog);
  const [cal, setCal] = useState<CalendarEvent[]>([]);
  const [cron, setCron] = useState<CronJob[]>([]);
  const [linkedin, setLinkedin] = useState<LinkedInDraft | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string>("");
  const [cmd, setCmd] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch(DATA_URL + "?t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const d = await res.json();
      setCal(d.calendar ?? []);
      setCron(d.cron ?? []);
      setLinkedin(d.linkedin?.exists ? d.linkedin : null);
      setAnomalies(d.anomalies ?? []);
      setLastSync(new Date().toLocaleTimeString());
      setLog((l) => [
        ...l,
        {
          id: "sync" + Date.now(),
          ts: nowStamp(),
          role: "hermes",
          text: `Data synced · ${cal.length || (d.calendar?.length ?? 0)} events · ${d.cron?.length ?? 0} cron · ${d.linkedin?.exists ? "1 draft" : "no draft"}.`,
        },
      ]);
    } catch (e) {
      setLog((l) => [
        ...l,
        {
          id: "err" + Date.now(),
          ts: nowStamp(),
          role: "hermes",
          text: "Sync failed — dashboard-data.json unreachable. Run the exporter on the host.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // On-open refresh
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [log]);

  function send() {
    const text = cmd.trim();
    if (!text) return;
    setLog((l) => [
      ...l,
      { id: `o${Date.now()}`, ts: nowStamp(), role: "operator", text: `@hermes ${text}` },
      {
        id: `h${Date.now()}`,
        ts: nowStamp(),
        role: "hermes",
        text: "Acknowledged. (Demo build — wire this to your live assistant to act on commands.)",
      },
    ]);
    setCmd("");
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-3 py-4 flex flex-col gap-3">
      {/* Header */}
      <header className="glass rounded-2xl px-4 py-3 flex items-center justify-between shadow-neon">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight neon-text text-neon-cyan">Hermes</span>
          <span className="flex items-center gap-1 text-xs text-neon-green">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse2" /> AGENT_LIVE_01
          </span>
        </div>
        <div className="flex items-center gap-3 text-neon-cyan/70">
          <button onClick={loadData} disabled={loading} title="refresh" className={loading ? "opacity-50" : ""}>
            {loading ? "⟳" : "↻"}
          </button>
          <span title="grid">▦</span>
          <span title="profile">◍</span>
        </div>
      </header>
      {lastSync && (
        <div className="text-[10px] text-gray-500 text-right -mt-1">synced {lastSync}</div>
      )}

      {/* Command log */}
      <section className="glass rounded-2xl p-3 flex-1 min-h-[200px] flex flex-col">
        <div ref={scrollRef} className="overflow-y-auto flex-1 flex flex-col gap-2 pr-1">
          {log.map((l) => (
            <div key={l.id} className="text-sm leading-relaxed">
              <span className="text-neon-purple/70 text-xs mr-2">{l.ts}</span>
              {l.role === "operator" ? (
                <span className="text-gray-300">{l.text}</span>
              ) : (
                <span className="text-neon-cyan">{l.text}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 glass rounded-xl px-3 py-2">
          <button className="text-neon-cyan/60" title="attach">📎</button>
          <input
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Enter command..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-600"
          />
          <button className="text-neon-cyan/60" title="voice">🎙</button>
          <label className="flex items-center gap-1 text-xs text-neon-green">
            AUTO_RECALL
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse2" />
          </label>
          <button onClick={send} className="text-neon-cyan" title="send">⚡</button>
        </div>
      </section>

      {/* Anomaly alerts */}
      <section className="flex flex-col gap-2">
        {anomalies.length === 0 && (
          <div className="glass rounded-xl p-3 border border-neon-green/30 text-xs text-neon-green">
            ✓ No anomalies detected
          </div>
        )}
        {anomalies.map((a) => (
          <div
            key={a.id}
            className={`glass rounded-xl p-3 border ${
              a.severity === "alert"
                ? "border-rose-400/40"
                : a.severity === "warn"
                ? "border-amber-300/40"
                : "border-neon-blue/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold tracking-wide ${
                  a.severity === "alert"
                    ? "text-rose-300"
                    : a.severity === "warn"
                    ? "text-amber-300"
                    : "text-neon-blue"
                }`}
              >
                ⚠ {a.title}
              </span>
              <span className="text-[10px] text-gray-500">ANOMALY_DETECTED</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">{a.detail}</p>
          </div>
        ))}
      </section>

      {/* Calendar + Cron */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="glass rounded-xl p-3">
          <div className="text-xs text-neon-purple/80 mb-2">TODAY_PREVIEW</div>
          {cal.length === 0 ? (
            <div className="text-xs text-gray-600">No events / sync pending</div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {cal.map((e, i) => (
                <li key={i} className="text-xs flex gap-2">
                  <span className="text-neon-cyan w-16 shrink-0">{e.time}</span>
                  <span className="text-gray-500 w-28 shrink-0 hidden sm:inline">[{e.cal}]</span>
                  <span className="text-gray-300 truncate">{e.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="glass rounded-xl p-3">
          <div className="text-xs text-neon-purple/80 mb-2">CRON_PULSE</div>
          {cron.length === 0 ? (
            <div className="text-xs text-gray-600">No jobs / sync pending</div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {cron.map((c, i) => (
                <li key={i} className="text-xs flex gap-2 items-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === "ok" ? "bg-neon-green animate-pulse2" : "bg-rose-400"}`} />
                  <span className="text-gray-300 flex-1 truncate">{c.name}</span>
                  <span className="text-neon-cyan/70">{c.schedule}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* LinkedIn draft */}
      <section className="glass rounded-xl p-3">
        <div className="text-xs text-neon-purple/80 mb-2">LINKEDIN_DRAFT</div>
        {!linkedin ? (
          <div className="text-xs text-gray-600">No draft pending</div>
        ) : (
          <div className="text-xs">
            <div className="text-gray-400 mb-1">
              {linkedin.file} · {linkedin.date} · {linkedin.age_days === 0 ? "today" : linkedin.age_days + "d old"}
            </div>
            <pre className="text-gray-300 whitespace-pre-wrap text-[11px] max-h-40 overflow-y-auto">
              {linkedin.preview}
            </pre>
          </div>
        )}
      </section>

      <footer className="text-center text-[10px] text-gray-600 py-2">
        Live PWA · data via dashboard-data.json · wire command bar to agent for actions
      </footer>
    </div>
  );
}
