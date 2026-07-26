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

export default function Profile() {
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
    <Screen nav active="profile" onNavigate={goToTab}>
      <div onClick={() => navigate("personalInfo")} style={{ borderRadius: 16, padding: 16, background: CARD_GRADIENT, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}><User size={22} color="#fff" /></div>
          <div><div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{name}</div><div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>{profileEmail}</div></div>
        </div>
        <ChevronRight color="#fff" size={18} />
      </div>

      <h4 style={{ color: C.navy, fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Account</h4>
      <div style={{ marginBottom: 20 }}>
        {[{ l: "Personal Information", icon: User, go: "personalInfo" }, { l: "Bank Accounts", icon: Building2 }, { l: "Preferences", icon: MoreHorizontal }].map((r, i) => (
          <div key={r.l} onClick={() => (r.go ? navigate(r.go) : showToast(`${r.l} isn't available in this demo yet.`))} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 2px", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
            <r.icon size={17} color={C.navy} />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.navy }}>{r.l}</span>
            <ChevronRight size={15} color={C.textMuted} />
          </div>
        ))}
      </div>

      <h4 style={{ color: C.navy, fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Security</h4>
      <div style={{ marginBottom: 8 }}>
        {[{ l: "Biometric Login", icon: Fingerprint }, { l: "Two-factor Authentication", icon: ShieldCheck }, { l: "Notification Settings", icon: Bell, go: "notifications" }, { l: "Help & Support", icon: HelpCircle }].map((r, i) => (
          <div key={r.l} onClick={() => (r.go ? navigate(r.go) : navigate("securityCenter"))} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 2px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
            <r.icon size={17} color={C.navy} />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.navy }}>{r.l}</span>
            <ChevronRight size={15} color={C.textMuted} />
          </div>
        ))}
      </div>

      <div onClick={() => goToTab("login")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 2px", cursor: "pointer" }}>
        <LogOut size={17} color={C.red} /><span style={{ color: C.red, fontWeight: 700, fontSize: 13.5 }}>Logout</span>
      </div>
    </Screen>
  );
}
