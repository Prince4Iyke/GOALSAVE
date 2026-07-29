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

export default function Otp() {
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
    otpError, handleVerifyOtp, handleResendOtp, apiBusy,
  } = ctx;

  return (
    <Screen>
      <BackHeader title="" onBack={goBack} />
      <h2 style={{ color: C.navy, fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 4 }}>Verify your phone</h2>
      <p style={{ color: C.textMuted, fontSize: 13, textAlign: "center" }}>Enter the 6-digit code sent to<br /><b style={{ color: C.navy }}>{signupPhone || "your phone"}</b></p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "22px 0 10px" }}>
        {otp.map((d, i) => (
          <input key={i} value={d} maxLength={1} onChange={(e) => { const c = [...otp]; c[i] = e.target.value.replace(/\D/, ""); setOtp(c); }}
            style={{ width: 38, height: 46, textAlign: "center", fontSize: 18, fontWeight: 800, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.navy }} />
        ))}
      </div>
      <p style={{ textAlign: "center", color: C.textMuted, fontSize: 12 }}>
        {resendSeconds > 0 ? (
          `Resend code in 00:${String(resendSeconds).padStart(2, "0")}`
        ) : (
          <span
            onClick={handleResendOtp}
            style={{ color: C.green, fontWeight: 700, cursor: "pointer" }}
          >
            Resend code
          </span>
        )}
      </p>
      {otpError && <p style={{ textAlign: "center", color: "#DC4646", fontSize: 12, fontWeight: 700, marginTop: 8 }}>{otpError}</p>}
      <div style={{ flex: 1 }} />
      <PrimaryButton onClick={handleVerifyOtp} disabled={apiBusy}>{apiBusy ? "Verifying..." : "Continue"}</PrimaryButton>
    </Screen>
  );
}
