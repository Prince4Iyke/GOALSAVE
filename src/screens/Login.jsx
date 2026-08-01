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

export default function Login() {
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
    handleLogin, showPw, setShowPw, loginEmail, setLoginEmail, signupEmail, setSignupEmail, signupPhone, setSignupPhone, signupPassword,
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
    handleForgotPassword,
  } = ctx;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.card, padding: "50px 22px 26px", overflowY: "auto" }}>
      <BackHeader style={{ margin: "10px 0 2px" }}  title="" onBack={goBack} />
      <h1 style={{ textAlign: "center", color: C.navy, fontSize: 35, fontWeight: 700, margin: "40px auto 60px" }}>WELCOME BACK</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${!loginEmail.trim() && loginError ? C.red : C.green}`, borderRadius: 5, height: 40, padding: "13px 14px" }}>
          <Mail size={18} color="gray" />
          <input value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); if (loginError) setLoginError(""); }} placeholder="Enter Email Address" style={{ border: "none", outline: "none", flex: 1, fontSize: 20, background: "transparent" }} />
          <span style={{ color: C.red, fontWeight: 900 }}>*</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${(!pin.trim() || !validatePassword(pin)) && loginError ? C.red : C.green}`, borderRadius: 5, height: 40, padding: "13px 14px" }}>
          <input
            type={showLoginPw ? "text" : "password"}
            value={pin}
            onChange={(e) => { setPin(e.target.value); if (loginError) setLoginError(""); }}
            placeholder="Enter password"
            style={{ border: "none", outline: "none", width: "100%", fontSize: 20, color: "gray", background: "transparent" }}
          />
          <button onClick={() => setShowLoginPw((s) => !s)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
            {showLoginPw ? <EyeOff size={16} color={C.textMuted} /> : <Eye size={16} color={C.textMuted} />}
          </button>
        </div>
        {loginError && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.red, fontSize: 12, fontWeight: 700 }}>
            <AlertTriangle size={13} /> {loginError}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, color: C.textMuted, cursor: "pointer" }}>
            <input type="checkbox" checked={rememberPassword} onChange={(e) => setRememberPassword(e.target.checked)} /> Remember Password
          </label>
          <span
            onClick={handleForgotPassword}
            style={{ color: C.black, fontWeight: 700, cursor: "pointer" }}
          >
            Forgot Password ?
          </span>
        </div>
      </div>
      
        <PrimaryButton style={{ 
          width: 150, 
          margin: "30px auto 15px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          width: 150,
          height: 60,
          borderRadius: 20,
          border: "none",
          fontWeight: 600,
          fontSize: 20,
          textAlign: "center",
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
          flexShrink: 0,
           }} 
           onClick={handleLogin}>Login</PrimaryButton>
        <OutlineButton style={{ 
          width: 350, 
          margin: "0 auto 0",
          height: 60,
          borderRadius: 20,
          fontWeight: 600,
          fontSize: 20,
          lineHeight: "24px",
          textAlign: "center",
          flexShrink: 0, }} onClick={() => navigate("signup")}>Create a new account</OutlineButton>
      
    </div>
  );
}