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
import { CARD_GRADIENT, fmtN, fmtNShort } from "../theme";

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
  } = ctx;

  return (
    <Screen nav active="goals" onNavigate={goToTab}>
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
        <input value={contribAmount} onChange={(e) => setContribAmount(e.target.value.replace(/\D/g, ""))} placeholder="Amount to add" style={{ width: "100%", marginTop: 12, border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 10, color: "#fff", fontWeight: 700, outline: "none" }} />
        <button
          onClick={() => {
            addContribution(emergency.id, contribAmount);
            setContribAmount("");
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
          return (
            <div
              key={g.id}
              onClick={() => { setExpandedGoalId(isExpanded ? null : g.id); setOtherContribAmount(""); }}
              style={{ borderRadius: 14, padding: 14, background: `linear-gradient(135deg, ${C.greenDarker}, ${C.greenDark})`, cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <g.icon size={18} color="#fff" />
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
                    onClick={() => { addContribution(g.id, otherContribAmount); setOtherContribAmount(""); }}
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
                onClick={() => {
                  if (!newGoalName.trim() || !newGoalTarget) return;
                  setGoals((gs) => [...gs, { id: Date.now(), name: newGoalName.trim(), icon: Target, saved: 0, target: Number(newGoalTarget) }]);
                  setNewGoalName(""); setNewGoalTarget(""); setShowAddGoal(false);
                }}
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
