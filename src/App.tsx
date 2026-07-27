import { useEffect, useRef, useState } from "react";
import {
  initialLog,
  sampleAnomalies,
  vitals,
  cronJobs,
  calendarPreview,
  liveActivity,
  type LogLine,
} from "./mockData";

function nowStamp(): string {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

const TONE: Record<string, string> = {
  green: "text-neon-green border-neon-green/40",
  blue: "text-neon-blue border-neon-blue/40",
  purple: "text-neon-purple border-neon-purple/40",
  amber: "text-amber-300 border-amber-300/40",
};

export default function App() {
  const [log, setLog] = useState<LogLine[]>(initialLog);
  const [activity, setActivity] = useState<number[]>(() => liveActivity());
  const [cmd, setCmd] = useState("");
  const [minimized, setMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live activity bars
  useEffect(() => {
    const t = setInterval(() => setActivity(liveActivity()), 1800);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll chat
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
          <span title="cloud">☁</span>
          <span title="grid">▦</span>
          <span title="profile">◍</span>
        </div>
      </header>

      {/* Command log */}
      <section className="glass rounded-2xl p-3 flex-1 min-h-[260px] flex flex-col">
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
        {sampleAnomalies.map((a) => (
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
            <div className="flex gap-2 mt-2">
              <button className="text-[11px] px-2 py-1 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                VIEW_LOGS
              </button>
              <button className="text-[11px] px-2 py-1 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/30">
                SUGGEST_FIX
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Quick panels: calendar + cron */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="glass rounded-xl p-3">
          <div className="text-xs text-neon-purple/80 mb-2">TODAY_PREVIEW</div>
          <ul className="flex flex-col gap-1.5">
            {calendarPreview.map((e, i) => (
              <li key={i} className="text-xs flex gap-2">
                <span className="text-neon-cyan w-16 shrink-0">{e.time}</span>
                <span className="text-gray-500 w-28 shrink-0 hidden sm:inline">[{e.cal}]</span>
                <span className="text-gray-300 truncate">{e.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-xl p-3">
          <div className="text-xs text-neon-purple/80 mb-2">CRON_PULSE</div>
          <ul className="flex flex-col gap-1.5">
            {cronJobs.map((c, i) => (
              <li key={i} className="text-xs flex gap-2 items-center">
                <span className={`w-1.5 h-1.5 rounded-full ${c.status === "ok" ? "bg-neon-green animate-pulse2" : "bg-gray-600"}`} />
                <span className="text-gray-300 flex-1 truncate">{c.name}</span>
                <span className="text-neon-cyan/70">{c.az}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vitals dashboard */}
      <section className="glass rounded-2xl p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neon-cyan neon-text">BRAIN_RECALL_Vitals</span>
          <span className="text-[10px] text-gray-500">VER_1.0.0</span>
        </div>

        {/* ACTV chart */}
        <div className="mt-3 flex items-end gap-1 h-20">
          {activity.map((v, i) => (
            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-neon-cyan/20 to-neon-cyan/70" style={{ height: `${v}%` }}>
              {i === 1 && <div className="w-full h-full bg-white/80 rounded-t" />}
            </div>
          ))}
        </div>
        <div className="text-[10px] text-gray-500 mt-1">ACTV</div>

        {/* Status cards */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {vitals.map((v) => (
            <div key={v.label} className={`glass rounded-xl p-2 border ${TONE[v.tone]}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{v.icon}</span>
                <div className="leading-tight">
                  <div className="text-[10px] text-gray-500">{v.label}</div>
                  <div className="text-xs text-gray-200">{v.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-gray-500">
          <button onClick={() => setMinimized((m) => !m)}>▾ MINIMIZE_VITALS</button>
        </div>
      </section>

      <footer className="text-center text-[10px] text-gray-600 py-2">
        Demo PWA · mock data · wire to live assistant to enable commands
      </footer>
    </div>
  );
}
