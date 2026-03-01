
/**
 * HR & Admin Portal — Complete UI
 * Built from: Design Doc v1.0 · PRD v1.0 · Tech Stack Doc · Proposal
 *
 * Design tokens sourced directly from Design Doc §6.3 CSS Variables
 * Typography from Design Doc §2 — Inter font, exact weights/sizes
 * Layout from Design Doc §3 — 220px sidebar, fluid content, 56px top bar
 * Components from Design Doc §4 — buttons, cards, badges, tables, inputs
 * Pages from PRD §3 — all 7 route groups
 * Features from PRD §4 — P1 must-haves fully implemented
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — CSS VARIABLES & GLOBAL RESET (Design Doc §6.3)
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Brand — Design Doc §1.1 */
    --color-primary:        #4F6EF7;
    --color-primary-dark:   #1A2340;
    --color-accent:         #2EC4A9;
    /* Neutrals — Design Doc §1.2 */
    --color-bg:             #F7F8FA;
    --color-surface:        #FFFFFF;
    --color-border:         #E2E6EE;
    --color-hover-row:      #F7F8FA;
    --color-input-bg:       #F0F2F6;
    --color-text-primary:   #1E2D3D;
    --color-text-secondary: #4A5568;
    --color-text-muted:     #8A94A6;
    /* Status — Design Doc §1.3 */
    --color-success:        #22C55E;
    --color-success-bg:     #DCFCE7;
    --color-success-text:   #16A34A;
    --color-warning:        #F59E0B;
    --color-warning-bg:     #FEF3C7;
    --color-warning-text:   #D97706;
    --color-leave:          #A855F7;
    --color-leave-bg:       #F3E8FF;
    --color-leave-text:     #9333EA;
    --color-danger:         #EF4444;
    --color-danger-bg:      #FEE2E2;
    --color-danger-text:    #DC2626;
    /* Sidebar — Design Doc §1.4 */
    --sidebar-bg:           #1A2340;
    --sidebar-active-bg:    #263352;
    --sidebar-hover-bg:     #1F2D44;
    --sidebar-text:         #B8C0D0;
    --sidebar-active-text:  #FFFFFF;
    /* Spacing 4px base — Design Doc §6.1 */
    --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px;
    --sp-4: 16px; --sp-5: 20px; --sp-6: 24px;
    --sp-8: 32px; --sp-10: 40px;
    /* Radius — Design Doc §6.2 */
    --r-sm: 6px; --r-md: 8px; --r-lg: 12px; --r-full: 9999px;
    /* Shadows */
    --shadow-card: 0 1px 4px rgba(0,0,0,0.06);
    --shadow-dropdown: 0 4px 12px rgba(0,0,0,0.1);
    --shadow-modal: 0 20px 60px rgba(0,0,0,0.18);
  }

  body {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    background: var(--color-bg);
    color: var(--color-text-primary);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: var(--color-bg); }
  ::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: var(--r-full); }
  ::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes progressFill {
    from { width: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes checkmark {
    0%   { stroke-dashoffset: 50; }
    100% { stroke-dashoffset: 0; }
  }

  .page-enter { animation: fadeUp 0.28s ease forwards; }
  .fade-in    { animation: fadeIn 0.2s ease forwards; }
  .slide-in   { animation: slideIn 0.2s ease forwards; }

  /* Number formatting — tabular-nums from Design Doc §2.1 */
  .stat-number { font-variant-numeric: tabular-nums; }

  /* Table hover */
  .table-row:hover td { background: var(--color-hover-row); }

  /* Focus ring — Design Doc §4.6 */
  input:focus, select:focus, textarea:focus {
    outline: none;
    background: var(--color-surface) !important;
    border-color: var(--color-primary) !important;
    box-shadow: 0 0 0 3px rgba(79,110,247,0.15) !important;
  }

  /* Button base */
  button { font-family: inherit; cursor: pointer; }

  /* Sidebar nav item transitions */
  .nav-item { transition: background 0.12s ease; }
  .nav-item:hover { background: var(--sidebar-hover-bg) !important; }

  /* Progress bar animation */
  .progress-bar { animation: progressFill 0.8s ease forwards; }

  /* Tooltip */
  [data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-primary-dark);
    color: #fff;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: var(--r-sm);
    white-space: nowrap;
    pointer-events: none;
    z-index: 999;
  }
  [data-tooltip] { position: relative; }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — MOCK DATA (simulating PostgreSQL / Prisma schema from TechStack §6.3)
// ─────────────────────────────────────────────────────────────────────────────
const DEPARTMENTS = ["Engineering", "Design", "HR", "Finance", "Marketing", "Operations"];

const INITIAL_EMPLOYEES = [
  { id: "EMP001", name: "Arjun Mehta",    email: "arjun.mehta@company.com",    phone: "9876543210", role: "Senior Frontend Developer", dept: "Engineering", manager: "Priya Sharma",  status: "Active",   salary: 85000,  joinDate: "2022-08-15", pan: "ABCPM1234N", aadhaar: "1234-5678-9012" },
  { id: "EMP002", name: "Sneha Kapoor",   email: "sneha.kapoor@company.com",   phone: "9876543211", role: "UI/UX Designer",             dept: "Design",       manager: "Rohit Verma", status: "Active",   salary: 70000,  joinDate: "2023-01-10", pan: "BCDPN2345O", aadhaar: "2345-6789-0123" },
  { id: "EMP003", name: "Rahul Singh",    email: "rahul.singh@company.com",    phone: "9876543212", role: "Backend Developer",           dept: "Engineering", manager: "Priya Sharma",  status: "Active",   salary: 90000,  joinDate: "2022-05-20", pan: "CDEQO3456P", aadhaar: "3456-7890-1234" },
  { id: "EMP004", name: "Anjali Nair",    email: "anjali.nair@company.com",    phone: "9876543213", role: "HR Executive",                dept: "HR",           manager: "Admin",         status: "Active",   salary: 58000,  joinDate: "2023-06-01", pan: "DEFPR4567Q", aadhaar: "4567-8901-2345" },
  { id: "EMP005", name: "Vikram Das",     email: "vikram.das@company.com",     phone: "9876543214", role: "DevOps Engineer",             dept: "Engineering", manager: "Priya Sharma",  status: "Inactive", salary: 92000,  joinDate: "2021-11-10", pan: "EFGQS5678R", aadhaar: "5678-9012-3456" },
  { id: "EMP006", name: "Priya Sharma",   email: "priya.sharma@company.com",   phone: "9876543215", role: "Engineering Manager",         dept: "Engineering", manager: "Admin",         status: "Active",   salary: 120000, joinDate: "2020-03-12", pan: "FGHRT6789S", aadhaar: "6789-0123-4567" },
  { id: "EMP007", name: "Rohit Verma",    email: "rohit.verma@company.com",    phone: "9876543216", role: "Design Lead",                 dept: "Design",       manager: "Admin",         status: "Active",   salary: 95000,  joinDate: "2021-07-22", pan: "GHISU7890T", aadhaar: "7890-1234-5678" },
  { id: "EMP008", name: "Kavya Reddy",    email: "kavya.reddy@company.com",    phone: "9876543217", role: "Financial Analyst",           dept: "Finance",      manager: "Admin",         status: "Active",   salary: 72000,  joinDate: "2023-09-05", pan: "HIJTV8901U", aadhaar: "8901-2345-6789" },
];

const INITIAL_ATTENDANCE = [
  { id: "ATT001", empId: "EMP001", name: "Arjun Mehta",    date: "2025-01-27", checkIn: "09:02", checkOut: "18:15", hours: "9h 13m", status: "Present" },
  { id: "ATT002", empId: "EMP002", name: "Sneha Kapoor",   date: "2025-01-27", checkIn: "09:47", checkOut: "18:00", hours: "8h 13m", status: "Late" },
  { id: "ATT003", empId: "EMP003", name: "Rahul Singh",    date: "2025-01-27", checkIn: "--",    checkOut: "--",    hours: "--",      status: "Absent" },
  { id: "ATT004", empId: "EMP004", name: "Anjali Nair",    date: "2025-01-27", checkIn: "08:58", checkOut: "17:58", hours: "9h 00m", status: "Present" },
  { id: "ATT005", empId: "EMP005", name: "Vikram Das",     date: "2025-01-27", checkIn: "--",    checkOut: "--",    hours: "--",      status: "Leave" },
  { id: "ATT006", empId: "EMP006", name: "Priya Sharma",   date: "2025-01-27", checkIn: "08:45", checkOut: "18:30", hours: "9h 45m", status: "Present" },
  { id: "ATT007", empId: "EMP007", name: "Rohit Verma",    date: "2025-01-27", checkIn: "10:15", checkOut: "19:15", hours: "9h 00m", status: "Late" },
  { id: "ATT008", empId: "EMP008", name: "Kavya Reddy",    date: "2025-01-27", checkIn: "09:05", checkOut: "18:05", hours: "9h 00m", status: "Present" },
];

const INITIAL_LEAVES = [
  { id: "LV001", empId: "EMP002", empName: "Sneha Kapoor",  dept: "Design",       type: "Sick Leave",    from: "2025-01-28", to: "2025-01-29", days: 2, reason: "High fever and doctor advised rest",                       status: "Pending",  appliedOn: "2025-01-27" },
  { id: "LV002", empId: "EMP003", empName: "Rahul Singh",   dept: "Engineering",  type: "Casual Leave",  from: "2025-01-30", to: "2025-01-30", days: 1, reason: "Personal work — bank documentation",                       status: "Approved", appliedOn: "2025-01-25", approvedBy: "Priya Sharma" },
  { id: "LV003", empId: "EMP001", empName: "Arjun Mehta",   dept: "Engineering",  type: "Annual Leave",  from: "2025-02-10", to: "2025-02-14", days: 5, reason: "Family vacation — pre-booked trip",                        status: "Pending",  appliedOn: "2025-01-26" },
  { id: "LV004", empId: "EMP005", empName: "Vikram Das",    dept: "Engineering",  type: "Sick Leave",    from: "2025-01-27", to: "2025-01-27", days: 1, reason: "Not feeling well",                                         status: "Approved", appliedOn: "2025-01-26", approvedBy: "Priya Sharma" },
  { id: "LV005", empId: "EMP008", empName: "Kavya Reddy",   dept: "Finance",      type: "Emergency Leave", from: "2025-02-03", to: "2025-02-05", days: 3, reason: "Family emergency",                                     status: "Rejected", appliedOn: "2025-01-28", approvedBy: "Admin" },
];

const INITIAL_TASKS = [
  { id: "TSK001", title: "Redesign Login Page & Onboarding Flow",     desc: "Revamp the login and sign-up screens based on new brand guidelines.",    assignedTo: "Sneha Kapoor",  assignedBy: "Rohit Verma",    due: "2025-01-31", priority: "High",     status: "In Progress", remarks: "Initial wireframes shared. Waiting for feedback." },
  { id: "TSK002", title: "Fix JWT Token Expiry Bug in API",            desc: "Users are being logged out prematurely. Debug token refresh logic.",      assignedTo: "Rahul Singh",   assignedBy: "Priya Sharma",   due: "2025-01-28", priority: "Critical", status: "Pending",     remarks: "" },
  { id: "TSK003", title: "Setup CI/CD Pipeline with GitHub Actions",  desc: "Automate build, test, and deploy to staging on each PR merge.",           assignedTo: "Vikram Das",    assignedBy: "Priya Sharma",   due: "2025-02-05", priority: "Medium",   status: "Completed",   remarks: "Pipeline configured. All stages passing." },
  { id: "TSK004", title: "Implement Dark Mode Toggle",                 desc: "Add system-aware and manual dark mode across the entire dashboard.",       assignedTo: "Arjun Mehta",   assignedBy: "Rohit Verma",    due: "2025-02-10", priority: "Low",      status: "In Progress", remarks: "" },
  { id: "TSK005", title: "Write Q1 Financial Summary Report",          desc: "Compile revenue, expenses, and projections for Q1 board presentation.",    assignedTo: "Kavya Reddy",   assignedBy: "Admin",          due: "2025-02-07", priority: "High",     status: "Pending",     remarks: "" },
  { id: "TSK006", title: "Conduct Performance Reviews — Design Team",  desc: "Schedule 1:1 reviews, complete evaluation forms for all 4 designers.",    assignedTo: "Rohit Verma",   assignedBy: "Admin",          due: "2025-02-15", priority: "Medium",   status: "Pending",     remarks: "" },
];

const INITIAL_PAYROLL = [
  { id: "PAY001", empId: "EMP001", name: "Arjun Mehta",   dept: "Engineering", month: "January 2025", basic: 85000, hra: 17000, conveyance: 1600, deductions: 4500, tds: 8500,  net: 90600, status: "Processed" },
  { id: "PAY002", empId: "EMP002", name: "Sneha Kapoor",  dept: "Design",      month: "January 2025", basic: 70000, hra: 14000, conveyance: 1600, deductions: 3750, tds: 7000,  net: 74850, status: "Processed" },
  { id: "PAY003", empId: "EMP003", name: "Rahul Singh",   dept: "Engineering", month: "January 2025", basic: 90000, hra: 18000, conveyance: 1600, deductions: 5000, tds: 9000,  net: 95600, status: "Pending"   },
  { id: "PAY004", empId: "EMP004", name: "Anjali Nair",   dept: "HR",          month: "January 2025", basic: 58000, hra: 11600, conveyance: 1600, deductions: 2900, tds: 5800,  net: 62500, status: "Processed" },
  { id: "PAY005", empId: "EMP006", name: "Priya Sharma",  dept: "Engineering", month: "January 2025", basic: 120000, hra: 24000, conveyance: 1600, deductions: 7500, tds: 24000, net: 114100, status: "Pending" },
  { id: "PAY006", empId: "EMP007", name: "Rohit Verma",   dept: "Design",      month: "January 2025", basic: 95000, hra: 19000, conveyance: 1600, deductions: 5500, tds: 9500,  net: 100600, status: "Processed" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — DESIGN SYSTEM PRIMITIVES (Design Doc §4)
// ─────────────────────────────────────────────────────────────────────────────

/** Avatar — Design Doc §4.8: 32px circle, colored bg, white initials */
const Avatar = ({ name = "", size = 32 }) => {
  const palette = ["#4F6EF7","#2EC4A9","#A855F7","#F59E0B","#EF4444","#22C55E","#3B82F6","#EC4899"];
  const bg = palette[(name.charCodeAt(0) || 0) % palette.length];
  const initials = name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.38, fontWeight: 700, letterSpacing: "-0.02em" }}>
      {initials}
    </div>
  );
};

/** Badge / Status Chip — Design Doc §4.4: pill-shaped, semantic colors */
const Badge = ({ label, variant }) => {
  const map = {
    Active:       { bg: "var(--color-success-bg)",  color: "var(--color-success-text)" },
    Inactive:     { bg: "var(--color-danger-bg)",   color: "var(--color-danger-text)" },
    Present:      { bg: "var(--color-success-bg)",  color: "var(--color-success-text)" },
    Absent:       { bg: "var(--color-danger-bg)",   color: "var(--color-danger-text)" },
    Late:         { bg: "var(--color-warning-bg)",  color: "var(--color-warning-text)" },
    Leave:        { bg: "var(--color-leave-bg)",    color: "var(--color-leave-text)" },
    Pending:      { bg: "var(--color-warning-bg)",  color: "var(--color-warning-text)" },
    Approved:     { bg: "var(--color-success-bg)",  color: "var(--color-success-text)" },
    Rejected:     { bg: "var(--color-danger-bg)",   color: "var(--color-danger-text)" },
    "In Progress":{ bg: "#DBEAFE",                  color: "#2563EB" },
    Completed:    { bg: "var(--color-success-bg)",  color: "var(--color-success-text)" },
    Processed:    { bg: "var(--color-success-bg)",  color: "var(--color-success-text)" },
    Critical:     { bg: "var(--color-danger-bg)",   color: "var(--color-danger-text)" },
    High:         { bg: "var(--color-warning-bg)",  color: "var(--color-warning-text)" },
    Medium:       { bg: "#DBEAFE",                  color: "#2563EB" },
    Low:          { bg: "#F0F2F6",                  color: "var(--color-text-muted)" },
    Admin:        { bg: "#EDE9FE",                  color: "#7C3AED" },
    Manager:      { bg: "#DBEAFE",                  color: "#2563EB" },
    Employee:     { bg: "#F0F2F6",                  color: "var(--color-text-secondary)" },
  };
  const s = map[variant || label] || { bg: "#F0F2F6", color: "var(--color-text-muted)" };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: "var(--r-full)", fontSize: 11, fontWeight: 600, height: 22, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
};

/** Card — Design Doc §4.2: white bg, 12px radius, 1px border, subtle shadow */
const Card = ({ children, style = {}, noPad }) => (
  <div style={{ background: "var(--color-surface)", borderRadius: "var(--r-lg)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)", padding: noPad ? 0 : "var(--sp-6)", ...style }}>
    {children}
  </div>
);

/** Button — Design Doc §4.1: 36px height, 8px radius, 13px/600, 150ms transition */
const Btn = ({ children, onClick, variant = "primary", size = "md", disabled, fullWidth, style = {} }) => {
  const V = {
    primary:   { background: "var(--color-primary)",    color: "#fff",     border: "none",                          hover: "#3D5CE8" },
    secondary: { background: "var(--color-surface)",    color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", hover: "#F0F2F6" },
    ghost:     { background: "transparent",             color: "var(--color-primary)",  border: "none",               hover: "#EEF2FF" },
    danger:    { background: "var(--color-danger-bg)",  color: "var(--color-danger-text)", border: "none",            hover: "#FECACa" },
    success:   { background: "var(--color-success-bg)", color: "var(--color-success-text)", border: "none",           hover: "#BBF7D0" },
    dark:      { background: "var(--color-primary-dark)", color: "#fff",   border: "none",                           hover: "#263352" },
    accent:    { background: "var(--color-accent)",     color: "#fff",     border: "none",                           hover: "#24A896" },
  };
  const S = { sm: { padding: "0 12px", height: 30, fontSize: 12 }, md: { padding: "0 16px", height: 36, fontSize: 13 }, lg: { padding: "0 20px", height: 40, fontSize: 14 } };
  const v = V[variant];
  const s = S[size];
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...s, background: hov && !disabled ? v.hover : v.background, color: v.color, border: v.border || "none", borderRadius: "var(--r-md)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s ease", opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap", width: fullWidth ? "100%" : "auto", justifyContent: fullWidth ? "center" : "flex-start", ...style }}>
      {children}
    </button>
  );
};

/** Input — Design Doc §4.6: #F0F2F6 bg, 36px height, focus ring */
const Input = ({ value, onChange, placeholder, type = "text", icon, style = {} }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
    {icon && <span style={{ position: "absolute", left: 10, color: "var(--color-text-muted)", fontSize: 14, pointerEvents: "none" }}>{icon}</span>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ height: 36, width: "100%", background: "var(--color-input-bg)", border: "1px solid transparent", borderRadius: "var(--r-md)", padding: icon ? "0 12px 0 32px" : "0 12px", fontSize: 13, color: "var(--color-text-primary)", fontFamily: "inherit", transition: "all 0.15s", ...style }} />
  </div>
);

/** Select */
const Select = ({ value, onChange, options, style = {} }) => (
  <select value={value} onChange={onChange}
    style={{ height: 36, background: "var(--color-input-bg)", border: "1px solid transparent", borderRadius: "var(--r-md)", padding: "0 12px", fontSize: 13, color: "var(--color-text-primary)", fontFamily: "inherit", cursor: "pointer", ...style }}>
    {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
  </select>
);

/** Textarea */
const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{ width: "100%", background: "var(--color-input-bg)", border: "1px solid transparent", borderRadius: "var(--r-md)", padding: "8px 12px", fontSize: 13, color: "var(--color-text-primary)", fontFamily: "inherit", resize: "vertical", transition: "all 0.15s" }} />
);

/** Label */
const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{children}</div>
);

/** FormField */
const Field = ({ label, children }) => (
  <div><Label>{label}</Label>{children}</div>
);

/** Modal — Design Doc §4.2 */
const Modal = ({ open, onClose, title, children, width = 540 }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(26,35,64,0.5)", animation: "fadeIn 0.15s ease" }} />
      <div style={{ position: "relative", background: "var(--color-surface)", borderRadius: "var(--r-lg)", width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-modal)", animation: "scaleIn 0.18s ease" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "var(--color-surface)", zIndex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: 20, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "var(--r-sm)" }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

/** Toast notification */
const Toast = ({ toast }) => {
  if (!toast) return null;
  const colors = { success: "#22C55E", error: "#EF4444", info: "#4F6EF7" };
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: "var(--color-primary-dark)", color: "#fff", padding: "12px 18px", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 10, boxShadow: "var(--shadow-modal)", animation: "fadeUp 0.2s ease", borderLeft: `4px solid ${colors[toast.type] || colors.info}` }}>
      <span style={{ fontSize: 16 }}>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</span>
      {toast.msg}
    </div>
  );
};

/** Divider */
const Divider = () => <div style={{ height: 1, background: "var(--color-border)", margin: "var(--sp-5) 0" }} />;

/** Empty state */
const Empty = ({ icon = "📭", msg = "No records found" }) => (
  <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--color-text-muted)" }}>
    <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
    <div style={{ fontSize: 13 }}>{msg}</div>
  </div>
);

/** Progress bar */
const ProgressBar = ({ value, max, color = "var(--color-primary)" }) => (
  <div style={{ height: 6, background: "var(--color-input-bg)", borderRadius: "var(--r-full)", overflow: "hidden" }}>
    <div className="progress-bar" style={{ height: "100%", width: `${Math.round((value/max)*100)}%`, background: color, borderRadius: "var(--r-full)" }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — TABLE COMPONENT (Design Doc §4.5)
// Table header: 12px/600/uppercase/#8A94A6, bg #F7F8FA
// Body row: 14px/400/#1E2D3D, 48px height
// ─────────────────────────────────────────────────────────────────────────────
const Table = ({ cols, data, empty }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "var(--color-bg)" }}>
          {cols.map(c => (
            <th key={c.key} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--color-border)", whiteSpace: "nowrap" }}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!data?.length
          ? <tr><td colSpan={cols.length}>{empty || <Empty />}</td></tr>
          : data.map((row, i) => (
            <tr key={i} className="table-row">
              {cols.map(c => (
                <td key={c.key} style={{ padding: "0 16px", height: 48, borderBottom: "1px solid var(--color-border)", fontSize: 14, color: "var(--color-text-primary)", verticalAlign: "middle", whiteSpace: c.wrap ? "normal" : "nowrap" }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — KPI STAT CARD (Design Doc §4.3)
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, subValue, trend, icon, iconColor = "var(--color-primary)" }) => (
  <Card style={{ padding: "var(--sp-5)" }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 400, color: "var(--color-text-muted)", marginBottom: 8, lineHeight: 1.3 }}>{label}</div>
        <div className="stat-number" style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1, marginBottom: subValue ? 4 : 6 }}>{value}</div>
        {subValue && <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{subValue}</div>}
        {trend !== undefined && (
          <div style={{ fontSize: 11, fontWeight: 500, color: trend >= 0 ? "var(--color-success)" : "var(--color-danger)", display: "flex", alignItems: "center", gap: 3 }}>
            <span>{trend >= 0 ? "▲" : "▼"}</span>
            <span>{Math.abs(trend)}% vs last month</span>
          </div>
        )}
      </div>
      <div style={{ width: 42, height: 42, borderRadius: "var(--r-md)", background: iconColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {icon}
      </div>
    </div>
  </Card>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — SIDEBAR (Design Doc §3.3)
// 220–240px fixed, dark bg, active bar, bottom user profile
// ─────────────────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { id: "dashboard",  icon: "⬡",  label: "Dashboard" },
      { id: "employees",  icon: "👥", label: "Employees" },
    ]
  },
  {
    label: "Workforce",
    items: [
      { id: "attendance", icon: "📅", label: "Attendance" },
      { id: "leaves",     icon: "🌴", label: "Leave Requests" },
      { id: "tasks",      icon: "✓",  label: "Tasks" },
    ]
  },
  {
    label: "Finance & Docs",
    items: [
      { id: "payroll",    icon: "💰", label: "Payroll" },
      { id: "documents",  icon: "📄", label: "HR Documents" },
    ]
  },
  {
    label: "System",
    items: [
      { id: "settings",   icon: "⚙",  label: "Settings" },
    ]
  }
];

const Sidebar = ({ active, onNav, user, onLogout }) => (
  <aside style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 228, background: "var(--sidebar-bg)", display: "flex", flexDirection: "column", zIndex: 200, overflowY: "auto" }}>
    {/* Logo — Design Doc §3.3 */}
    <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "var(--r-md)", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
            <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
            <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white"/>
          </svg>
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>HR Portal</div>
          <div style={{ color: "var(--sidebar-text)", fontSize: 10, fontWeight: 400 }}>Workforce Management</div>
        </div>
      </div>
    </div>

    {/* Search — Design Doc §3.3 */}
    <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ background: "#263352", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", height: 34 }}>
        <span style={{ color: "var(--color-accent)", fontSize: 13 }}>⌕</span>
        <input placeholder="Quick search..." style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 12, flex: 1, fontFamily: "inherit" }} />
      </div>
    </div>

    {/* Nav sections — Design Doc §3.3 */}
    <nav style={{ flex: 1, padding: "8px 10px" }}>
      {NAV_SECTIONS.map((section, si) => (
        <div key={si} style={{ marginBottom: 4 }}>
          <div style={{ padding: "8px 10px 4px", fontSize: 10, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{section.label}</div>
          {section.items.map(item => {
            const isActive = active === item.id;
            return (
              <div key={item.id} className="nav-item" onClick={() => onNav(item.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, height: 40, padding: "0 10px", borderRadius: "var(--r-md)", marginBottom: 1, cursor: "pointer", background: isActive ? "var(--sidebar-active-bg)" : "transparent", borderLeft: isActive ? "3px solid var(--color-accent)" : "3px solid transparent", paddingLeft: isActive ? 7 : 10 }}>
                <span style={{ fontSize: 15, opacity: isActive ? 1 : 0.65, width: 18, textAlign: "center" }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? "var(--sidebar-active-text)" : "var(--sidebar-text)", flex: 1 }}>{item.label}</span>
                {isActive && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-accent)" }} />}
              </div>
            );
          })}
        </div>
      ))}
    </nav>

    {/* User profile at bottom — Design Doc §3.3 */}
    <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--r-md)", background: "#263352" }}>
        <Avatar name={user?.name || "Admin User"} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name || "Admin User"}</div>
          <div style={{ color: "var(--color-accent)", fontSize: 10, fontWeight: 500 }}>{user?.role || "Admin"}</div>
        </div>
        <button onClick={onLogout} style={{ background: "none", border: "none", color: "var(--sidebar-text)", cursor: "pointer", fontSize: 14, padding: 4, borderRadius: "var(--r-sm)", opacity: 0.7 }} title="Logout">⏻</button>
      </div>
    </div>
  </aside>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — TOP HEADER BAR (Design Doc §3.1)
// 56–60px, breadcrumb, avatar, notifications
// ─────────────────────────────────────────────────────────────────────────────
const pageLabels = { dashboard: "Dashboard", employees: "Employees", attendance: "Attendance", leaves: "Leave Requests", tasks: "Tasks", payroll: "Payroll", documents: "HR Documents", settings: "Settings" };

const Header = ({ page, user, notifications = 3 }) => (
  <header style={{ position: "fixed", top: 0, left: 228, right: 0, height: 58, background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", padding: "0 28px", zIndex: 100, gap: 16 }}>
    {/* Breadcrumb */}
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-muted)" }}>
        <span>HR Portal</span>
        <span>›</span>
        <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{pageLabels[page] || "Dashboard"}</span>
      </div>
      <h1 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1, marginTop: 1 }}>{pageLabels[page] || "Dashboard"}</h1>
    </div>

    {/* Date */}
    <div style={{ fontSize: 12, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: 6, background: "var(--color-bg)", padding: "5px 10px", borderRadius: "var(--r-md)", border: "1px solid var(--color-border)" }}>
      <span>📅</span>
      <span style={{ fontWeight: 500 }}>Mon, 27 Jan 2025</span>
    </div>

    {/* Notifications */}
    <div style={{ position: "relative" }}>
      <button style={{ width: 36, height: 36, borderRadius: "var(--r-md)", background: "var(--color-bg)", border: "1px solid var(--color-border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔔</button>
      {notifications > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "var(--color-danger)", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--color-surface)" }}>{notifications}</div>}
    </div>

    {/* User */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: "var(--r-md)", border: "1px solid var(--color-border)", cursor: "pointer", background: "var(--color-bg)" }}>
      <Avatar name={user?.name || "Admin User"} size={26} />
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.2 }}>{user?.name || "Admin User"}</div>
        <div style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{user?.role || "Admin"}</div>
      </div>
      <span style={{ color: "var(--color-text-muted)", fontSize: 10, marginLeft: 2 }}>▾</span>
    </div>
  </header>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: LOGIN — PRD §3.1 (public route)
// Role selector: Admin, Manager, Employee
// ─────────────────────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = () => {
    if (!email || !password) { setErr("Please fill in all fields."); return; }
    setErr(""); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ name: role === "Admin" ? "Priya Admin" : role === "Manager" ? "Rohit Manager" : "Arjun Employee", email, role }); }, 900);
  };

  const DEMOS = [
    { role: "Admin",    email: "admin@company.com",    pwd: "admin123",   badge: "#7C3AED", bg: "#EDE9FE", desc: "Full system access" },
    { role: "Manager",  email: "manager@company.com",  pwd: "manager123", badge: "#2563EB", bg: "#DBEAFE", desc: "Team-level access" },
    { role: "Employee", email: "employee@company.com", pwd: "emp123",     badge: "#374151", bg: "#F0F2F6", desc: "Self-service access" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-primary-dark)", display: "flex", position: "relative", overflow: "hidden" }}>
      {/* Geometric bg pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 20% 20%, rgba(79,110,247,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(46,196,169,0.15) 0%, transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, border: "1px solid rgba(255,255,255,0.05)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -140, right: -140, width: 520, height: 520, border: "1px solid rgba(255,255,255,0.04)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Left panel — branding */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 64px", maxWidth: 520 }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white"/>
              </svg>
            </div>
            <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>HR Portal</div>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16 }}>Standalone HR &<br />Admin System</h2>
          <p style={{ fontSize: 14, color: "var(--sidebar-text)", lineHeight: 1.7 }}>Centralize employee management, attendance tracking, payroll, and HR document generation in one secure platform.</p>
        </div>

        {/* Feature list */}
        {["Employee Management & RBAC", "Attendance & Leave Tracking", "Task Assignment & Monitoring", "Payroll & Payslip Generation", "HR Document Automation"].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(46,196,169,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "var(--color-accent)", fontSize: 10 }}>✓</span>
            </div>
            <span style={{ fontSize: 13, color: "var(--sidebar-text)" }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Right panel — login form */}
      <div style={{ width: 460, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: "100%", background: "var(--color-surface)", borderRadius: 16, padding: 36, boxShadow: "var(--shadow-modal)", animation: "scaleIn 0.3s ease" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>Sign in</h3>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 24 }}>Enter your credentials to access the portal</p>

          {err && <div style={{ background: "var(--color-danger-bg)", color: "var(--color-danger-text)", padding: "10px 14px", borderRadius: "var(--r-md)", fontSize: 12, fontWeight: 500, marginBottom: 16 }}>{err}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Email Address">
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" type="email" icon="✉" />
            </Field>
            <Field label="Password">
              <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" type="password" icon="🔒" />
            </Field>
            <Field label="Login As">
              <Select value={role} onChange={e => setRole(e.target.value)} style={{ width: "100%" }}
                options={["Admin","Manager","Employee"].map(r => ({ value: r, label: r }))} />
            </Field>
          </div>

          <div style={{ marginTop: 24 }}>
            <Btn onClick={handle} fullWidth size="lg" disabled={loading}>
              {loading ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Signing in...</> : "Sign in to Portal →"}
            </Btn>
          </div>

          <Divider />
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Quick Demo Access</div>
          <div style={{ display: "flex", gap: 8 }}>
            {DEMOS.map(d => (
              <button key={d.role} onClick={() => { setEmail(d.email); setPassword(d.pwd); setRole(d.role); }}
                style={{ flex: 1, padding: "6px 8px", borderRadius: "var(--r-md)", background: d.bg, border: "none", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: d.badge }}>{d.role}</div>
                <div style={{ fontSize: 9, color: "var(--color-text-muted)", marginTop: 1 }}>{d.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: DASHBOARD — PRD §3.2 / Design Doc §3.2
// KPI cards, attendance chart, dept breakdown, leaderboard, recent employees
// ─────────────────────────────────────────────────────────────────────────────
const DashboardPage = ({ employees, tasks, payroll, leaves, role }) => {
  const activeEmp = employees.filter(e => e.status === "Active").length;
  const pendingLeaves = leaves.filter(l => l.status === "Pending").length;
  const openTasks = tasks.filter(t => t.status !== "Completed").length;
  const totalPayroll = payroll.reduce((a, p) => a + p.net, 0);

  // Attendance mock stats
  const attStats = [
    { label: "Present",  val: 19, color: "var(--color-success)" },
    { label: "Absent",   val: 3,  color: "var(--color-danger)" },
    { label: "Late",     val: 4,  color: "var(--color-warning)" },
    { label: "On Leave", val: 2,  color: "var(--color-leave)" },
  ];
  const total = attStats.reduce((a, s) => a + s.val, 0);

  // Dept headcount
  const deptCount = DEPARTMENTS.slice(0,5).map(d => ({
    name: d,
    count: employees.filter(e => e.dept === d).length,
    color: ["var(--color-primary)","var(--color-accent)","var(--color-leave)","var(--color-warning)","var(--color-success)"][DEPARTMENTS.indexOf(d) % 5]
  })).filter(d => d.count > 0);

  // Task completion bar data
  const taskByStatus = [
    { label: "Completed",   count: tasks.filter(t => t.status === "Completed").length, color: "var(--color-success)" },
    { label: "In Progress", count: tasks.filter(t => t.status === "In Progress").length, color: "var(--color-primary)" },
    { label: "Pending",     count: tasks.filter(t => t.status === "Pending").length, color: "var(--color-warning)" },
  ];

  return (
    <div className="page-enter">
      {/* KPI Row — Design Doc §4.3 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Total Employees"  value={employees.length} subValue={`${activeEmp} active`} trend={8}   icon="👥" iconColor="var(--color-primary)" />
        <StatCard label="Present Today"    value={19}              subValue="of 28 total"              trend={5}   icon="✅" iconColor="var(--color-success)" />
        <StatCard label="Pending Leaves"   value={pendingLeaves}   subValue="awaiting approval"        trend={-2}  icon="🌴" iconColor="var(--color-leave)" />
        <StatCard label="Open Tasks"       value={openTasks}       subValue="across all teams"         trend={15}  icon="📋" iconColor="var(--color-warning)" />
        <StatCard label="Jan Payroll"      value={`₹${(totalPayroll/100000).toFixed(1)}L`} subValue="total net pay" trend={3} icon="💰" iconColor="var(--color-accent)" />
      </div>

      {/* Row 2: Attendance summary + Dept chart */}
      <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 14, marginBottom: 14 }}>
        {/* Attendance donut-like card */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>Today's Attendance</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>28 total employees</div>
            </div>
            <span style={{ fontSize: 10, background: "var(--color-bg)", padding: "4px 8px", borderRadius: "var(--r-sm)", color: "var(--color-text-muted)", fontWeight: 600, border: "1px solid var(--color-border)" }}>27 JAN</span>
          </div>
          {attStats.map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}>{s.val}/{total}</span>
              </div>
              <ProgressBar value={s.val} max={total} color={s.color} />
            </div>
          ))}
        </Card>

        {/* Leave & Task summary */}
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 14 }}>
          <Card style={{ padding: "var(--sp-5)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 14 }}>Task Status Overview</div>
            <div style={{ display: "flex", gap: 8 }}>
              {taskByStatus.map(t => (
                <div key={t.label} style={{ flex: 1, background: "var(--color-bg)", borderRadius: "var(--r-md)", padding: "10px 12px", textAlign: "center", border: "1px solid var(--color-border)" }}>
                  <div className="stat-number" style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)" }}>{t.count}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 3 }}>{t.label}</div>
                  <div style={{ marginTop: 6, height: 3, borderRadius: "var(--r-full)", background: t.color }} />
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: "var(--sp-5)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 14 }}>Department Headcount</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {deptCount.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-bg)", padding: "5px 10px", borderRadius: "var(--r-full)", border: "1px solid var(--color-border)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-primary)" }}>{d.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Row 3: Recent employees + Leaderboard (Design Doc §4.8) */}
      <div style={{ display: "grid", gridTemplateColumns: "8fr 4fr", gap: 14 }}>
        <Card noPad>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>Recent Employees</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 1 }}>Latest additions to the team</div>
            </div>
          </div>
          <Table
            cols={[
              { key: "name",   label: "Employee", render: r => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={r.name} size={34} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{r.id}</div>
                  </div>
                </div>
              )},
              { key: "role",   label: "Role", render: r => <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{r.role}</span> },
              { key: "dept",   label: "Department" },
              { key: "joinDate", label: "Joined" },
              { key: "status", label: "Status", render: r => <Badge label={r.status} /> },
            ]}
            data={employees.slice(0, 5)}
          />
        </Card>

        {/* Leaderboard — Design Doc §4.8 */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 4 }}>Task Leaderboard</div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 16 }}>Top performers this month</div>
          {[
            { name: "Vikram Das",   id: "EMP005", tasks: 8,  up: true },
            { name: "Arjun Mehta",  id: "EMP001", tasks: 6,  up: true },
            { name: "Rahul Singh",  id: "EMP003", tasks: 5,  up: false },
            { name: "Sneha Kapoor", id: "EMP002", tasks: 4,  up: true },
            { name: "Priya Sharma", id: "EMP006", tasks: 3,  up: false },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, height: 40, borderBottom: i < 4 ? "1px solid var(--color-border)" : "none" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-muted)", width: 18, textAlign: "center", flexShrink: 0 }}>{i+1}</span>
              <Avatar name={p.name} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{p.id}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>{p.tasks}</span>
                <span style={{ marginLeft: 4, fontSize: 11, color: p.up ? "var(--color-success)" : "var(--color-danger)" }}>{p.up ? "▲" : "▼"}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: EMPLOYEES — PRD §3.3, §4.1
// Full CRUD, dept/designation mapping, manager assign, status toggle, doc upload
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_EMP = { name: "", email: "", phone: "", role: "", dept: "", manager: "", salary: "", status: "Active", pan: "", aadhaar: "" };

const EmployeesPage = ({ employees, setEmployees, toast }) => {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modal, setModal] = useState(null); // null | "add" | {emp}
  const [form, setForm] = useState(EMPTY_EMP);
  const [viewEmp, setViewEmp] = useState(null);

  const managers = employees.filter(e => ["Engineering Manager","Design Lead","HR Executive","Admin"].some(r => e.role.includes("Manager") || e.role.includes("Lead") || e.manager === "Admin"));

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
    const matchDept = filterDept === "All" || e.dept === filterDept;
    const matchStatus = filterStatus === "All" || e.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const openAdd = () => { setForm(EMPTY_EMP); setModal("add"); };
  const openEdit = (emp) => { setForm({ ...emp }); setModal(emp); };

  const save = () => {
    if (!form.name || !form.email || !form.role || !form.dept) { toast({ type: "error", msg: "Please fill all required fields." }); return; }
    if (modal === "add") {
      const newId = "EMP" + String(employees.length + 1).padStart(3, "0");
      setEmployees([...employees, { ...form, id: newId, salary: Number(form.salary) || 0, joinDate: new Date().toISOString().slice(0,10) }]);
      toast({ type: "success", msg: "Employee added successfully." });
    } else {
      setEmployees(employees.map(e => e.id === modal.id ? { ...e, ...form, salary: Number(form.salary) } : e));
      toast({ type: "success", msg: "Employee updated." });
    }
    setModal(null);
  };

  const toggleStatus = (id) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, status: e.status === "Active" ? "Inactive" : "Active" } : e));
    toast({ type: "success", msg: "Status updated." });
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="page-enter">
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 10, flex: 1, flexWrap: "wrap", alignItems: "center" }}>
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, email, role…" icon="⌕" style={{ width: 280 }} />
          <Select value={filterDept} onChange={e => setFilterDept(e.target.value)}
            options={["All", ...DEPARTMENTS].map(d => ({ value: d, label: d }))} />
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            options={[{value:"All",label:"All Status"},{value:"Active",label:"Active"},{value:"Inactive",label:"Inactive"}]} />
        </div>
        <Btn onClick={openAdd} icon="＋">Add Employee</Btn>
      </div>

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        <StatCard label="Total Employees"  value={employees.length}                                        icon="👥" iconColor="var(--color-primary)" />
        <StatCard label="Active"           value={employees.filter(e=>e.status==="Active").length}          icon="✅" iconColor="var(--color-success)" />
        <StatCard label="Inactive"         value={employees.filter(e=>e.status==="Inactive").length}        icon="⏸" iconColor="var(--color-danger)" />
        <StatCard label="Departments"      value={[...new Set(employees.map(e=>e.dept))].length}            icon="🏢" iconColor="var(--color-accent)" />
      </div>

      {/* Table */}
      <Card noPad>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
            Showing {filtered.length} of {employees.length} employees
          </div>
        </div>
        <Table
          cols={[
            { key: "name", label: "Employee", render: r => (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={r.name} size={36} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{r.id} · {r.email}</div>
                </div>
              </div>
            )},
            { key: "role", label: "Role & Dept", render: r => (
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{r.role}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{r.dept}</div>
              </div>
            )},
            { key: "manager", label: "Manager" },
            { key: "salary",  label: "Salary", render: r => <span className="stat-number" style={{ fontWeight: 600 }}>₹{Number(r.salary).toLocaleString("en-IN")}</span> },
            { key: "joinDate",label: "Joined" },
            { key: "status",  label: "Status", render: r => <Badge label={r.status} /> },
            { key: "actions", label: "Actions", render: r => (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn onClick={() => setViewEmp(r)} variant="ghost" size="sm">View</Btn>
                <Btn onClick={() => openEdit(r)}   variant="secondary" size="sm">Edit</Btn>
                <Btn onClick={() => toggleStatus(r.id)} variant={r.status==="Active"?"danger":"success"} size="sm">
                  {r.status==="Active"?"Deactivate":"Activate"}
                </Btn>
              </div>
            )},
          ]}
          data={filtered}
          empty={<Empty icon="👤" msg="No employees match your filters." />}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "add" ? "Add New Employee" : `Edit Employee — ${modal?.name}`} width={600}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Full Name *"><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Arjun Mehta" /></Field>
          <Field label="Email Address *"><Input value={form.email} onChange={e => set("email", e.target.value)} placeholder="arjun@company.com" type="email" /></Field>
          <Field label="Phone Number"><Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="9876543210" /></Field>
          <Field label="Designation / Role *"><Input value={form.role} onChange={e => set("role", e.target.value)} placeholder="Senior Developer" /></Field>
          <Field label="Department *">
            <Select value={form.dept} onChange={e => set("dept", e.target.value)} style={{ width: "100%" }}
              options={[{value:"",label:"Select department…"}, ...DEPARTMENTS.map(d=>({value:d,label:d}))]} />
          </Field>
          <Field label="Reporting Manager">
            <Select value={form.manager} onChange={e => set("manager", e.target.value)} style={{ width: "100%" }}
              options={[{value:"Admin",label:"Admin (Direct)"},...managers.map(m=>({value:m.name,label:m.name}))]} />
          </Field>
          <Field label="Monthly Salary (₹)"><Input value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="75000" type="number" /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={e => set("status", e.target.value)} style={{ width: "100%" }}
              options={[{value:"Active",label:"Active"},{value:"Inactive",label:"Inactive"}]} />
          </Field>
        </div>
        <Divider />
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Identity Documents</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <Field label="PAN Number"><Input value={form.pan} onChange={e => set("pan", e.target.value)} placeholder="ABCDE1234F" /></Field>
          <Field label="Aadhaar Number"><Input value={form.aadhaar} onChange={e => set("aadhaar", e.target.value)} placeholder="1234-5678-9012" /></Field>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn onClick={() => setModal(null)} variant="secondary">Cancel</Btn>
          <Btn onClick={save}>{modal === "add" ? "Add Employee" : "Save Changes"}</Btn>
        </div>
      </Modal>

      {/* View Profile Modal */}
      <Modal open={!!viewEmp} onClose={() => setViewEmp(null)} title="Employee Profile" width={500}>
        {viewEmp && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <Avatar name={viewEmp.name} size={56} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)" }}>{viewEmp.name}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2 }}>{viewEmp.role} · {viewEmp.dept}</div>
                <div style={{ marginTop: 6 }}><Badge label={viewEmp.status} /></div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                ["Employee ID", viewEmp.id],["Email", viewEmp.email],
                ["Phone", viewEmp.phone],["Manager", viewEmp.manager],
                ["Salary", `₹${Number(viewEmp.salary).toLocaleString("en-IN")}`],["Joined", viewEmp.joinDate],
                ["PAN", viewEmp.pan || "—"],["Aadhaar", viewEmp.aadhaar || "—"],
              ].map(([k,v]) => (
                <div key={k} style={{ background: "var(--color-bg)", padding: "10px 12px", borderRadius: "var(--r-md)" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: ATTENDANCE — PRD §3.4, §4.2
// Daily check-in/out, monthly summary, attendance table
// ─────────────────────────────────────────────────────────────────────────────
const AttendancePage = ({ attendance, setAttendance, toast }) => {
  const stats = ["Present","Late","Absent","Leave"].map(s => ({ label: s, val: attendance.filter(a=>a.status===s).length }));

  const doCheckIn = (id) => {
    const now = new Date().toTimeString().slice(0,5);
    setAttendance(att => att.map(a => a.id === id && a.checkIn === "--" ? { ...a, checkIn: now, status: "Present" } : a));
    toast({ type: "success", msg: "Check-in recorded." });
  };
  const doCheckOut = (id) => {
    const now = new Date().toTimeString().slice(0,5);
    setAttendance(att => att.map(a => {
      if (a.id !== id || a.checkIn === "--" || a.checkOut !== "--") return a;
      const [ih, im] = a.checkIn.split(":").map(Number);
      const [oh, om] = now.split(":").map(Number);
      const diff = (oh*60+om) - (ih*60+im);
      const hours = `${Math.floor(diff/60)}h ${diff%60}m`;
      return { ...a, checkOut: now, hours };
    }));
    toast({ type: "success", msg: "Check-out recorded." });
  };

  return (
    <div className="page-enter">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Present"  value={stats[0].val} icon="✅" iconColor="var(--color-success)" />
        <StatCard label="Late"     value={stats[1].val} icon="⏰" iconColor="var(--color-warning)" />
        <StatCard label="Absent"   value={stats[2].val} icon="❌" iconColor="var(--color-danger)" />
        <StatCard label="On Leave" value={stats[3].val} icon="🌴" iconColor="var(--color-leave)" />
      </div>

      <Card noPad>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>Daily Attendance Log</div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Monday, 27 January 2025</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" size="sm">Export CSV</Btn>
            <Btn variant="secondary" size="sm">Export PDF</Btn>
          </div>
        </div>
        <Table
          cols={[
            { key: "name", label: "Employee", render: r => (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={r.name} size={32} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{r.empId}</div>
                </div>
              </div>
            )},
            { key: "checkIn",  label: "Check In",  render: r => <span className="stat-number" style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: r.checkIn === "--" ? "var(--color-text-muted)" : "var(--color-success)" }}>{r.checkIn}</span> },
            { key: "checkOut", label: "Check Out", render: r => <span className="stat-number" style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: r.checkOut === "--" ? "var(--color-text-muted)" : "var(--color-text-primary)" }}>{r.checkOut}</span> },
            { key: "hours",    label: "Hours", render: r => <span style={{ fontSize: 12, background: "var(--color-input-bg)", padding: "3px 8px", borderRadius: "var(--r-sm)", fontWeight: 600 }}>{r.hours}</span> },
            { key: "status",   label: "Status", render: r => <Badge label={r.status} /> },
            { key: "actions",  label: "Actions", render: r => (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn onClick={() => doCheckIn(r.id)}  variant="success"   size="sm" disabled={r.checkIn !== "--"}>Check In</Btn>
                <Btn onClick={() => doCheckOut(r.id)} variant="secondary" size="sm" disabled={r.checkIn === "--" || r.checkOut !== "--"}>Check Out</Btn>
              </div>
            )},
          ]}
          data={attendance}
        />
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: LEAVES — PRD §3.4, §4.2
// Leave request form, approval workflow, history
// ─────────────────────────────────────────────────────────────────────────────
const LeavesPage = ({ leaves, setLeaves, toast, role }) => {
  const [tab, setTab] = useState("all");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type: "Sick Leave", from: "", to: "", reason: "" });

  const pending  = leaves.filter(l => l.status === "Pending");
  const approved = leaves.filter(l => l.status === "Approved");
  const rejected = leaves.filter(l => l.status === "Rejected");

  const displayed = tab === "all" ? leaves : tab === "pending" ? pending : tab === "approved" ? approved : rejected;

  const approve = id => { setLeaves(ls => ls.map(l => l.id===id ? {...l, status:"Approved", approvedBy: "Admin"} : l)); toast({type:"success",msg:"Leave approved."}); };
  const reject  = id => { setLeaves(ls => ls.map(l => l.id===id ? {...l, status:"Rejected", approvedBy: "Admin"} : l)); toast({type:"success",msg:"Leave rejected."}); };

  const submit = () => {
    if (!form.from || !form.to || !form.reason) { toast({type:"error",msg:"Please fill all fields."}); return; }
    const days = Math.ceil((new Date(form.to) - new Date(form.from)) / 86400000) + 1;
    setLeaves(ls => [{ id:"LV"+(ls.length+1).toString().padStart(3,"0"), empId:"EMP001", empName:"Arjun Mehta", dept:"Engineering", ...form, days, status:"Pending", appliedOn: new Date().toISOString().slice(0,10) }, ...ls]);
    toast({type:"success",msg:"Leave request submitted."});
    setModal(false);
    setForm({ type:"Sick Leave", from:"", to:"", reason:"" });
  };

  const Tabs = () => (
    <div style={{ display: "flex", gap: 2, background: "var(--color-input-bg)", borderRadius: "var(--r-md)", padding: 3, width: "fit-content" }}>
      {[["all","All",leaves.length],["pending","Pending",pending.length],["approved","Approved",approved.length],["rejected","Rejected",rejected.length]].map(([id,lbl,cnt]) => (
        <button key={id} onClick={() => setTab(id)}
          style={{ padding: "5px 14px", borderRadius: "var(--r-sm)", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: tab===id ? "var(--color-surface)" : "transparent", color: tab===id ? "var(--color-text-primary)" : "var(--color-text-muted)", boxShadow: tab===id ? "var(--shadow-card)" : "none", transition: "all 0.12s", display: "flex", gap: 6, alignItems: "center" }}>
          {lbl}
          <span style={{ background: tab===id ? "var(--color-bg)" : "transparent", padding: "1px 6px", borderRadius: "var(--r-full)", fontSize: 10, fontWeight: 700 }}>{cnt}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="page-enter">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Total Requests" value={leaves.length} icon="📋" iconColor="var(--color-primary)" />
        <StatCard label="Pending"   value={pending.length}  icon="⏳" iconColor="var(--color-warning)" />
        <StatCard label="Approved"  value={approved.length} icon="✅" iconColor="var(--color-success)" />
        <StatCard label="Rejected"  value={rejected.length} icon="❌" iconColor="var(--color-danger)" />
      </div>

      <Card noPad>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <Tabs />
          <Btn onClick={() => setModal(true)}>Apply for Leave</Btn>
        </div>
        <Table
          cols={[
            { key: "empName", label: "Employee", render: r => (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={r.empName} size={32} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{r.empName}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{r.dept}</div>
                </div>
              </div>
            )},
            { key: "type",       label: "Leave Type" },
            { key: "from",       label: "From" },
            { key: "to",         label: "To" },
            { key: "days",       label: "Days", render: r => <span style={{ fontWeight: 600 }}>{r.days}d</span> },
            { key: "reason",     label: "Reason", wrap: true, render: r => <span style={{ fontSize: 12, color: "var(--color-text-secondary)", maxWidth: 200, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason}</span> },
            { key: "appliedOn",  label: "Applied On" },
            { key: "status",     label: "Status", render: r => <Badge label={r.status} /> },
            { key: "actions",    label: "Actions", render: r => r.status === "Pending" ? (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn onClick={() => approve(r.id)} variant="success" size="sm">Approve</Btn>
                <Btn onClick={() => reject(r.id)}  variant="danger"  size="sm">Reject</Btn>
              </div>
            ) : <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{r.approvedBy ? `By ${r.approvedBy}` : "—"}</span> },
          ]}
          data={displayed}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Apply for Leave">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Leave Type">
            <Select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} style={{ width:"100%" }}
              options={["Sick Leave","Casual Leave","Annual Leave","Emergency Leave","Maternity Leave","Paternity Leave"].map(t=>({value:t,label:t}))} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="From Date"><Input type="date" value={form.from} onChange={e => setForm(f=>({...f,from:e.target.value}))} /></Field>
            <Field label="To Date"><Input type="date" value={form.to} onChange={e => setForm(f=>({...f,to:e.target.value}))} /></Field>
          </div>
          <Field label="Reason / Notes">
            <Textarea value={form.reason} onChange={e => setForm(f=>({...f,reason:e.target.value}))} placeholder="Please describe the reason for your leave request…" rows={3} />
          </Field>
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
          <Btn onClick={() => setModal(false)} variant="secondary">Cancel</Btn>
          <Btn onClick={submit}>Submit Request</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: TASKS — PRD §3.5, §4.3
// Kanban board: Pending / In Progress / Completed, task assign modal
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_TASK = { title: "", desc: "", assignedTo: "", due: "", priority: "Medium" };

const TasksPage = ({ tasks, setTasks, employees, toast }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_TASK);
  const [remarks, setRemarks] = useState({ open: false, id: null, text: "" });
  const [view, setView] = useState("kanban"); // kanban | list

  const COLS = [
    { id: "Pending",     label: "Pending",     color: "var(--color-warning)" },
    { id: "In Progress", label: "In Progress", color: "var(--color-primary)" },
    { id: "Completed",   label: "Completed",   color: "var(--color-success)" },
  ];

  const moveTask = (id, status) => {
    setTasks(ts => ts.map(t => t.id===id ? {...t, status} : t));
    toast({type:"success", msg:`Task moved to ${status}.`});
  };

  const addTask = () => {
    if (!form.title || !form.assignedTo) { toast({type:"error",msg:"Title and assignee are required."}); return; }
    setTasks(ts => [{ id:"TSK"+(ts.length+1).toString().padStart(3,"0"), ...form, assignedBy:"Admin", status:"Pending", remarks:"" }, ...ts]);
    toast({type:"success", msg:"Task assigned."});
    setModal(false);
    setForm(EMPTY_TASK);
  };

  const saveRemarks = () => {
    setTasks(ts => ts.map(t => t.id===remarks.id ? {...t, remarks:remarks.text} : t));
    toast({type:"success", msg:"Remarks saved."});
    setRemarks({open:false,id:null,text:""});
  };

  const PRIORITY_COLOR = { Critical:"var(--color-danger)", High:"var(--color-warning)", Medium:"var(--color-primary)", Low:"var(--color-text-muted)" };

  return (
    <div className="page-enter">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Total Tasks"   value={tasks.length}                                   icon="📋" iconColor="var(--color-primary)" />
        <StatCard label="Pending"       value={tasks.filter(t=>t.status==="Pending").length}    icon="⏳" iconColor="var(--color-warning)" />
        <StatCard label="In Progress"   value={tasks.filter(t=>t.status==="In Progress").length} icon="⚡" iconColor="var(--color-primary)" />
        <StatCard label="Completed"     value={tasks.filter(t=>t.status==="Completed").length}  icon="✅" iconColor="var(--color-success)" />
      </div>

      {/* Controls */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, gap:12 }}>
        <div style={{ display:"flex", gap:2, background:"var(--color-input-bg)", borderRadius:"var(--r-md)", padding:3 }}>
          {[["kanban","⊞ Kanban"],["list","≡ List"]].map(([id,lbl]) => (
            <button key={id} onClick={()=>setView(id)} style={{ padding:"5px 14px", borderRadius:"var(--r-sm)", border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, background:view===id?"var(--color-surface)":"transparent", color:view===id?"var(--color-text-primary)":"var(--color-text-muted)", boxShadow:view===id?"var(--shadow-card)":"none", transition:"all 0.12s" }}>{lbl}</button>
          ))}
        </div>
        <Btn onClick={()=>setModal(true)}>Assign Task</Btn>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
          {COLS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:col.color }} />
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--color-text-primary)" }}>{col.label}</span>
                  <span style={{ marginLeft:"auto", background:col.color+"18", color:col.color, borderRadius:"var(--r-full)", padding:"1px 8px", fontSize:11, fontWeight:700 }}>{colTasks.length}</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {colTasks.length === 0
                    ? <Card style={{ padding:16, textAlign:"center" }}><span style={{ fontSize:12, color:"var(--color-text-muted)" }}>No tasks</span></Card>
                    : colTasks.map(task => (
                      <Card key={task.id} style={{ padding:14, borderTop:`3px solid ${PRIORITY_COLOR[task.priority]}`, cursor:"default" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8, gap:8 }}>
                          <span style={{ fontSize:13, fontWeight:600, color:"var(--color-text-primary)", lineHeight:1.4 }}>{task.title}</span>
                          <Badge label={task.priority} />
                        </div>
                        {task.desc && <p style={{ fontSize:12, color:"var(--color-text-muted)", marginBottom:10, lineHeight:1.5 }}>{task.desc}</p>}
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                          <Avatar name={task.assignedTo} size={22} />
                          <span style={{ fontSize:11, color:"var(--color-text-muted)", flex:1 }}>{task.assignedTo}</span>
                          <span style={{ fontSize:10, background:"var(--color-bg)", padding:"2px 6px", borderRadius:"var(--r-sm)", border:"1px solid var(--color-border)", color:"var(--color-text-muted)", fontWeight:600 }}>Due {task.due}</span>
                        </div>
                        {task.remarks && <div style={{ fontSize:11, color:"var(--color-text-secondary)", background:"var(--color-bg)", padding:"6px 8px", borderRadius:"var(--r-sm)", marginBottom:10, lineHeight:1.4 }}>💬 {task.remarks}</div>}
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {col.id !== "Completed" && <Btn onClick={()=>moveTask(task.id, col.id==="Pending"?"In Progress":"Completed")} variant="ghost" size="sm">{col.id==="Pending"?"Start →":"Complete ✓"}</Btn>}
                          <Btn onClick={()=>setRemarks({open:true,id:task.id,text:task.remarks})} variant="secondary" size="sm">Remarks</Btn>
                        </div>
                      </Card>
                    ))
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card noPad>
          <Table
            cols={[
              { key:"id", label:"ID" },
              { key:"title", label:"Task", wrap:true, render:r=><span style={{fontWeight:500}}>{r.title}</span> },
              { key:"assignedTo", label:"Assigned To", render:r=>(
                <div style={{display:"flex",alignItems:"center",gap:6}}><Avatar name={r.assignedTo} size={24}/><span>{r.assignedTo}</span></div>
              )},
              { key:"priority", label:"Priority", render:r=><Badge label={r.priority}/> },
              { key:"due", label:"Due Date" },
              { key:"status", label:"Status", render:r=><Badge label={r.status}/> },
              { key:"actions", label:"Actions", render:r=>(
                <div style={{display:"flex",gap:6}}>
                  {r.status==="Pending" && <Btn onClick={()=>moveTask(r.id,"In Progress")} variant="ghost" size="sm">Start</Btn>}
                  {r.status==="In Progress" && <Btn onClick={()=>moveTask(r.id,"Completed")} variant="success" size="sm">Complete</Btn>}
                  <Btn onClick={()=>setRemarks({open:true,id:r.id,text:r.remarks})} variant="secondary" size="sm">Remarks</Btn>
                </div>
              )},
            ]}
            data={tasks}
          />
        </Card>
      )}

      {/* Assign Task Modal */}
      <Modal open={modal} onClose={()=>setModal(false)} title="Assign New Task">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Field label="Task Title *"><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Fix authentication bug" /></Field>
          <Field label="Description">
            <Textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Describe the task in detail…" />
          </Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Field label="Assign To *">
              <Select value={form.assignedTo} onChange={e=>setForm(f=>({...f,assignedTo:e.target.value}))} style={{width:"100%"}}
                options={[{value:"",label:"Select employee…"},...employees.filter(e=>e.status==="Active").map(e=>({value:e.name,label:e.name}))]} />
            </Field>
            <Field label="Due Date"><Input type="date" value={form.due} onChange={e=>setForm(f=>({...f,due:e.target.value}))} /></Field>
            <Field label="Priority">
              <Select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} style={{width:"100%"}}
                options={["Critical","High","Medium","Low"].map(p=>({value:p,label:p}))} />
            </Field>
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
          <Btn onClick={()=>setModal(false)} variant="secondary">Cancel</Btn>
          <Btn onClick={addTask}>Assign Task</Btn>
        </div>
      </Modal>

      {/* Remarks Modal */}
      <Modal open={remarks.open} onClose={()=>setRemarks({open:false,id:null,text:""})} title="Manager Remarks">
        <Field label="Feedback / Remarks">
          <Textarea value={remarks.text} onChange={e=>setRemarks(r=>({...r,text:e.target.value}))} placeholder="Add feedback or remarks for this task…" rows={4} />
        </Field>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
          <Btn onClick={()=>setRemarks({open:false,id:null,text:""})} variant="secondary">Cancel</Btn>
          <Btn onClick={saveRemarks}>Save Remarks</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: PAYROLL — PRD §3.7, §4.5
// Salary config, deductions, net calc, payslip PDF viewer
// ─────────────────────────────────────────────────────────────────────────────
const PayrollPage = ({ payroll, setPayroll, toast }) => {
  const [slip, setSlip] = useState(null);
  const [configModal, setConfigModal] = useState(null);
  const [cfg, setCfg] = useState({ basic: "", hra: "", conveyance: "", deductions: "", tds: "" });

  const processed = payroll.filter(p=>p.status==="Processed");
  const pending   = payroll.filter(p=>p.status==="Pending");

  const processPayroll = id => {
    setPayroll(ps => ps.map(p => p.id===id ? {...p,status:"Processed"} : p));
    toast({type:"success",msg:"Payroll processed successfully."});
  };

  const processAll = () => {
    setPayroll(ps => ps.map(p => ({...p,status:"Processed"})));
    toast({type:"success",msg:"All payroll processed."});
  };

  const openCfg = p => { setCfg({basic:p.basic,hra:p.hra,conveyance:p.conveyance,deductions:p.deductions,tds:p.tds}); setConfigModal(p); };
  const saveCfg = () => {
    const net = Number(cfg.basic)+Number(cfg.hra)+Number(cfg.conveyance)-Number(cfg.deductions)-Number(cfg.tds);
    setPayroll(ps => ps.map(p => p.id===configModal.id ? {...p,...cfg,basic:Number(cfg.basic),hra:Number(cfg.hra),conveyance:Number(cfg.conveyance),deductions:Number(cfg.deductions),tds:Number(cfg.tds),net,status:"Pending"} : p));
    toast({type:"success",msg:"Salary configuration saved."});
    setConfigModal(null);
  };

  return (
    <div className="page-enter">
      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Total Payroll"  value={`₹${(payroll.reduce((a,p)=>a+p.net,0)/100000).toFixed(1)}L`} icon="💳" iconColor="var(--color-primary)" />
        <StatCard label="Processed"      value={processed.length}   icon="✅" iconColor="var(--color-success)" />
        <StatCard label="Pending"        value={pending.length}     icon="⏳" iconColor="var(--color-warning)" />
        <StatCard label="Avg. Salary"    value={`₹${Math.round(payroll.reduce((a,p)=>a+p.basic,0)/payroll.length).toLocaleString("en-IN")}`} icon="📊" iconColor="var(--color-accent)" />
      </div>

      <Card noPad>
        <div style={{padding:"14px 20px",borderBottom:"1px solid var(--color-border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>January 2025 — Payroll Run</div>
            <div style={{fontSize:12,color:"var(--color-text-muted)"}}>Configure salaries and process monthly payroll</div>
          </div>
          {pending.length > 0 && <Btn onClick={processAll} variant="accent">Process All Pending ({pending.length})</Btn>}
        </div>
        <Table
          cols={[
            { key:"name", label:"Employee", render:r=>(
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Avatar name={r.name} size={34}/>
                <div>
                  <div style={{fontSize:14,fontWeight:500}}>{r.name}</div>
                  <div style={{fontSize:12,color:"var(--color-text-muted)"}}>{r.empId} · {r.dept}</div>
                </div>
              </div>
            )},
            { key:"basic",      label:"Basic",      render:r=>`₹${r.basic.toLocaleString("en-IN")}` },
            { key:"hra",        label:"HRA",        render:r=>`₹${r.hra.toLocaleString("en-IN")}` },
            { key:"conveyance", label:"Conveyance", render:r=>`₹${r.conveyance.toLocaleString("en-IN")}` },
            { key:"deductions", label:"Deductions", render:r=><span style={{color:"var(--color-danger)"}}>-₹{r.deductions.toLocaleString("en-IN")}</span> },
            { key:"tds",        label:"TDS",        render:r=><span style={{color:"var(--color-danger)"}}>-₹{r.tds.toLocaleString("en-IN")}</span> },
            { key:"net",        label:"Net Salary", render:r=><span className="stat-number" style={{fontWeight:700,color:"var(--color-success)",fontSize:14}}>₹{r.net.toLocaleString("en-IN")}</span> },
            { key:"status",     label:"Status",     render:r=><Badge label={r.status}/> },
            { key:"actions",    label:"Actions", render:r=>(
              <div style={{display:"flex",gap:6}}>
                <Btn onClick={()=>openCfg(r)}  variant="secondary" size="sm">Configure</Btn>
                {r.status==="Pending" && <Btn onClick={()=>processPayroll(r.id)} variant="ghost" size="sm">Process</Btn>}
                <Btn onClick={()=>setSlip(r)}   variant="primary"   size="sm">Payslip</Btn>
              </div>
            )},
          ]}
          data={payroll}
        />
      </Card>

      {/* Salary Config Modal */}
      <Modal open={!!configModal} onClose={()=>setConfigModal(null)} title={`Configure Salary — ${configModal?.name}`}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Field label="Basic Salary (₹)"><Input value={cfg.basic} onChange={e=>setCfg(c=>({...c,basic:e.target.value}))} type="number" /></Field>
          <Field label="HRA (₹)"><Input value={cfg.hra} onChange={e=>setCfg(c=>({...c,hra:e.target.value}))} type="number" /></Field>
          <Field label="Conveyance (₹)"><Input value={cfg.conveyance} onChange={e=>setCfg(c=>({...c,conveyance:e.target.value}))} type="number" /></Field>
          <Field label="Manual Deductions (₹)"><Input value={cfg.deductions} onChange={e=>setCfg(c=>({...c,deductions:e.target.value}))} type="number" /></Field>
          <Field label="TDS / Tax (₹)"><Input value={cfg.tds} onChange={e=>setCfg(c=>({...c,tds:e.target.value}))} type="number" /></Field>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",paddingBottom:2}}>
            <div style={{background:"var(--color-bg)",padding:"10px 12px",borderRadius:"var(--r-md)",border:"1px solid var(--color-border)"}}>
              <div style={{fontSize:10,fontWeight:600,color:"var(--color-text-muted)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Net Salary</div>
              <div className="stat-number" style={{fontSize:20,fontWeight:700,color:"var(--color-success)",marginTop:2}}>
                ₹{(Number(cfg.basic)+Number(cfg.hra)+Number(cfg.conveyance)-Number(cfg.deductions)-Number(cfg.tds)).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
          <Btn onClick={()=>setConfigModal(null)} variant="secondary">Cancel</Btn>
          <Btn onClick={saveCfg}>Save Configuration</Btn>
        </div>
      </Modal>

      {/* Payslip Modal */}
      <Modal open={!!slip} onClose={()=>setSlip(null)} title="Payslip" width={480}>
        {slip && (
          <div>
            {/* Header */}
            <div style={{textAlign:"center",padding:"0 0 16px",borderBottom:"2px solid var(--color-primary)",marginBottom:20}}>
              <div style={{fontSize:20,fontWeight:700,color:"var(--color-primary)",letterSpacing:"-0.01em"}}>HR Portal</div>
              <div style={{fontSize:11,color:"var(--color-text-muted)",marginTop:2}}>Salary Slip — {slip.month}</div>
            </div>
            {/* Employee info */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              {[["Employee Name",slip.name],["Employee ID",slip.empId],["Department",slip.dept],["Month",slip.month]].map(([k,v])=>(
                <div key={k} style={{background:"var(--color-bg)",padding:"8px 12px",borderRadius:"var(--r-md)"}}>
                  <div style={{fontSize:10,fontWeight:600,color:"var(--color-text-muted)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{k}</div>
                  <div style={{fontSize:13,fontWeight:500,marginTop:2}}>{v}</div>
                </div>
              ))}
            </div>
            {/* Earnings */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--color-text-muted)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Earnings</div>
              {[["Basic Salary",slip.basic],["HRA",slip.hra],["Conveyance",slip.conveyance]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--color-border)",fontSize:13}}>
                  <span style={{color:"var(--color-text-secondary)"}}>{k}</span>
                  <span style={{fontWeight:600}}>₹{v.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            {/* Deductions */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--color-text-muted)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Deductions</div>
              {[["PF / Manual Deduction",slip.deductions],["TDS / Income Tax",slip.tds]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--color-border)",fontSize:13}}>
                  <span style={{color:"var(--color-text-secondary)"}}>{k}</span>
                  <span style={{fontWeight:600,color:"var(--color-danger)"}}>-₹{v.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            {/* Net */}
            <div style={{background:"linear-gradient(135deg,var(--color-primary)10%,var(--color-accent)10%)",background:"var(--color-primary)",borderRadius:"var(--r-md)",padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>Net Salary</span>
              <span className="stat-number" style={{fontSize:20,fontWeight:800,color:"#fff"}}>₹{slip.net.toLocaleString("en-IN")}</span>
            </div>
            <div style={{marginTop:16,display:"flex",justifyContent:"center",gap:10}}>
              <Btn onClick={()=>toast({type:"success",msg:"PDF download initiated (production feature)."})} variant="primary">⬇ Download PDF</Btn>
              <Btn onClick={()=>toast({type:"info",msg:"Payslip sent to employee email."})} variant="secondary">📧 Email to Employee</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: HR DOCUMENTS — PRD §3.6, §4.4
// Offer letter, relieving letter with auto-fill + doc log
// ─────────────────────────────────────────────────────────────────────────────
const DocumentsPage = ({ employees, toast }) => {
  const [docs, setDocs] = useState([]);
  const [modal, setModal] = useState(null); // null | docType string
  const [empSel, setEmpSel] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  const DOC_TYPES = [
    { id:"offer",      label:"Offer Letter",       icon:"📋", desc:"Auto-filled offer letter with salary and designation details.", color:"var(--color-primary)" },
    { id:"relieving",  label:"Relieving Letter",    icon:"📝", desc:"Relieving letter for offboarding employees.", color:"var(--color-accent)" },
    { id:"payslip",    label:"Payslip",             icon:"💰", desc:"Monthly salary payslip with full breakdown.", color:"var(--color-warning)" },
    { id:"experience", label:"Experience Letter",   icon:"🏆", desc:"Experience certificate for completed tenure.", color:"var(--color-leave)" },
  ];

  const selectedEmp = employees.find(e => e.id === empSel);

  const generate = () => {
    if (!empSel || !selectedEmp) { toast({type:"error",msg:"Please select an employee."}); return; }
    const type = DOC_TYPES.find(d=>d.id===modal);
    const doc = { id:"DOC"+(docs.length+1).toString().padStart(3,"0"), type:type.label, empId:selectedEmp.id, empName:selectedEmp.name, dept:selectedEmp.dept, generatedOn:new Date().toLocaleDateString("en-IN"), status:"Generated" };
    setDocs(d=>[doc,...d]);
    toast({type:"success",msg:`${type.label} generated successfully.`});
    setModal(null);
    setEmpSel("");
  };

  // Document preview content
  const getPreviewContent = (doc) => {
    const emp = employees.find(e=>e.id===doc.empId) || {};
    if (doc.type === "Offer Letter") return `
OFFER LETTER

Date: ${doc.generatedOn}

Dear ${doc.empName},

We are pleased to offer you the position of ${emp.role} in the ${emp.dept} department at our organization.

Your monthly compensation will be ₹${Number(emp.salary).toLocaleString("en-IN")}, subject to applicable taxes and deductions.

You will be reporting to ${emp.manager}. Your joining date is ${emp.joinDate}.

Please confirm your acceptance by signing and returning a copy of this letter.

Sincerely,
HR Department
HR Portal Pvt. Ltd.
    `;
    if (doc.type === "Relieving Letter") return `
RELIEVING LETTER

Date: ${doc.generatedOn}

To Whom It May Concern,

This is to certify that ${doc.empName} (ID: ${doc.empId}) was employed with our organization in the ${doc.dept} department as ${emp.role} from ${emp.joinDate} to ${doc.generatedOn}.

${doc.empName} is hereby relieved from their duties and responsibilities effective ${doc.generatedOn}.

We wish them the best in their future endeavors.

Sincerely,
HR Department
HR Portal Pvt. Ltd.
    `;
    return `Document content for ${doc.type} — ${doc.empName}`;
  };

  return (
    <div className="page-enter">
      {/* Doc type cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {DOC_TYPES.map(dt => (
          <Card key={dt.id} style={{cursor:"pointer",borderTop:`3px solid ${dt.color}`,transition:"transform 0.12s, box-shadow 0.12s"}}
            onClick={()=>setModal(dt.id)}>
            <div style={{fontSize:28,marginBottom:10}}>{dt.icon}</div>
            <div style={{fontSize:14,fontWeight:600,color:"var(--color-text-primary)",marginBottom:6}}>{dt.label}</div>
            <div style={{fontSize:12,color:"var(--color-text-muted)",lineHeight:1.5,marginBottom:14}}>{dt.desc}</div>
            <Btn variant="ghost" size="sm" style={{color:dt.color}}>Generate PDF →</Btn>
          </Card>
        ))}
      </div>

      {/* Generated documents log */}
      <Card noPad>
        <div style={{padding:"14px 20px",borderBottom:"1px solid var(--color-border)"}}>
          <div style={{fontSize:14,fontWeight:600,color:"var(--color-text-primary)"}}>Generated Documents</div>
          <div style={{fontSize:12,color:"var(--color-text-muted)",marginTop:1}}>History of all HR documents generated</div>
        </div>
        {docs.length === 0
          ? <Empty icon="📄" msg="No documents generated yet. Click a document type above to create one." />
          : (
            <Table
              cols={[
                { key:"id", label:"Doc ID" },
                { key:"type", label:"Document Type", render:r=><span style={{fontWeight:500}}>{r.type}</span> },
                { key:"empName", label:"Employee", render:r=>(
                  <div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={r.empName} size={26}/><span>{r.empName}</span></div>
                )},
                { key:"dept", label:"Department" },
                { key:"generatedOn", label:"Generated On" },
                { key:"status", label:"Status", render:r=><Badge label={r.status}/> },
                { key:"actions", label:"Actions", render:r=>(
                  <div style={{display:"flex",gap:6}}>
                    <Btn onClick={()=>setPreviewDoc(r)} variant="ghost" size="sm">Preview</Btn>
                    <Btn onClick={()=>toast({type:"success",msg:"PDF download initiated."})} variant="secondary" size="sm">⬇ PDF</Btn>
                  </div>
                )},
              ]}
              data={docs}
            />
          )
        }
      </Card>

      {/* Generate Modal */}
      <Modal open={!!modal} onClose={()=>{setModal(null);setEmpSel("");}} title={`Generate — ${DOC_TYPES.find(d=>d.id===modal)?.label || ""}`}>
        <div style={{marginBottom:16}}>
          <Field label="Select Employee">
            <Select value={empSel} onChange={e=>setEmpSel(e.target.value)} style={{width:"100%"}}
              options={[{value:"",label:"Choose employee…"},...employees.map(e=>({value:e.id,label:`${e.name} (${e.id}) — ${e.role}`}))]} />
          </Field>
        </div>
        {selectedEmp && (
          <div style={{background:"var(--color-bg)",borderRadius:"var(--r-md)",padding:14,marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:600,color:"var(--color-text-muted)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Auto-filled Data</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Name",selectedEmp.name],["ID",selectedEmp.id],["Role",selectedEmp.role],["Dept",selectedEmp.dept],["Salary",`₹${Number(selectedEmp.salary).toLocaleString("en-IN")}`],["Joined",selectedEmp.joinDate]].map(([k,v])=>(
                <div key={k} style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:11,color:"var(--color-text-muted)",minWidth:44}}>{k}:</span>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary)"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{background:"var(--color-bg)",borderRadius:"var(--r-md)",padding:12,marginBottom:20,fontSize:12,color:"var(--color-text-muted)",lineHeight:1.6}}>
          ℹ Employee data will be automatically filled into the document template. The PDF will be available for download immediately after generation.
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn onClick={()=>{setModal(null);setEmpSel("");}} variant="secondary">Cancel</Btn>
          <Btn onClick={generate} disabled={!empSel}>Generate PDF</Btn>
        </div>
      </Modal>

      {/* Document Preview Modal */}
      <Modal open={!!previewDoc} onClose={()=>setPreviewDoc(null)} title={`Preview — ${previewDoc?.type}`} width={580}>
        {previewDoc && (
          <div>
            <div style={{background:"var(--color-bg)",borderRadius:"var(--r-md)",padding:24,fontFamily:"'Georgia',serif",fontSize:13,lineHeight:1.8,color:"var(--color-text-primary)",whiteSpace:"pre-wrap",border:"1px solid var(--color-border)"}}>
              {getPreviewContent(previewDoc)}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
              <Btn onClick={()=>toast({type:"success",msg:"PDF downloaded."})} variant="primary">⬇ Download PDF</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: SETTINGS — PRD §4.6 / system config
// Company info, leave policy, payroll config, department management
// ─────────────────────────────────────────────────────────────────────────────
const SettingsPage = ({ toast }) => {
  const [saved, setSaved] = useState(null);
  const [depts, setDepts] = useState(DEPARTMENTS);
  const [newDept, setNewDept] = useState("");

  const save = (section) => {
    toast({type:"success",msg:`${section} settings saved.`});
    setSaved(section);
    setTimeout(()=>setSaved(null),2000);
  };

  const addDept = () => {
    if (!newDept.trim()) return;
    setDepts(d=>[...d,newDept.trim()]);
    setNewDept("");
    toast({type:"success",msg:"Department added."});
  };

  const SectionCard = ({title, children, onSave}) => (
    <Card>
      <div style={{fontSize:14,fontWeight:600,color:"var(--color-text-primary)",marginBottom:16,paddingBottom:12,borderBottom:"1px solid var(--color-border)"}}>{title}</div>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>{children}</div>
      <Btn onClick={onSave} variant="primary" size="sm">{saved===title?"✓ Saved":"Save Changes"}</Btn>
    </Card>
  );

  return (
    <div className="page-enter">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <SectionCard title="Company Information" onSave={()=>save("Company Information")}>
          <Field label="Company Name"><Input placeholder="Acme Technologies Pvt. Ltd." /></Field>
          <Field label="Company Email"><Input placeholder="hr@acme.com" type="email" /></Field>
          <Field label="Company Phone"><Input placeholder="+91 98765 43210" /></Field>
          <Field label="Registered Address"><Textarea placeholder="123 Business Park, Mumbai, Maharashtra 400001" rows={2} /></Field>
        </SectionCard>

        <SectionCard title="Leave Policy" onSave={()=>save("Leave Policy")}>
          {[["Annual Leave Days","20"],["Sick Leave Days","10"],["Casual Leave Days","8"],["Emergency Leave Days","5"],["Carry Forward Limit","5"]].map(([lbl,val])=>(
            <Field key={lbl} label={lbl}><Input placeholder={val} type="number" /></Field>
          ))}
        </SectionCard>

        <SectionCard title="Payroll Configuration" onSave={()=>save("Payroll Configuration")}>
          {[["PF Deduction %","12"],["TDS Threshold (₹)","500000"],["HRA % of Basic","20"],["Conveyance Allowance (₹)","1600"],["Payroll Process Day","25"]].map(([lbl,val])=>(
            <Field key={lbl} label={lbl}><Input placeholder={val} type="number" /></Field>
          ))}
        </SectionCard>

        <Card>
          <div style={{fontSize:14,fontWeight:600,color:"var(--color-text-primary)",marginBottom:16,paddingBottom:12,borderBottom:"1px solid var(--color-border)"}}>Department Management</div>
          {depts.map((d,i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<depts.length-1?"1px solid var(--color-border)":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:["var(--color-primary)","var(--color-accent)","var(--color-leave)","var(--color-warning)","var(--color-success)","var(--color-danger)"][i%6]}} />
                <span style={{fontSize:13,fontWeight:500}}>{d}</span>
              </div>
              <Btn onClick={()=>setDepts(ds=>ds.filter(x=>x!==d))} variant="danger" size="sm">Remove</Btn>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <Input value={newDept} onChange={e=>setNewDept(e.target.value)} placeholder="New department name" style={{flex:1}} />
            <Btn onClick={addDept} variant="primary" size="sm">Add</Btn>
          </div>
        </Card>

        <SectionCard title="Security & Authentication" onSave={()=>save("Security & Authentication")}>
          <Field label="Session Timeout (hours)"><Input placeholder="8" type="number" /></Field>
          <Field label="Password Min Length"><Input placeholder="8" type="number" /></Field>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
            <div>
              <div style={{fontSize:13,fontWeight:500}}>Two-Factor Authentication</div>
              <div style={{fontSize:11,color:"var(--color-text-muted)"}}>Require 2FA for Admin accounts</div>
            </div>
            <div style={{width:36,height:20,borderRadius:"var(--r-full)",background:"var(--color-primary)",cursor:"pointer",position:"relative"}}>
              <div style={{position:"absolute",right:2,top:2,width:16,height:16,borderRadius:"50%",background:"#fff"}} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notification Preferences" onSave={()=>save("Notification Preferences")}>
          {[["Email on leave approval","Enabled"],["Email on payslip generation","Enabled"],["Email on task assignment","Disabled"],["Daily attendance digest","Enabled"]].map(([lbl,def])=>(
            <div key={lbl} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13}}>{lbl}</span>
              <Badge label={def} />
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 — APP SHELL (PRD §3 routes, Design Doc §3.1)
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]             = useState(null);
  const [page, setPage]             = useState("dashboard");
  const [toast, setToast]           = useState(null);
  const [employees, setEmployees]   = useState(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [leaves, setLeaves]         = useState(INITIAL_LEAVES);
  const [tasks, setTasks]           = useState(INITIAL_TASKS);
  const [payroll, setPayroll]       = useState(INITIAL_PAYROLL);

  const showToast = useCallback(t => {
    setToast(t);
    setTimeout(() => setToast(null), 3200);
  }, []);

  if (!user) return (
    <>
      <style>{CSS}</style>
      <LoginPage onLogin={u => { setUser(u); setPage("dashboard"); }} />
    </>
  );

  const PAGES = {
    dashboard: <DashboardPage employees={employees} tasks={tasks} payroll={payroll} leaves={leaves} role={user.role} />,
    employees: <EmployeesPage employees={employees} setEmployees={setEmployees} toast={showToast} />,
    attendance:<AttendancePage attendance={attendance} setAttendance={setAttendance} toast={showToast} />,
    leaves:    <LeavesPage leaves={leaves} setLeaves={setLeaves} toast={showToast} role={user.role} />,
    tasks:     <TasksPage tasks={tasks} setTasks={setTasks} employees={employees} toast={showToast} />,
    payroll:   <PayrollPage payroll={payroll} setPayroll={setPayroll} toast={showToast} />,
    documents: <DocumentsPage employees={employees} toast={showToast} />,
    settings:  <SettingsPage toast={showToast} />,
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar active={page} onNav={setPage} user={user} onLogout={() => setUser(null)} />
        <div style={{ marginLeft: 228, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header page={page} user={user} notifications={leaves.filter(l=>l.status==="Pending").length} />
          <main style={{ marginTop: 58, padding: "24px 28px", flex: 1 }}>
            {PAGES[page] || PAGES.dashboard}
          </main>
        </div>
      </div>
      <Toast toast={toast} />
    </>
  );
}
