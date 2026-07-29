import React from "react";
import {
  ArrowLeft, Bell, Search, Filter, Calendar, Plus, Wallet, ShieldCheck, Lock,
  Fingerprint, CreditCard, TrendingUp, PiggyBank, User, Home, List, PieChart,
  Target, ChevronRight, ChevronDown, Check, Eye, EyeOff, Mail, Phone, Smartphone,
  Building2, HelpCircle, LogOut, AlertTriangle, Star, ShieldAlert, Utensils, Bus,
  Receipt, ShoppingBag, Film, Zap, GraduationCap, Plane, Key, MoreHorizontal,
  Moon, Sun, Coins, BarChart3, Clock, Briefcase, Store,
  HeartPulse, HandCoins,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../theme";
import { BackHeader, PrimaryButton, OutlineButton, Field, ProgressBar, BottomNav, Screen, DatePickerField } from "../components/UI";
import { fmtN, fmtNShort } from "../theme";

// ---- Design tokens pulled directly from the uploaded Figma CSS spec ----
const FONT = "'Roboto Condensed', sans-serif";
const T = {
  navy: "#070540",
  black: "#000000",
  white: "#FFFFFF",
  green: "#14AD4C",
  greenDark: "#0F9841",
  grey: "#D9D9D9",
  greyPanel: "rgba(204,204,204,0.4)",
  chart: {
    Food: "#14AD4C",
    Shopping: "#FFB700",
    Bills: "#1BDBED",
    Entertainment: "#FF1FEC",
    Transportation: "#070540",
  },
};

const heading = (size, lh, extra = {}) => ({
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: size,
  lineHeight: `${lh}px`,
  letterSpacing: "-0.02em",
  color: T.navy,
  margin: 0,
  ...extra,
});

const caption = (extra = {}) => ({
  fontFamily: FONT,
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "14px",
  color: T.black,
  ...extra,
});

export default function Dashboard() {
  const ctx = useApp();
  const C = useTheme();
  const {
    name, darkMode, setDarkMode, navigate, goToTab,
    totalIncome, totalExpenses, emergency, unreadCount,
    spendingBreakdown, donutGradient,
  } = ctx;

  return (
    <Screen nav active="dashboard" onNavigate={goToTab}>
      <style>{`
    /* Hide scrollbars everywhere (desktop + mobile) while keeping scroll functional */
    html, body, * {
      scrollbar-width: none;      /* Firefox */
      -ms-overflow-style: none;   /* IE / old Edge */
    }
    *::-webkit-scrollbar {        /* Chrome, Safari, new Edge, mobile WebKit */
      display: none;
      width: 0;
      height: 0;
    }
  `}</style>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 2px 16px" }}>
        <h2 style={heading(20, 24, { margin: "20px 2px 0", color: C.black, fontSize: 25, textAlign: "left" })}>WELCOME, {name}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ cursor: "pointer" }} onClick={() => setDarkMode((d) => !d)}>
            {darkMode ? <Sun size={19} color={T.navy} /> : <Moon size={19} color={T.navy} />}
          </div>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => navigate("notifications")}>
            <Bell size={19} color={T.navy} />
            {unreadCount > 0 && (
              <div style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: 4, background: "#E53935" }} />
            )}
          </div>
        </div>
      </div>

      {/* Accounts card — gradient green, 20px radius, exactly per spec */}
      <div
        style={{
         width: "90%", borderRadius: 3, padding: 22, minHeight: 220, margin: "0 auto 20px", backgroundImage: "url(/images/visa-card-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center", position: "relative", overflow: "hidden", boxShadow: "0 16px 30px -12px rgba(12,122,56,0.45)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{
              background: "transparent",
              color: T.white,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 30,
              alignItems: "center",
              cursor: "pointer",
            }}>Accounts</span>
          <button
            onClick={() => navigate("addIncome")}
            style={{
              background: "transparent",
              border: `2px solid ${T.green}`,
              borderRadius: 20,
              color: T.white,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: "-0.01em",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            }}
          >
            <Plus size={14} color={T.white} /> Add Money
          </button>
        </div>

        <div style={{ ...caption({ color: "rgba(255,255,255,0.85)", fontWeight: 200 }), marginTop: -10, }}>
          TOTAL BALANCE
        </div>
        <div style={ heading(33, 40, { fontWeight: 500, fontSize: 30, margin: "0 0 50px", position: "relative", boxShadow: "0 16px 30px -12px rgba(12,122,56,0.45)", color: T.white,})}>
          {fmtN(totalIncome - totalExpenses)}
        </div>

        <div style={{ height: 0, borderTop: "3px solid rgba(255,255,255,0.5)", marginBottom: 12 }} />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={caption({ margin: "10px 0 0", fontFamily: FONT, color: T.white,  fontSize: 18, fontWeight: 600, })}>Total Income</div>
            <div style={heading(19, 23, {  margin: "5px 0 0px",position: "relative", fontSize: 15, boxShadow: "0 16px 30px -12px rgba(12,122,56,0.45)", color: T.white, fontWeight: 200, })}>{fmtN(totalIncome)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={caption({margin: "10px 0 0", fontFamily: FONT, fontSize: 18, fontWeight: 600,  color: T.white })}>Total Expenses</div>
            <div style={heading(19, 23, { margin: "5px 45px 0px",position: "relative", fontWeight: 200, fontSize: 15, boxShadow: "0 16px 30px -12px rgba(12,122,56,0.45)", color: T.white })}>{fmtN(totalExpenses)}</div>
          </div>
        </div>
      </div>

      {/* Emergency Fund — outlined box, 10px radius, thick-line progress bar */}
      <div
        onClick={() => navigate("goals")}
        style={{
          border: `3px solid ${T.green}`,
          borderRadius: 10,
          padding: 14,
          marginBottom: 16,
          cursor: "pointer",
          background: T.white,
          width: "80%",
          margin: "5px 23px 3px",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: 5, border: `1px solid ${T.green}`, background: T.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HandCoins size={17} color={T.black} />
          </div>
          <div>
            <div style={heading(19, 23)}>Emergency Fund</div>
            <div style={caption({ color: "#555" })}>{fmtN(emergency.saved)} / {fmtN(emergency.target)}</div>
          </div>
        </div>

        {/* thick-line progress, per spec: 10px grey border track + 10px green border fill */}
        <div style={{ margin: "-10px 40px 20px", position: "relative", width: 300, height: 0 }}>
          <div style={{ width: "100%", borderTop: `10px solid ${T.grey}`, borderRadius: 5 }} />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${Math.min(100, (emergency.saved / emergency.target) * 100 || 70)}%`,
              borderTop: `10px solid ${T.green}`,
              borderRadius: 5,
            }}
          />
        </div>

        <div style={heading(16, 19, { margin: "0 40px 0" })}>
          {Math.round((emergency.saved / emergency.target) * 100) || 70}% Complete
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ ...heading(19, 23), marginBottom: 12 }}>Quick Actions</h3>
      <div style={{display: "flex", justifyContent: "space-between", margin: "0 0 30px" }}>
        {[
          { label: "Add Expenses", icon: Plus, go: "addExpense" },
          { label: "Add Income", icon: TrendingUp, go: "addIncome" },
          { label: "Create Budget", icon: PieChart, go: "budgetHub" },
          { label: "Save Money", icon: PiggyBank, go: "goals" },
        ].map((a) => (
          <div
            key={a.label}
            onClick={() => (a.go === "budgetHub" ? goToTab("budgetHub") : navigate(a.go))}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", width: 79 }}
          >
            <div style={{ width: 25, height: 25, borderRadius: 5, border: `1px solid ${T.green}`, background: T.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <a.icon size={14} color={T.black} />
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: "17px", color: T.black, textAlign: "center" }}>
              {a.label}
            </span>
          </div>
        ))}
      </div>

      {/* Spending Overview — translucent grey panel, 1px green border, 10px radius */}
      <h3 style={{ ...heading(16, 19), marginBottom: 12 }}>Spending Overview</h3>
      <div
        onClick={() => navigate("analytics")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          border: `1px solid ${T.green}`,
          borderRadius: 10,
          padding: 14,
          background: T.greyPanel,
          cursor: "pointer",
        }}
      >
        <div style={{ width: 104, height: 109, borderRadius: "50%", background: donutGradient, flexShrink: 0, position: "relative" }}>
          <div style={{ position: "absolute", inset: 18, borderRadius: "50%", background: T.white }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {spendingBreakdown.map((s) => (
            <div
              key={s.cat}
              onClick={(e) => { e.stopPropagation(); ctx.setTxFilter(s.cat); goToTab("transactions"); }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: T.chart[s.cat] || s.color,
                    display: "inline-block",
                  }}
                />
                <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em", color: T.navy }}>
                  {s.cat}
                </span>
              </span>
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em", color: T.navy }}>
                {s.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}
