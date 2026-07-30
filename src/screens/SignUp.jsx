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

export default function SignUp() {
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
    handleLogin, showPw, setShowPw, lastName, setLastName, signupEmail, setSignupEmail, signupPhone, setSignupPhone, signupPassword,
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
    <Screen>
      <BackHeader title="" onBack={goBack} />
      <h2 style={{ color: C.navy, fontSize: 20, fontWeight: 800, marginBottom: 2 }}>Create your account</h2>
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 18 }}>Let's get you started</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${signupErrors.name ? C.red : C.border}`, borderRadius: 14, padding: "13px 14px", background: C.card }}>
            <User size={17} color={C.textMuted} />
            <input value={name} onChange={(e) => { setName(e.target.value); clearErr("name"); }} placeholder="First Name" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontWeight: 600, color: C.navy, background: "transparent" }} />
          </div>
          {signupErrors.name && <p style={{ color: C.red, fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>{signupErrors.name}</p>}
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${signupErrors.lastName ? C.red : C.border}`, borderRadius: 14, padding: "13px 14px", background: C.card }}>
            <User size={17} color={C.textMuted} />
            <input value={lastName} onChange={(e) => { setLastName(e.target.value); clearErr("lastName"); }} placeholder="Last Name" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontWeight: 600, color: C.navy, background: "transparent" }} />
          </div>
          {signupErrors.lastName && <p style={{ color: C.red, fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>{signupErrors.lastName}</p>}
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${signupErrors.email ? C.red : C.border}`, borderRadius: 14, padding: "13px 14px", background: C.card }}>
            <Mail size={17} color={C.textMuted} />
            <input value={signupEmail} onChange={(e) => { setSignupEmail(e.target.value); clearErr("email"); }} placeholder="Email Address" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontWeight: 600, color: C.navy, background: "transparent" }} />
          </div>
          {signupErrors.email && <p style={{ color: C.red, fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>{signupErrors.email}</p>}
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${signupErrors.phone ? C.red : C.border}`, borderRadius: 14, padding: "13px 14px", background: C.card }}>
            <Phone size={17} color={C.textMuted} />
            <input value={signupPhone} onChange={(e) => { setSignupPhone(e.target.value); clearErr("phone"); }} placeholder="Phone Number" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontWeight: 600, color: C.navy, background: "transparent" }} />
          </div>
          {signupErrors.phone && <p style={{ color: C.red, fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>{signupErrors.phone}</p>}
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${signupErrors.password ? C.red : C.border}`, borderRadius: 14, padding: "13px 14px", background: C.card }}>
            <Lock size={17} color={C.textMuted} />
            <input type={showPw ? "text" : "password"} value={signupPassword} onChange={(e) => { setSignupPassword(e.target.value); clearErr("password"); }} placeholder="Password" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent" }} />
            <button onClick={() => setShowPw((s) => !s)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              {showPw ? <EyeOff size={17} color={C.textMuted} /> : <Eye size={17} color={C.textMuted} />}
            </button>
          </div>
          {signupErrors.password && <p style={{ color: C.red, fontSize: 11, fontWeight: 700, margin: "4px 0 0" }}>{signupErrors.password}</p>}
        </div>
        <p style={{ fontSize: 11.5, color: C.textMuted, margin: "6px 0 0" }}>
          Password must contain:<br />• At least 8 characters &nbsp; • One number &nbsp; • One special character
        </p>
      </div>
      <PrimaryButton style={{ marginTop: 14 }} onClick={handleCreateAccount}>Create Account</PrimaryButton>
      <div style={{ textAlign: "center", color: C.textMuted, fontSize: 12, margin: "14px 0" }}>or</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <OutlineButton onClick={() => showToast("Google sign-in isn't available in this demo — please use the form above.")} style={{ borderColor: C.border, color: C.navy }}>Continue with Google</OutlineButton>
        <OutlineButton onClick={() => showToast("Apple sign-in isn't available in this demo — please use the form above.")} style={{ borderColor: C.border, color: C.navy }}>Continue with Apple</OutlineButton>
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: C.textMuted, marginTop: 16 }}>
        By creating an account, you agree to our <span style={{ color: C.green, fontWeight: 700 }}>Terms</span> and <span style={{ color: C.green, fontWeight: 700 }}>Privacy Policy</span>.
      </p>
    </Screen>
  );
}
