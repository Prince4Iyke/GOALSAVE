import React, { useState, useEffect } from "react";
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
import { CARD_GRADIENT, fmtN, fmtNShort } from "../theme";

// Images for the auto-rotating "saving inspiration" carousel at the bottom of the Goals screen.
// Place the image files in your project's src/assets folder (or update these import paths
// to wherever you keep static assets).
import goalImg1 from "../assets/icon_4.jpg";
import goalImg2 from "../assets/icon_5.jpg";
import goalImg3 from "../assets/icon_6.jpg";
import goalImg4 from "../assets/icon_7.jpg";
import goalImg5 from "../assets/icon_8.jpg";

const GOAL_CAROUSEL_IMAGES = [goalImg1, goalImg2, goalImg3, goalImg4, goalImg5];

// Small self-contained carousel: shows one image at a time, cross-fading to the next
// on a fixed interval. Kept as its own component so it manages its own timer/state
// without touching the rest of the Goals screen's context.
function GoalsImageCarousel({ images, intervalMs = 3000 }) {
  const C = useTheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images, intervalMs]);

  if (!images || images.length === 0) return null;

  return (
    <div style={{ marginTop: 20, marginBottom: 12 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 160,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          background: C.card,
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: i === index ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i === index ? C.green : C.border,
              cursor: "pointer",
              transition: "width 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Goals() {
  const ctx = useApp();
  const C = useTheme();
  const {
    screen, setScreen, history, setHistory, name, setName, darkMode, setDarkMode,
    biometricEnabled, setBiometricEnabled, twoFactorEnabled, setTwoFactorEnabled, toast, setToast, showToast, profileEmail,
    setProfileEmail, profilePhone, setProfilePhone, isEditingProfile, setIsEditingProfile, transactions, setTransactions, goals,
    setGoals, notifications, setNotifications, income, setIncome, currency, setCurrency, budgetCats,
    setBudgetCats, allocations, setAllocations, notifFilter, setNotifFilter, txFilter, setTxFilter, navigate,
    goToTab, goBack, totalIncome, setTotalIncome, totalExpenses, totalAllocated, phone, setPhone,
    pin, setPin, showLoginPw, setShowLoginPw, rememberPassword, setRememberPassword, loginError, setLoginError,
    handleLogin, showPw, setShowPw, signupEmail, setSignupEmail, signupPhone, setSignupPhone, signupPassword,
    setSignupPassword, signupErrors, setSignupErrors, validatePassword, handleCreateAccount, clearErr, otp, setOtp,
    resendSeconds, setResendSeconds, currencies, budgetStep, setBudgetStep, incomeType, setIncomeType, customIncomeInputRef,
    steps, toggleCat, spendingBreakdown, donutGradient, emergency, unreadCount, expAmount, setExpAmount,
    expAccount, setExpAccount, showAccountDropdown, setShowAccountDropdown, expCat, setExpCat, expNote, setExpNote,
    expDate, setExpDate, ordinal, formatLongDate, formatShortGroupDate, addExpenseCats, incAmount, setIncAmount,
    incSource, setIncSource, incNote, setIncNote, incDate, setIncDate, incomeSources, txSearch,
    setTxSearch, txSortNewest, setTxSortNewest, searchedTx, catFilteredTx, filteredTx, grouped, dailyBudget,
    spentToday, monthlyTrend, weeklyTrend, monthWeekLabels, dayLabels, monthNamesShort, monthNamesFull, analyticsPeriod,
    setAnalyticsPeriod, analyticsMonthIndex, setAnalyticsMonthIndex, analyticsYear, setAnalyticsYear, showMonthPicker, setShowMonthPicker, activeTrend,
    activeLabels, goToPrevMonth, goToNextMonth, contribAmount, setContribAmount, contributionHistory, setContributionHistory, showAllHistory,
    setShowAllHistory, showAddGoal, setShowAddGoal, newGoalName, setNewGoalName, newGoalTarget, setNewGoalTarget, expandedGoalId,
    setExpandedGoalId, otherContribAmount, setOtherContribAmount, others, addContribution, filteredNotifs, notifGrouped,
    handleCreateGoal,
  } = ctx;

  return (
    <Screen nav active="goals" onNavigate={goToTab}>
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
      <BackHeader
        title="My saving goals"
        onBack={() => goToTab("dashboard")}
        right={
          <div onClick={() => setShowAddGoal(true)} style={{ cursor: "pointer", display: "flex" }}>
            <Plus size={18} color={C.navy} />
          </div>
        }
      />
      <div style={{ borderRadius: 16, padding: 16, background: CARD_GRADIENT, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 62, height: 62, borderRadius: 31, background: `conic-gradient(#fff ${(emergency.saved / emergency.target) * 360 || 252}deg, rgba(255,255,255,0.35) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: C.greenDark }} />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Emergency Fund</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 11.5 }}>{fmtN(emergency.saved)} of {fmtN(emergency.target)}</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 11.5 }}>Estimated date of completion</div>
            <div style={{ color: "#fff", fontSize: 11.5, fontWeight: 700 }}>{emergency.due}</div>
          </div>
        </div>
        <input
          value={contribAmount}
          onChange={(e) => setContribAmount(e.target.value.replace(/\D/g, ""))}
          placeholder={emergency.id ? "Amount to add" : "Create a goal first"}
          disabled={!emergency.id}
          style={{ width: "80%", margin: "20px 30px 0", border: "1px, solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 10, color: "#fff", fontWeight: 700, outline: "none", opacity: emergency.id ? 1 : 0.6 }}
        />
        <button
          onClick={() => {
  if (!emergency.id) {
    setNewGoalName("Emergency Fund");
    setShowAddGoal(true);
    return;
  }

  navigate("addExpense", {
    type: "savingsContribution",
    goal: emergency,
    amount: contribAmount,
  });
}}
          style={{ width: "100%", marginTop: 10, background: "#fff", color: C.green, border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 800, cursor: "pointer" }}
        >
          Add Contribution
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h4 style={{ color: C.navy, fontSize: 13.5, fontWeight: 800, margin: 0 }}>My saving history</h4>
        {contributionHistory.length > 3 && (
          <span onClick={() => setShowAllHistory((s) => !s)} style={{ color: C.green, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {showAllHistory ? "Show less" : "View all"}
          </span>
        )}
      </div>
      <div style={{ border: `1.5px solid ${C.navy}`, borderRadius: 14, padding: 4, marginBottom: 20 }}>
        {contributionHistory.length === 0 ? (
          <div style={{ padding: 18, textAlign: "center", color: C.textMuted, fontSize: 12.5 }}>No contributions yet — add one above to get started.</div>
        ) : (
          (showAllHistory ? contributionHistory : contributionHistory.slice(0, 3)).map((h, i, arr) => (
            <div key={h.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 10px", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, border: `1.5px solid ${C.navy}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={13} color={C.navy} /></div>
                <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 600 }}>Added to {h.goalName}</span>
              </div>
              <div style={{ textAlign: "right" }}><div style={{ fontWeight: 700, color: C.navy, fontSize: 12.5 }}>{fmtNShort(h.amount)}</div><div style={{ fontSize: 10, color: C.textMuted }}>{h.time}</div></div>
            </div>
          ))
        )}
      </div>

      <h4 style={{ color: C.navy, fontSize: 13.5, fontWeight: 800, marginBottom: 10 }}>Others</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {others.map((g) => {
          const isExpanded = expandedGoalId === g.id;
          // Goals fetched from the real backend never have an `icon` field —
          // a React component can't be serialized over JSON, so this only
          // existed for goals created locally under USE_MOCK_DATA. Falling
          // back to Target keeps every goal renderable regardless of source.
          const GoalIcon = g.icon || Target;
          return (
            <div
              key={g.id}
              onClick={() => { setExpandedGoalId(isExpanded ? null : g.id); setOtherContribAmount(""); }}
              style={{ borderRadius: 14, padding: 14, background: `linear-gradient(135deg, ${C.greenDarker}, ${C.greenDark})`, cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <GoalIcon size={18} color="#fff" />
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 13.5 }}>{g.name}</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11.5, marginBottom: 6 }}>{fmtN(g.saved)} / {fmtN(g.target)}</div>
              <ProgressBar pct={(g.saved / g.target) * 100} color="#fff" track="rgba(255,255,255,0.25)" height={6} />
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 11, marginTop: 6, fontWeight: 700 }}>{Math.round((g.saved / g.target) * 100)}% Complete</div>
              {isExpanded && (
                <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 10 }}>
                  <input
                    value={otherContribAmount}
                    onChange={(e) => setOtherContribAmount(e.target.value.replace(/\D/g, ""))}
                    placeholder="Amount to add"
                    style={{ width: "100%", border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 10, color: "#fff", fontWeight: 700, outline: "none" }}
                  />
                  <button
                    onClick={() => {
                      if (!g.id) return;
                      addContribution(g.id, otherContribAmount);
                      setOtherContribAmount("");
                    }}
                    style={{ width: "100%", marginTop: 8, background: "#fff", color: C.green, border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 800, cursor: "pointer" }}
                  >
                    Add Contribution
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Auto-rotating image strip at the bottom of the Goals screen */}
      <GoalsImageCarousel images={GOAL_CAROUSEL_IMAGES} intervalMs={3000} />

      {showAddGoal && (
        <div
          onClick={() => setShowAddGoal(false)}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: C.card, borderRadius: 16, padding: 20, width: "100%", maxWidth: 300 }}>
            <h3 style={{ color: C.navy, fontSize: 15, fontWeight: 800, marginBottom: 14 }}>New Saving Goal</h3>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 4 }}>Goal Name</div>
              <input value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)} placeholder="e.g. New Laptop" style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: 10, fontSize: 13, color: C.navy, outline: "none", background: "transparent" }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 4 }}>Target Amount</div>
              <input value={newGoalTarget} onChange={(e) => setNewGoalTarget(e.target.value.replace(/\D/g, ""))} placeholder="0.00" style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: 10, fontSize: 13, color: C.navy, outline: "none", background: "transparent" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowAddGoal(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "transparent", color: C.textMuted, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              <button
                onClick={handleCreateGoal}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: C.green, color: "#fff", fontWeight: 800, cursor: "pointer" }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}
