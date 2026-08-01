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
import { formatTime } from "../utils";

export default function SecurityCenter() {
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
    handleToggleBiometric, handleToggleTwoFactor,
  } = ctx;

  return (
    <Screen nav active="profile" onNavigate={goToTab}>
      <BackHeader title="Security Center" onBack={goBack} />
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, textAlign: "center", marginBottom: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}><ShieldCheck size={22} color={C.green} /></div>
        <div style={{ fontSize: 11.5, color: C.textMuted }}>Your Security Score</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: C.green, margin: "2px 0 8px" }}>{biometricEnabled && twoFactorEnabled ? "Strong" : "Moderate"}</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ flex: 1, height: 6, borderRadius: 4, background: i < (biometricEnabled && twoFactorEnabled ? 4 : 3) ? C.green : C.border }} />)}</div>
        <div style={{ fontSize: 11, color: C.textMuted }}>Last updated: Today, {formatTime(new Date())}</div>
      </div>

      <h4 style={{ color: C.navy, fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Security Settings</h4>
      <div style={{ marginBottom: 18 }}>
        {[
          { l: "Biometric Login", icon: Fingerprint, on: biometricEnabled, toggle: handleToggleBiometric },
          { l: "Two-Factor Authentication", icon: Lock, on: twoFactorEnabled, toggle: handleToggleTwoFactor },
          { l: "Change Password", icon: Key },
          { l: "Privacy Settings", icon: ShieldAlert },
        ].map((r, i) => (
          <div
            key={r.l}
            onClick={() => (r.toggle ? r.toggle() : showToast(`${r.l} isn't available in this demo yet.`))}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 2px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}
          >
            <r.icon size={17} color={C.navy} />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.navy }}>{r.l}</span>
            {"on" in r && <span style={{ fontSize: 11.5, color: r.on ? C.green : C.textMuted, fontWeight: 700, marginRight: 4 }}>{r.on ? "Enabled" : "Disabled"}</span>}
            <ChevronRight size={15} color={C.textMuted} />
          </div>
        ))}
      </div>

      <div onClick={() => showToast("Device management isn't available in this demo yet.")} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12, cursor: "pointer" }}>
        <div style={{ fontWeight: 800, color: C.navy, fontSize: 13, marginBottom: 4 }}>Device Management</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>Manage devices that have access to your account.</div>
        <div style={{ fontSize: 12, color: C.navy, fontWeight: 700 }}>3 devices</div>
      </div>
      <div onClick={() => showToast("Login history isn't available in this demo yet.")} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12, cursor: "pointer" }}>
        <div style={{ fontWeight: 800, color: C.navy, fontSize: 13, marginBottom: 4 }}>Login History</div>
        <div style={{ fontSize: 12, color: C.textMuted }}>View recent login activity.</div>
      </div>
      <div onClick={() => showToast("Help Center isn't available in this demo yet.")} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <HelpCircle size={18} color={C.navy} />
        <div><div style={{ fontWeight: 800, color: C.navy, fontSize: 13 }}>Need help?</div><div style={{ fontSize: 11.5, color: C.textMuted }}>Visit our Help Center or contact support.</div></div>
      </div>
    </Screen>
  );
}
