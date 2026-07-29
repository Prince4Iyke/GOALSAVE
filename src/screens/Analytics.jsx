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

export default function Analytics() {
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
    <Screen nav active="budgetHub" onNavigate={goToTab}>
      <BackHeader
        title="Spending Analytics"
        onBack={goBack}
        right={
          <div style={{ position: "relative" }}>
            <div onClick={() => setShowMonthPicker((s) => !s)} style={{ cursor: "pointer", display: "flex" }}>
              <Calendar size={17} color={C.navy} />
            </div>
            {showMonthPicker && (
              <>
                <div onClick={() => setShowMonthPicker(false)} style={{ position: "fixed", inset: 0, zIndex: 55 }} />
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 10, zIndex: 60, boxShadow: "0 14px 30px -10px rgba(0,0,0,0.25)", width: 168 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <button onClick={() => setAnalyticsYear((y) => y - 1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ChevronRight size={14} color={C.navy} style={{ transform: "rotate(180deg)" }} /></button>
                    <span style={{ fontWeight: 800, color: C.navy, fontSize: 12.5 }}>{analyticsYear}</span>
                    <button onClick={() => setAnalyticsYear((y) => y + 1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ChevronRight size={14} color={C.navy} /></button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4 }}>
                    {monthNamesShort.map((m, i) => (
                      <button
                        key={m}
                        onClick={() => { setAnalyticsMonthIndex(i); setShowMonthPicker(false); }}
                        style={{ padding: "6px 0", borderRadius: 8, border: "none", cursor: "pointer", background: i === analyticsMonthIndex ? C.green : "transparent", color: i === analyticsMonthIndex ? "#fff" : C.navy, fontSize: 11, fontWeight: 700 }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        }
      />
      <div style={{ display: "flex", background: C.border, borderRadius: 12, padding: 4, marginBottom: 14 }}>
        {["Weekly", "Monthly"].map((t) => (
          <div
            key={t}
            onClick={() => setAnalyticsPeriod(t)}
            style={{ flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 9, fontWeight: 700, fontSize: 12.5, cursor: "pointer", background: analyticsPeriod === t ? C.green : "transparent", color: analyticsPeriod === t ? "#fff" : C.textMuted }}
          >
            {t}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <button onClick={goToPrevMonth} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ChevronRight size={16} style={{ transform: "rotate(180deg)" }} color={C.textMuted} /></button>
        <span style={{ fontWeight: 700, color: C.navy, fontSize: 13 }}>{monthNamesFull[analyticsMonthIndex]} {analyticsYear}</span>
        <button onClick={goToNextMonth} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ChevronRight size={16} color={C.textMuted} /></button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
        <div style={{ width: 100, height: 100, borderRadius: 50, background: donutGradient, flexShrink: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 18, borderRadius: 32, background: C.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 9, color: C.textMuted }}>Total Spent</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: C.navy }}>{fmtNShort(totalExpenses)}</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {spendingBreakdown.map((s) => (
            <div
              key={s.cat}
              onClick={() => { setTxFilter(s.cat); goToTab("transactions"); }}
              style={{ display: "flex", justifyContent: "space-between", fontSize: 11, cursor: "pointer" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.navy, fontWeight: 700 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: s.color, display: "inline-block" }} />{s.cat}</span>
              <span style={{ color: C.textMuted, fontWeight: 700 }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontWeight: 800, color: C.navy, fontSize: 13, marginBottom: 10 }}>Spending Trend</div>
        <svg width="100%" height="80" viewBox="0 0 280 80" preserveAspectRatio="none">
          <polyline fill="none" stroke={C.green} strokeWidth="2.5" points={activeTrend.map((v, i) => `${i * 46 + 10},${80 - v}`).join(" ")} />
          {activeTrend.map((v, i) => <circle key={i} cx={i * 46 + 10} cy={80 - v} r="3" fill={C.green} />)}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: C.textMuted }}>{activeLabels.map((w) => <span key={w}>{w}</span>)}</div>
      </div>
      <div
        onClick={() => { setTxFilter("Food"); goToTab("transactions"); }}
        style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, marginBottom: 14, cursor: "pointer" }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Utensils size={18} color={C.green} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: C.textMuted }}>Top Spending Category</div><div style={{ fontWeight: 800, color: C.navy }}>Food</div></div>
        <div style={{ textAlign: "right" }}><b style={{ color: C.navy }}>35%</b></div>
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <TrendingUp size={22} color={C.green} />
        <div><div style={{ fontWeight: 800, color: C.navy, fontSize: 13 }}>Insight</div><div style={{ fontSize: 12, color: C.textMuted }}>You spent 20% less this month compared to last. Keep it up!</div></div>
      </div>
    </Screen>
  );
}
