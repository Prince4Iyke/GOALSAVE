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
import { CARD_GRADIENT, fmtN, fmtNShort, CATEGORY_META } from "../theme";

export default function Transactions() {
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
    <Screen nav active="transactions" onNavigate={goToTab}>
      <BackHeader
        title="Expenses"
        onBack={() => goToTab("dashboard")}
        right={
          <div onClick={() => { setTxSortNewest((s) => !s); showToast(txSortNewest ? "Sorted by highest amount." : "Sorted by newest first."); }} style={{ cursor: "pointer", display: "flex" }}>
            <Filter size={17} color={txSortNewest ? C.navy : C.green} />
          </div>
        }
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 14 }}>
        <Search size={15} color={C.textMuted} />
        <input
          value={txSearch}
          onChange={(e) => setTxSearch(e.target.value)}
          placeholder="Search transactions"
          style={{ border: "none", outline: "none", flex: 1, fontSize: 13, color: C.navy, background: "transparent" }}
        />
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
        {["All", "Food", "Transport", "Bills", "Shopping", "Entertainment"].map((c) => (
          <button key={c} onClick={() => setTxFilter(c)} style={{ whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 20, border: `1px solid ${txFilter === c ? C.green : C.border}`, background: txFilter === c ? C.green : C.card, color: txFilter === c ? "#fff" : C.navy, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.navy, fontWeight: 700, marginBottom: 6 }}>
          <span>Remaining Daily Budget</span><span>{Math.round((1 - spentToday / dailyBudget) * 100)}%</span>
        </div>
        <div style={{ fontSize: 11.5, color: C.textMuted, marginBottom: 6 }}>{fmtNShort(Math.max(0, dailyBudget - spentToday))} of {fmtNShort(dailyBudget)}</div>
        <ProgressBar pct={100 - (spentToday / dailyBudget) * 100} />
      </div>
      {Object.keys(grouped).length === 0 && (
        <div style={{ textAlign: "center", color: C.textMuted, fontSize: 12.5, padding: "24px 0" }}>No transactions match your search.</div>
      )}
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, marginBottom: 8 }}>{group}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((t) => {
              const meta = CATEGORY_META[t.cat] || CATEGORY_META.Others;
              return (
                <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}`, borderRadius: 12, padding: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}><meta.icon size={16} color={meta.color} /></div>
                    <div><div style={{ fontWeight: 700, color: C.navy, fontSize: 13 }}>{t.cat} - {t.name}</div><div style={{ fontSize: 11, color: C.textMuted }}>{t.place}</div></div>
                  </div>
                  <div style={{ textAlign: "right" }}><div style={{ fontWeight: 800, color: C.navy, fontSize: 13 }}>{fmtNShort(t.amount)}</div><div style={{ fontSize: 10.5, color: C.textMuted }}>{t.time}</div></div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontSize: 11, color: C.textMuted }}>This Week</div><div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, marginTop: 4 }}>Spent {fmtNShort(totalExpenses)}</div><div style={{ fontSize: 11.5, color: C.textMuted }}>Budget {fmtNShort(75000)}</div></div>
        <BarChart3 size={30} color={C.green} />
      </div>
      <button onClick={() => navigate("addExpense")} style={{ position: "absolute", bottom: 90, right: 26, width: 50, height: 50, borderRadius: 25, background: C.green, border: "none", color: "#fff", boxShadow: "0 10px 20px -6px rgba(21,154,72,0.6)", cursor: "pointer" }}><Plus size={22} /></button>
    </Screen>
  );
}
