"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain, Truck, HeartPulse, Shield, Bell,
  Radar, Package, RefreshCw,
  ChevronDown, ChevronUp, Check, Plus,
} from "lucide-react";

const CSS = `
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
`;

// ─── Data ──────────────────────────────────────────────────────────────────

const USE_CASES = [
  {
    id: "silent-delay",
    name: "Silent delivery delay detection",
    desc: "Detect silent delivery delays that NHS staff absorb and never report. Surfaces the invisible 1.3%.",
    agents: ["CPXO", "Delivery Ops", "Clinical Risk", "Compliance", "Engagement"],
    badge: { label: "● Live", color: "#028090", bg: "#F0FDF4" },
    Icon: Radar, iconColor: "#028090", disabled: false,
  },
  {
    id: "rx-delivery",
    name: "Regular prescription delivery",
    desc: "Monitor standard prescription deliveries across homecare pathways.",
    agents: [],
    badge: { label: "Coming soon", color: "#000000", bg: "#F4F7FA" },
    Icon: Package, iconColor: "#000000", disabled: true,
  },
  {
    id: "rx-refill",
    name: "Prescription refill management",
    desc: "Automated refill triggers and inventory management.",
    agents: [],
    badge: { label: "Coming soon", color: "#000000", bg: "#F4F7FA" },
    Icon: RefreshCw, iconColor: "#000000", disabled: true,
  },
];

const STEP2_AGENTS = [
  {
    id: "cpxo", Icon: Brain, color: "#005EB8",
    label: "CPXO Agent", role: "Chief Patient Experience Officer", required: true,
    fields: [
      { label: "Heartbeat interval", value: "30 seconds" },
      { label: "Primary goal",       value: "Zero silent delivery failures" },
    ],
    selectFields: [] as Array<{ label: string; options: string[] }>,
    tools: ["exception.create", "agents.assign", "signal.read"],
  },
  {
    id: "delivery", Icon: Truck, color: "#028090",
    label: "Delivery Ops Agent", role: "Logistics & courier tracking", required: false,
    fields: [
      { label: "SLA threshold", value: "4 hours (PNH)" },
      { label: "Trigger",       value: "Courier delay detected" },
    ],
    selectFields: [] as Array<{ label: string; options: string[] }>,
    tools: ["gps.getPosition", "routes.getAlternates", "eta.compute"],
  },
  {
    id: "clinical", Icon: HeartPulse, color: "#005EB8",
    label: "Clinical Risk Agent", role: "Patient safety & severity", required: false,
    fields: [{ label: "MHRA flag threshold", value: "6 hours (PNH)" }],
    selectFields: [{ label: "Auto-escalate", options: ["Yes — automated", "No — recommend only"] }],
    tools: ["sla.getThreshold", "risk.assess", "mhra.createFlag", "severity.escalate"],
  },
  {
    id: "compliance", Icon: Shield, color: "#028090",
    label: "Compliance Agent", role: "GDPR & pharma audit", required: false,
    fields: [{ label: "Retention period", value: "7 years" }],
    selectFields: [{ label: "GDPR mode", options: ["Pseudonymise all patient IDs", "Full anonymisation"] }],
    tools: ["gdpr.pseudonymise", "ledger.append", "mhra.appendFlag"],
  },
  {
    id: "engagement", Icon: Bell, color: "#005EB8",
    label: "Engagement Agent", role: "Alerts & comms", required: false,
    fields: [{ label: "Channels", value: "Email, SMS, Portal" }],
    selectFields: [{ label: "Notify on", options: ["Critical and High only", "All severities"] }],
    tools: ["contacts.get", "alert.draft", "notifications.dispatch"],
  },
];

const BADGE_META = [
  { id:"cpxo",       label:"CPXO Agent",    color:"#005EB8" },
  { id:"delivery",   label:"Delivery Ops",  color:"#028090" },
  { id:"clinical",   label:"Clinical Risk", color:"#005EB8" },
  { id:"compliance", label:"Compliance",    color:"#028090" },
  { id:"engagement", label:"Engagement",    color:"#005EB8" },
];

// ─── Shared components ─────────────────────────────────────────────────────

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  const STEPS = [
    { n: 1, label: "Select use case" },
    { n: 2, label: "Customise agents" },
    { n: 3, label: "Review and launch" },
  ];
  const items: React.ReactNode[] = [];
  STEPS.forEach((s, i) => {
    const done = s.n < step, active = s.n === step;
    items.push(
      <div key={`s${s.n}`} style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <div style={{
          width:28, height:28, borderRadius:"50%", flexShrink:0,
          backgroundColor: done ? "#028090" : active ? "#005EB8" : "#F0F4F5",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          {done
            ? <Check size={13} color="#FFFFFF" strokeWidth={2.5} />
            : <span style={{ fontSize:13, fontWeight:600, color: active ? "#FFFFFF" : "#000000" }} className={active ? "pill-active" : ""}>{s.n}</span>
          }
        </div>
        <span style={{ fontSize:13, fontWeight: active ? 600 : 400, color: done ? "#028090" : active ? "#005EB8" : "#000000", whiteSpace:"nowrap" }}>
          {s.label}
        </span>
      </div>
    );
    if (i < 2) items.push(<div key={`line${i}`} style={{ flex:1, height:1.5, backgroundColor: done ? "#028090" : "#F0F4F5", margin:"0 12px" }} />);
  });
  return <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>{items}</div>;
}

function StepFooter({ leftText, onBack, nextLabel, onNext, nextDisabled, nextColor }: {
  leftText?: string; onBack?: () => void;
  nextLabel: string; onNext: () => void;
  nextDisabled?: boolean; nextColor?: string;
}) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:16, borderTop:"0.5px solid #F0F4F5", marginTop:4 }}>
      <div>
        {onBack
          ? <button onClick={onBack} style={{ fontSize:13, color:"#000000", backgroundColor:"transparent", border:"0.5px solid #F0F4F5", borderRadius:8, padding:"8px 16px", cursor:"pointer" }}>← Back</button>
          : <span style={{ fontSize:13, color:"#000000" }}>{leftText}</span>}
      </div>
      <button onClick={nextDisabled ? undefined : onNext} disabled={!!nextDisabled} className={!nextDisabled ? "pill-active" : ""}
        style={{ fontSize:13, fontWeight:500, color:"#FFFFFF", backgroundColor: nextDisabled ? "#F0F4F5" : (nextColor ?? "#028090"), border:"none", borderRadius:8, padding:"9px 18px", cursor: nextDisabled ? "default" : "pointer" }}>
        {nextLabel}
      </button>
    </div>
  );
}

function Toggle({ on, disabled, onChange }: { on: boolean; disabled?: boolean; onChange: () => void }) {
  return (
    <button onClick={disabled ? undefined : onChange}
      style={{ width:40, height:22, borderRadius:11, border:"none", padding:0, flexShrink:0, backgroundColor: on ? "#028090" : "#F0F4F5", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.65 : 1, position:"relative" }}>
      <div style={{ width:16, height:16, borderRadius:"50%", backgroundColor:"#FFFFFF", position:"absolute", top:3, left: on ? 21 : 3, transition:"left 0.15s" }} />
    </button>
  );
}

function AgentRow({ cfg, isOn, onToggle, expanded, onToggleExpand }: {
  cfg: typeof STEP2_AGENTS[number]; isOn: boolean; onToggle: () => void; expanded: boolean; onToggleExpand: () => void;
}) {
  return (
    <div style={{ backgroundColor:"#FFFFFF", border:"0.5px solid #F0F4F5", borderLeft:"3px solid #F0F4F5", borderRadius:0, overflow:"hidden", opacity: isOn ? 1 : 0.45, transition:"opacity 0.2s" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px" }}>
        <cfg.Icon size={17} color={isOn ? cfg.color : "#000000"} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#000000" }}>{cfg.label}</div>
          <div style={{ fontSize:11, color:"#000000" }}>{cfg.role}</div>
        </div>
        {cfg.required && <span style={{ fontSize:11, color:"#000000", fontStyle:"italic", flexShrink:0 }}>Always required</span>}
        <Toggle on={isOn} disabled={cfg.required} onChange={onToggle} />
        <button onClick={onToggleExpand} style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#028090", backgroundColor:"transparent", border:"none", cursor:"pointer", padding:"4px 8px", borderRadius:6, flexShrink:0 }}>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}Edit
        </button>
      </div>
      {expanded && (
        <div style={{ borderTop:"0.5px solid #F4F7FA", padding:"14px 16px", backgroundColor:"#FAFBFC", animation:"fadeIn 0.2s ease" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
            {cfg.fields.map(f => (
              <div key={f.label} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:12, color:"#000000", width:170, flexShrink:0 }}>{f.label}</span>
                <input type="text" defaultValue={f.value} style={{ fontSize:12, color:"#000000", border:"0.5px solid #F0F4F5", borderRadius:6, padding:"5px 10px", backgroundColor:"#FFFFFF", outline:"none", width:220 }} />
              </div>
            ))}
            {cfg.selectFields.map(f => (
              <div key={f.label} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:12, color:"#000000", width:170, flexShrink:0 }}>{f.label}</span>
                <select defaultValue={f.options[0]} style={{ fontSize:12, color:"#000000", border:"0.5px solid #F0F4F5", borderRadius:6, padding:"5px 8px", backgroundColor:"#FFFFFF", cursor:"pointer" }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.05em", color:"#000000", marginBottom:8 }}>Tools</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
              {cfg.tools.map(t => (
                <span key={t} style={{ fontSize:11, color:"#000000", backgroundColor:"#F4F7FA", border:"0.5px solid #F0F4F5", padding:"3px 8px", borderRadius:4, fontFamily:"var(--font-geist-mono),monospace" }}>{t}</span>
              ))}
              <button style={{ fontSize:11, color:"#028090", backgroundColor:"transparent", border:"0.5px dashed #028090", borderRadius:4, padding:"3px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:3 }}>
                <Plus size={10} />Add tool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step components ────────────────────────────────────────────────────────

function Step1({ selected, onSelect, onNext }: { selected: string | null; onSelect: (id: string) => void; onNext: () => void }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", animation:"fadeIn 0.25s ease" }}>
      <ProgressBar step={1} />
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:20, fontWeight:600, color:"#000000", margin:"0 0 6px 0" }}>Set up your intelligence workspace</h2>
        <p style={{ fontSize:13, color:"#000000", margin:0 }}>Choose a use case and customise your agents — takes 2 minutes</p>
      </div>
      <div style={{ display:"flex", gap:16, marginBottom:16 }}>
        {USE_CASES.map(card => {
          const isSel = selected === card.id;
          return (
            <div key={card.id} onClick={() => !card.disabled && onSelect(card.id)} style={{ flex:1, position:"relative", backgroundColor: isSel ? "#F0FBF8" : "#FFFFFF", border: card.disabled ? "1.5px dashed #F0F4F5" : isSel ? "1.5px solid #028090" : "1.5px solid #F0F4F5", borderRadius:12, padding: isSel ? "36px 20px 20px" : "20px", cursor: card.disabled ? "default" : "pointer", opacity: card.disabled ? 0.5 : 1, transition:"border-color 0.15s, background-color 0.15s" }}>
              {isSel && (
                <div style={{ position:"absolute", top:12, left:12, width:20, height:20, borderRadius:"50%", backgroundColor:"#028090", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Check size={11} color="#FFFFFF" strokeWidth={2.5} />
                </div>
              )}
              <div style={{ position:"absolute", top:12, right:12, fontSize:10, fontWeight:600, color:card.badge.color, backgroundColor:card.badge.bg, padding:"3px 8px", borderRadius:4 }}>{card.badge.label}</div>
              <div style={{ marginBottom:12 }}><card.Icon size={24} color={card.iconColor} /></div>
              <div style={{ fontSize:14, fontWeight:600, color:"#000000", marginBottom:8 }}>{card.name}</div>
              <div style={{ fontSize:12, color:"#000000", lineHeight:1.65, marginBottom: card.disabled ? 0 : 16 }}>{card.desc}</div>
              {!card.disabled && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {card.agents.map(a => <span key={a} style={{ fontSize:10, fontWeight:500, color:"#028090", backgroundColor:"#E6F4F5", padding:"2px 7px", borderRadius:4 }}>{a}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selected && (
        <div style={{ display:"flex", alignItems:"center", gap:8, backgroundColor:"#F0FBF8", border:"1px solid #028090", borderRadius:8, padding:"10px 14px", marginBottom:20, animation:"fadeIn 0.2s ease" }}>
          <Check size={14} color="#028090" />
          <span style={{ fontSize:13, color:"#000000" }}>Silent delivery delay detection selected · <strong>5 agents will activate</strong></span>
        </div>
      )}
      <StepFooter leftText="Select a use case to continue" nextLabel="Next — customise agents →" onNext={onNext} nextDisabled={!selected} />
    </div>
  );
}

function Step2({ toggles, setToggles, customAgents, setCustomAgents, onBack, onNext }: {
  toggles: Record<string, boolean>; setToggles: (t: Record<string, boolean>) => void;
  customAgents: string[]; setCustomAgents: (a: string[]) => void;
  onBack: () => void; onNext: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [addingAgent, setAddingAgent] = useState(false);
  const [newName, setNewName] = useState("");

  const confirmAdd = () => {
    const name = newName.trim();
    if (name) { setCustomAgents([...customAgents, name]); setNewName(""); setAddingAgent(false); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", animation:"fadeIn 0.25s ease" }}>
      <ProgressBar step={2} />
      <p style={{ fontSize:13, color:"#000000", margin:"0 0 18px 0" }}>Silent delivery delay detection · 5 agents · toggle off to remove · expand to edit</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
        {STEP2_AGENTS.map(cfg => {
          const isOn = cfg.required ? true : (toggles[cfg.id] ?? true);
          return (
            <AgentRow key={cfg.id} cfg={cfg} isOn={isOn}
              onToggle={() => setToggles({ ...toggles, [cfg.id]: !toggles[cfg.id] })}
              expanded={!!expanded[cfg.id]}
              onToggleExpand={() => setExpanded(prev => ({ ...prev, [cfg.id]: !prev[cfg.id] }))}
            />
          );
        })}
        {customAgents.map((name, i) => (
          <div key={i} style={{ backgroundColor:"#FFFFFF", border:"0.5px solid #F0F4F5", borderLeft:"3px solid #000000", borderRadius:0, padding:"13px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <Brain size={17} color="#000000" />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#000000" }}>{name}</div>
              <div style={{ fontSize:11, color:"#000000" }}>Custom agent</div>
            </div>
            <Toggle on={true} onChange={() => {}} />
          </div>
        ))}
      </div>
      {addingAgent ? (
        <div style={{ display:"flex", gap:8, alignItems:"center", border:"1.5px dashed #028090", borderRadius:0, padding:"12px 14px", backgroundColor:"#F0FBF8", marginBottom:16 }}>
          <input type="text" value={newName} autoFocus onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && confirmAdd()} placeholder="Agent name..." style={{ flex:1, fontSize:13, border:"0.5px solid #F0F4F5", borderRadius:6, padding:"6px 10px", outline:"none" }} />
          <button onClick={confirmAdd} className="pill-active" style={{ fontSize:12, fontWeight:500, color:"#FFFFFF", backgroundColor:"#028090", border:"none", borderRadius:6, padding:"6px 14px", cursor:"pointer" }}>Add</button>
          <button onClick={() => { setAddingAgent(false); setNewName(""); }} style={{ fontSize:12, color:"#000000", backgroundColor:"transparent", border:"0.5px solid #F0F4F5", borderRadius:6, padding:"6px 10px", cursor:"pointer" }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setAddingAgent(true)} style={{ width:"100%", border:"1.5px dashed #028090", borderRadius:0, padding:"11px 16px", cursor:"pointer", backgroundColor:"transparent", color:"#028090", fontSize:13, fontWeight:500, marginBottom:20, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Plus size={14} />Add a custom agent
        </button>
      )}
      <StepFooter onBack={onBack} nextLabel="Next — review and launch →" onNext={onNext} />
    </div>
  );
}

function Step3({ toggles, customAgents, onBack, onLaunch }: {
  toggles: Record<string, boolean>; customAgents: string[];
  onBack: () => void; onLaunch: () => void;
}) {
  const activeBadges = [
    BADGE_META[0],
    ...BADGE_META.slice(1).filter(b => toggles[b.id] !== false),
    ...customAgents.map((name, i) => ({ id:`custom-${i}`, label:name, color:"#000000" })),
  ];

  const SUMMARY = [
    { label:"Use case",           value:"Silent delivery delay detection" },
    { label:"Agents active",      value:`${activeBadges.length} agents` },
    { label:"CPXO heartbeat",     value:"Every 30 seconds" },
    { label:"SLA threshold",      value:"4 hours (PNH)" },
    { label:"MHRA flag at",       value:"6 hours (PNH)" },
    { label:"Emergency dispatch", value:"Fully automated" },
    { label:"GDPR mode",          value:"Pseudonymise patient IDs" },
    { label:"Human involvement",  value:"Post-action only" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", animation:"fadeIn 0.25s ease" }}>
      <ProgressBar step={3} />
      <div style={{ backgroundColor:"#F8FAFC", border:"1px solid #F0F4F5", borderRadius:12, padding:"22px 26px", marginBottom:16 }}>
        <div style={{ fontSize:15, fontWeight:600, color:"#000000", marginBottom:18 }}>Your configuration — ready to launch</div>
        {SUMMARY.map((row, i) => (
          <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom: i < SUMMARY.length - 1 ? "0.5px solid #F0F4F5" : "none" }}>
            <span style={{ fontSize:13, color:"#000000" }}>{row.label}</span>
            <span style={{ fontSize:13, fontWeight:500, color:"#000000" }}>{row.value}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
        {activeBadges.map(b => (
          <div key={b.id} style={{ display:"flex", alignItems:"center", gap:6, backgroundColor:"#FFFFFF", border:`1.5px solid ${b.color}`, borderRadius:20, padding:"5px 12px" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", backgroundColor:b.color, display:"inline-block", flexShrink:0 }} />
            <span style={{ fontSize:12, fontWeight:500, color:"#000000" }}>{b.label}</span>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
        <p style={{ fontSize:13, color:"#000000", margin:0, lineHeight:1.65 }}>
          <strong>Ready to launch.</strong> Your agent stack will activate immediately. The CPXO agent will begin heartbeat scans every 30 seconds.
        </p>
      </div>
      <StepFooter onBack={onBack} nextLabel="▶  Launch agent stack →" onNext={onLaunch} nextColor="#028090" />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SetupPage() {
  const router = useRouter();
  const [currentStep,     setCurrentStep]     = useState<1 | 2 | 3>(1);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [toggles,         setToggles]         = useState<Record<string, boolean>>({
    delivery: true, clinical: true, compliance: true, engagement: true,
  });
  const [customAgents, setCustomAgents] = useState<string[]>([]);
  const [launching,    setLaunching]    = useState(false);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => router.push("/how-it-works"), 1200);
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", backgroundColor:"#F4F7FA", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        {launching ? (
          <div style={{ display:"flex", alignItems:"center", gap:14, backgroundColor:"#F0FDF4", border:"1.5px solid #BBF7D0", borderRadius:14, padding:"22px 36px", animation:"fadeIn 0.3s ease" }}>
            <Check size={22} color="#028090" strokeWidth={2.5} />
            <span style={{ fontSize:16, fontWeight:500, color:"#000000" }}>
              Agent stack launched · CPXO agent is now active
            </span>
          </div>
        ) : (
          <div style={{ backgroundColor:"#FFFFFF", border:"1px solid #F0F4F5", borderRadius:12, padding:28, width:"100%", maxWidth:820 }}>
            {currentStep === 1 && <Step1 selected={selectedUseCase} onSelect={setSelectedUseCase} onNext={() => setCurrentStep(2)} />}
            {currentStep === 2 && <Step2 toggles={toggles} setToggles={setToggles} customAgents={customAgents} setCustomAgents={setCustomAgents} onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />}
            {currentStep === 3 && <Step3 toggles={toggles} customAgents={customAgents} onBack={() => setCurrentStep(2)} onLaunch={handleLaunch} />}
          </div>
        )}
      </div>
    </>
  );
}
