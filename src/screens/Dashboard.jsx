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

export default function Dashboard() {
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
    <Screen nav active="dashboard" onNavigate={goToTab}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 2px 16px" }}>
        <h2 style={{ color: C.navy, fontSize: 16, fontWeight: 800, margin: 0 }}>WELCOME, {name}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ cursor: "pointer" }} onClick={() => setDarkMode((d) => !d)}>
            {darkMode ? <Sun size={19} color={C.navy} /> : <Moon size={19} color={C.navy} />}
          </div>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => navigate("notifications")}>
            <Bell size={19} color={C.navy} />
            {unreadCount > 0 && <div style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: 4, background: C.red }} />}
          </div>
        </div>
      </div>

       <div style={{ width: "auto", borderRadius: 20, padding: 22, minHeight: 150, marginBottom: 10, backgroundImage: "url(/images/visa-card-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center", position: "relative", overflow: "hidden", boxShadow: "0 16px 30px -12px rgba(12,122,56,0.45)" }}>
        <div style={{ position: "absolute", right: -20, bottom: -30, fontSize: 150, color: "rgba(255,255,255,0.12)", fontWeight: 900 }}>$</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Accounts</span>
          <button onClick={() => navigate("addIncome")} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 20, color: "#fff", fontSize: 12, fontWeight: 700, padding: "6px 12px", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            <Plus size={13} /> Add Money
          </button>
        </div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 700, marginTop: 14 }}>TOTAL BALANCE</div>
        <div style={{ color: "#fff", fontSize: 24, fontWeight: 900, marginBottom: 20 }}>{fmtN(totalIncome - totalExpenses)}</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div><div style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>Total Income</div><div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>{fmtN(totalIncome)}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ color: "rgba(255,255,255,0.75)", fontSize: 10.5 }}>Total Expenses</div><div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>{fmtN(totalExpenses)}</div></div>
        </div>
      </div>

      <div onClick={() => navigate("goals")} style={{ border: `1.5px solid ${C.green}`, borderRadius: 16, padding: 14, marginBottom: 16, cursor: "pointer", background: C.card }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HandCoins size={17} color={C.green} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: C.navy, fontSize: 13.5 }}>Emergency Fund</div>
            <div style={{ fontSize: 11.5, color: C.textMuted }}>{fmtN(emergency.saved)} / {fmtN(emergency.target)}</div>
          </div>
        </div>
        <ProgressBar pct={(emergency.saved / emergency.target) * 100 || 70} />
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.navy, marginTop: 6 }}>{Math.round((emergency.saved / emergency.target) * 100) || 70}% Complete</div>
      </div>

      <h3 style={{ color: C.navy, fontSize: 13.5, fontWeight: 800, marginBottom: 10 }}>Quick Actions</h3>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        {[{ label: "Add Expenses", icon: Plus, go: "addExpense" }, { label: "Add Income", icon: TrendingUp, go: "addIncome" }, { label: "Create Budget", icon: PieChart, go: "budgetHub" }, { label: "Save Money", icon: PiggyBank, go: "goals" }].map((a) => (
          <div key={a.label} onClick={() => (a.go === "budgetHub" ? goToTab("budgetHub") : navigate(a.go))} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", width: 68 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, border: `1px solid ${C.border}`, background: C.card, display: "flex", alignItems: "center", justifyContent: "center" }}><a.icon size={18} color={C.navy} /></div>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.navy, textAlign: "center" }}>{a.label}</span>
          </div>
        ))}
      </div>

      <div onClick={() => navigate("analytics")} style={{ cursor: "pointer" }}>
        <h3 style={{ color: C.navy, fontSize: 13.5, fontWeight: 800, marginBottom: 10 }}>Spending Overview</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 16, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, background: C.card }}>
          <div style={{ width: 78, height: 78, borderRadius: 39, background: donutGradient, flexShrink: 0, position: "relative" }}>
            <div style={{ position: "absolute", inset: 14, borderRadius: 30, background: C.card }} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {spendingBreakdown.map((s) => (
              <div
                key={s.cat}
                onClick={(e) => { e.stopPropagation(); setTxFilter(s.cat); goToTab("transactions"); }}
                style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, cursor: "pointer" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.navy, fontWeight: 700 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: s.color, display: "inline-block" }} />{s.cat}
                </span>
                <span style={{ fontWeight: 800, color: C.navy }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}
