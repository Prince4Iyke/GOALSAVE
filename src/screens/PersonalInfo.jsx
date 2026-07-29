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

export default function PersonalInfo() {
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
    handleSaveProfile,
  } = ctx;

  return (
    <Screen nav active="profile" onNavigate={goToTab}>
      <BackHeader title="Personal Information" onBack={goBack} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 22 }}>
        <div style={{ width: 68, height: 68, borderRadius: 34, background: CARD_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
          <User size={30} color="#fff" />
        </div>
        <span style={{ fontWeight: 800, color: C.navy, fontSize: 15 }}>{name}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>Full Name</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${isEditingProfile ? C.green : C.border}`, borderRadius: 14, padding: "13px 14px", background: isEditingProfile ? "#fff" : C.bg }}>
            <User size={16} color={C.textMuted} />
            <input
              value={name}
              disabled={!isEditingProfile}
              onChange={(e) => setName(e.target.value)}
              style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontWeight: 600, color: C.navy, background: "transparent" }}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>Email Address</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${isEditingProfile ? C.green : C.border}`, borderRadius: 14, padding: "13px 14px", background: isEditingProfile ? "#fff" : C.bg }}>
            <Mail size={16} color={C.textMuted} />
            <input
              value={profileEmail}
              disabled={!isEditingProfile}
              onChange={(e) => setProfileEmail(e.target.value)}
              style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontWeight: 600, color: C.navy, background: "transparent" }}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>Phone Number</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${isEditingProfile ? C.green : C.border}`, borderRadius: 14, padding: "13px 14px", background: isEditingProfile ? "#fff" : C.bg }}>
            <Phone size={16} color={C.textMuted} />
            <input
              value={profilePhone}
              disabled={!isEditingProfile}
              onChange={(e) => setProfilePhone(e.target.value)}
              style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontWeight: 600, color: C.navy, background: "transparent" }}
            />
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      {isEditingProfile ? (
        <PrimaryButton onClick={handleSaveProfile} style={{ marginTop: 22 }}>
          <Check size={16} /> Save Changes
        </PrimaryButton>
      ) : (
        <OutlineButton onClick={() => setIsEditingProfile(true)} style={{ marginTop: 22 }}>
          Edit Information
        </OutlineButton>
      )}
    </Screen>
  );
}
