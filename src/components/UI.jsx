import React, { useState, useContext } from "react";
import {
  ArrowLeft, Bell, Search, Filter, Calendar, Plus, Wallet, ShieldCheck, Lock,
  Fingerprint, CreditCard, TrendingUp, PiggyBank, User, Home, List, PieChart,
  Target, ChevronRight, ChevronDown, Check, Eye, EyeOff, Mail, Phone, Smartphone,
  Building2, HelpCircle, LogOut, AlertTriangle, Star, ShieldAlert, Utensils, Bus,
  Receipt, ShoppingBag, Film, Zap, GraduationCap, Plane, Key, MoreHorizontal,
  Moon, Sun, Coins, BarChart3, Clock, Briefcase, Store,
  HeartPulse, HandCoins,
} from "lucide-react";

import { ThemeContext, DARK_C } from "../theme";
import { daysInMonth, firstWeekday } from "../utils";

/* --------------------------------- SHELL UI --------------------------------- */
export function BackHeader({ title, onBack, right }) {
  const C = useContext(ThemeContext);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 14px" }}>
      <button onClick={onBack} aria-label="Go back" style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <ArrowLeft size={20} color={C.navy} />
      </button>
      <h1 style={{ fontSize: 16, fontWeight: 800, color: C.navy, margin: 0 }}>{title}</h1>
      <div style={{ width: 36, display: "flex", justifyContent: "flex-end" }}>{right || null}</div>
    </div>
  );
}

export function PrimaryButton({ children, onClick, style, disabled }) {
  const C = useContext(ThemeContext);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "15px 20px", borderRadius: 14, border: "none",
        background: disabled ? "#A9CDB6" : C.green, color: "#fff", fontSize: 15, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8, boxShadow: disabled ? "none" : "0 8px 20px -8px rgba(21,154,72,0.55)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick, style }) {
  const C = useContext(ThemeContext);
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", padding: "14px 20px", borderRadius: 14, border: `1.5px solid ${C.green}`,
        background: C.card, color: C.green, fontSize: 15, fontWeight: 700, cursor: "pointer", ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Field({ icon: Icon, ...props }) {
  const C = useContext(ThemeContext);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "13px 14px", background: C.card }}>
      {Icon && <Icon size={17} color={C.textMuted} />}
      <input
        {...props}
        style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontWeight: 600, color: C.navy, background: "transparent" }}
      />
    </div>
  );
}

export function ProgressBar({ pct, color, track, height = 8 }) {
  const C = useContext(ThemeContext);
  return (
    <div style={{ width: "100%", height, borderRadius: 99, background: track || (C === DARK_C ? "#243252" : "#E4EDE7"), overflow: "hidden" }}>
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: "100%", borderRadius: 99, background: color || C.green, transition: "width .3s" }} />
    </div>
  );
}

export function BottomNav({ active, onNavigate }) {
  const C = useContext(ThemeContext);
  const items = [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "transactions", label: "Transactions", icon: List },
    { key: "budgetHub", label: "Budget", icon: PieChart },
    { key: "goals", label: "Goal", icon: Target },
    { key: "profile", label: "Profile", icon: User },
  ];
  const inactiveColor = C === DARK_C ? "#5B6C8A" : "#9AA6A0";
  return (
    <div style={{ display: "flex", borderTop: `1px solid ${C.border}`, background: C.card, padding: "10px 4px 14px" }}>
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onNavigate(it.key)}
            style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}
          >
            <it.icon size={20} color={isActive ? C.green : inactiveColor} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 800 : 600, color: isActive ? C.green : inactiveColor }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Screen({ children, nav, active, onNavigate, scroll = true }) {
  const C = useContext(ThemeContext);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg, position: "relative" }}>
      <div style={{ flex: 1, overflowY: scroll ? "auto" : "hidden", padding: "18px 18px" }}>{children}</div>
      {nav && <BottomNav active={active} onNavigate={onNavigate} />}
    </div>
  );
}

export function DatePickerField({ value, onChange, formatLongDate }) {
  const C = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const initial = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dim = daysInMonth(viewYear, viewMonth);
  const startDay = firstWeekday(viewYear, viewMonth);
  const selectedYear = value ? Number(value.slice(0, 4)) : null;
  const selectedMonth = value ? Number(value.slice(5, 7)) - 1 : null;
  const selectedDay = value ? Number(value.slice(8, 10)) : null;
  const selectedMatchesView = selectedYear === viewYear && selectedMonth === viewMonth;

  const changeMonth = (delta) => {
    let m = viewMonth + delta, y = viewYear;
    if (m < 0) { m = 11; y -= 1; } else if (m > 11) { m = 0; y += 1; }
    setViewMonth(m); setViewYear(y);
  };
  const selectDay = (day) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${open ? C.green : C.border}`, borderRadius: 12, padding: 12, cursor: "pointer", background: C.card }}
      >
        <Calendar size={16} color={C.textMuted} />
        <span style={{ fontSize: 13.5, color: C.navy, fontWeight: 600 }}>{formatLongDate(value)}</span>
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, zIndex: 50, boxShadow: "0 14px 34px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <button onClick={() => changeMonth(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}><ChevronRight size={16} color={C.navy} style={{ transform: "rotate(180deg)" }} /></button>
              <span style={{ fontWeight: 800, color: C.navy, fontSize: 13 }}>{monthNames[viewMonth]} {viewYear}</span>
              <button onClick={() => changeMonth(1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}><ChevronRight size={16} color={C.navy} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} style={{ textAlign: "center", fontSize: 10, color: C.textMuted, fontWeight: 700 }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
              {Array.from({ length: startDay }).map((_, i) => <div key={"b" + i} />)}
              {Array.from({ length: dim }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedMatchesView && selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => selectDay(day)}
                    style={{
                      width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer",
                      background: isSelected ? C.green : "transparent",
                      color: isSelected ? "#fff" : C.navy, fontWeight: isSelected ? 800 : 600, fontSize: 12,
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

