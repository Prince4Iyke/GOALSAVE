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

export default function Onboard2() {
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
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.card, padding: "40px 22px 26px", overflowY: "auto" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ textAlign: "center", color: C.navy, fontSize: 22, fontWeight: 800, lineHeight: 1.3 }}>All your finances<br />in one place</h2>
        <p style={{ textAlign: "center", color: C.textMuted, fontSize: 13.5, marginTop: 8, marginBottom: 24 }}>
          Track expenses, create budgets, save for goals and more.
        </p>
        <div style={{ width: "100%", borderRadius: 18, border: `1px solid ${C.border}`, padding: 18, background: C.card, boxShadow: "0 10px 26px -14px rgba(16,27,61,0.25)" }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>Total Balance</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: "4px 0 12px" }}>{fmtNShort(128450)}</div>
          <div style={{ height: 40, display: "flex", alignItems: "flex-end", gap: 4 }}>
            {[10, 22, 14, 30, 20, 34, 26].map((h, i) => (
              <div key={i} style={{ flex: 1, height: h, borderRadius: 3, background: i === 5 ? C.green : "#E4EDE7" }} />
            ))}
          </div>
          <div style={{ marginTop: 14, height: 8, borderRadius: 6, background: "#F1F1F1" }} />
          <div style={{ marginTop: 8, height: 8, width: "70%", borderRadius: 6, background: "#F1F1F1" }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 22 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: i === 0 ? 18 : 6, height: 6, borderRadius: 4, background: i === 0 ? C.navy : "#D8D8D8" }} />
          ))}
        </div>
         <PrimaryButton style={{ marginTop: 30,}} onClick={() => navigate("login")}>Next</PrimaryButton>
      </div>
    </div>
  );
}
