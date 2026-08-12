import React from "react";
import {
  ArrowLeft, Bell, Search, Filter, Calendar, Plus, Wallet, ShieldCheck, Lock,
  Fingerprint, CreditCard, TrendingUp, TrendingDown, PiggyBank, User, Home, List, PieChart,
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

export default function Analytics() {
  const ctx = useApp();
  const C = useTheme();
  const {
    screen, setScreen, history, setHistory, name, setName, darkMode, setDarkMode,
    biometricEnabled, setBiometricEnabled, twoFactorEnabled, setTwoFactorEnabled, toast, setToast, showToast, profileEmail,
    setProfileEmail, profilePhone, setProfilePhone, isEditingProfile, setIsEditingProfile, transactions, setTransactions, goals,
    setGoals, notifications, setNotifications, income, setIncome, currency, setCurrency, budgetCats,
    setBudgetCats, allocations, setAllocations, notifFilter, setNotifFilter, txFilter, setTxFilter, navigate,
    goToTab, goBack, totalIncome, setTotalIncome, totalAllocated, phone, setPhone,
    pin, setPin, showLoginPw, setShowLoginPw, rememberPassword, setRememberPassword, loginError, setLoginError,
    handleLogin, showPw, setShowPw, signupEmail, setSignupEmail, signupPhone, setSignupPhone, signupPassword,
    setSignupPassword, signupErrors, setSignupErrors, validatePassword, handleCreateAccount, clearErr, otp, setOtp,
    resendSeconds, setResendSeconds, currencies, budgetStep, setBudgetStep, incomeType, setIncomeType, customIncomeInputRef,
    steps, toggleCat, analyticsSpendingBreakdown, analyticsDonutGradient, emergency, unreadCount, expAmount, setExpAmount,
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

  // Real top spending category — spendingBreakdown (from AppContext) is
  // already sorted descending by amount, so the first entry is the real
  // top category. Was hardcoded to "Food" / "35%" regardless of actual
  // data. No fallback fabrication: when there's no spending yet, the card
  // is simply omitted rather than showing a fake category/percentage.
  const topCategory = analyticsSpendingBreakdown.length > 0 ? analyticsSpendingBreakdown[0] : null;
  const topCategoryMeta = topCategory ? (CATEGORY_META[topCategory.cat] || CATEGORY_META.Others) : null;

  // Real month-over-month comparison, computed directly from actual
  // transactions rather than the previous fixed "You spent 20% less this
  // month..." string. Sums real expense transactions for the selected
  // analytics month and for the month immediately before it.
  const monthExpenseTotal = (year, monthIdx) =>
    transactions
      .filter((t) => !t.type || t.type === "Expense")
      .filter((t) => {
        const d = new Date(t.date + "T00:00:00");
        return d.getFullYear() === year && d.getMonth() === monthIdx;
      })
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const prevMonthIndex = analyticsMonthIndex === 0 ? 11 : analyticsMonthIndex - 1;
  const prevMonthYear = analyticsMonthIndex === 0 ? analyticsYear - 1 : analyticsYear;
  const currentMonthSpend = monthExpenseTotal(analyticsYear, analyticsMonthIndex);
  const previousMonthSpend = monthExpenseTotal(prevMonthYear, prevMonthIndex);

  // No fabricated percentage when there's no real prior-month baseline to
  // compare against (previousMonthSpend === 0) — shown as a distinct,
  // honest message rather than a divide-by-zero or a made-up number.
  const pctChange =
    previousMonthSpend > 0
      ? Math.round(((currentMonthSpend - previousMonthSpend) / previousMonthSpend) * 100)
      : null;

  let insightText;
  let InsightIcon = TrendingUp;
  if (pctChange === null) {
    insightText = currentMonthSpend > 0
      ? "Not enough spending history yet to compare this month to the last."
      : "Log some expenses to start seeing month-over-month insights here.";
  } else if (pctChange < 0) {
    insightText = `You spent ${Math.abs(pctChange)}% less this month compared to last. Keep it up!`;
  } else if (pctChange > 0) {
    insightText = `You spent ${pctChange}% more this month compared to last.`;
    InsightIcon = TrendingDown;
  } else {
    insightText = "Your spending this month is about the same as last month.";
  }

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
        <div style={{ width: 100, height: 100, borderRadius: 50, background: analyticsDonutGradient, flexShrink: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 18, borderRadius: 32, background: C.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 9, color: C.textMuted }}>Total Spent</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: C.navy }}>{fmtNShort(currentMonthSpend)}</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {analyticsSpendingBreakdown.length === 0 ? (
            <div style={{ fontSize: 11, color: C.textMuted }}>No expenses logged for this month yet.</div>
          ) : (
            analyticsSpendingBreakdown.map((s) => (
              <div
                key={s.cat}
                onClick={() => { setTxFilter(s.cat); goToTab("transactions"); }}
                style={{ display: "flex", justifyContent: "space-between", fontSize: 11, cursor: "pointer" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.navy, fontWeight: 700 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: s.color, display: "inline-block" }} />{s.cat}</span>
                <span style={{ color: C.textMuted, fontWeight: 700 }}>{s.pct}%</span>
              </div>
            ))
          )}
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
      {/* Top Spending Category — real data from spendingBreakdown[0] (already
          sorted descending, see AppContext.jsx). Omitted entirely when
          there's no spending yet, rather than showing a fabricated
          category/percentage. */}
      {topCategory && (
        <div
          onClick={() => { setTxFilter(topCategory.cat); goToTab("transactions"); }}
          style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 12, marginBottom: 14, cursor: "pointer" }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <topCategoryMeta.icon size={18} color={C.green} />
          </div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, color: C.textMuted }}>Top Spending Category</div><div style={{ fontWeight: 800, color: C.navy }}>{topCategory.cat}</div></div>
          <div style={{ textAlign: "right" }}><b style={{ color: C.navy }}>{topCategory.pct}%</b></div>
        </div>
      )}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <InsightIcon size={22} color={C.green} />
        <div><div style={{ fontWeight: 800, color: C.navy, fontSize: 13 }}>Insight</div><div style={{ fontSize: 12, color: C.textMuted }}>{insightText}</div></div>
      </div>
    </Screen>
  );
}