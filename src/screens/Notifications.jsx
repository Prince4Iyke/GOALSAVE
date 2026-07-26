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

export default function Notifications() {
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
      <BackHeader
        title="Notifications"
        onBack={goBack}
        right={<div onClick={() => showToast("Help Center isn't available in this demo yet.")} style={{ cursor: "pointer", display: "flex" }}><HelpCircle size={17} color={C.navy} /></div>}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, flex: 1 }}>
          {["All", "Alerts", "Bills", "Goals", "Security"].map((c) => (
            <button key={c} onClick={() => setNotifFilter(c)} style={{ whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 20, border: `1px solid ${notifFilter === c ? C.green : C.border}`, background: notifFilter === c ? C.green : C.card, color: notifFilter === c ? "#fff" : C.navy, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{c}</button>
          ))}
        </div>
      </div>
      {notifications.some((n) => n.unread) && (
        <div style={{ textAlign: "right", marginBottom: 12 }}>
          <span onClick={() => setNotifications((ns) => ns.map((x) => ({ ...x, unread: false })))} style={{ color: C.green, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            Mark all as read
          </span>
        </div>
      )}
      {Object.entries(notifGrouped).map(([group, items]) => (
        <div key={group} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, marginBottom: 8 }}>{group}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  setNotifications((ns) => ns.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
                  if (n.cat === "Alerts") { setTxFilter("Food"); goToTab("transactions"); }
                  else if (n.cat === "Bills") { setTxFilter("Bills"); goToTab("transactions"); }
                  else if (n.cat === "Goals") { goToTab("goals"); }
                  else if (n.cat === "Security") { navigate("securityCenter"); }
                }}
                style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, display: "flex", gap: 10, cursor: "pointer" }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><n.icon size={17} color={C.green} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 800, color: C.navy, fontSize: 13 }}>{n.type}</span>
                    <span style={{ fontSize: 10.5, color: C.textMuted }}>{n.when}</span>
                  </div>
                  <p style={{ fontSize: 12, color: C.textMuted, margin: "4px 0 0" }}>{n.body}</p>
                </div>
                {n.unread && <div style={{ width: 7, height: 7, borderRadius: 4, background: C.green, flexShrink: 0, marginTop: 4 }} />}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div onClick={() => navigate("securityCenter")} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <Bell size={18} color={C.navy} />
        <div style={{ flex: 1 }}><div style={{ fontWeight: 800, color: C.navy, fontSize: 13 }}>Notification Settings</div><div style={{ fontSize: 11.5, color: C.textMuted }}>Manage how and when you receive notifications.</div></div>
        <ChevronRight size={16} color={C.textMuted} />
      </div>
    </Screen>
  );
}
