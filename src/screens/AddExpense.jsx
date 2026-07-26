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
import { formatTime, toISODate } from "../utils";

export default function AddExpense() {
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
    <Screen nav active="dashboard" onNavigate={goToTab}>
      <BackHeader title="Add Expenses" onBack={goBack} />
      <div style={{ borderRadius: 16, padding: 16, background: CARD_GRADIENT, marginBottom: 18 }}>
        <div style={{ color: "rgba(255,255,255,0.85)", fontWeight: 800, fontSize: 13 }}>Amount</div>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.4)", margin: "10px 0" }} />
        <input value={expAmount} onChange={(e) => setExpAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 20, fontWeight: 800, width: "100%" }} />
      </div>
      <h4 style={{ color: C.navy, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Category</h4>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
        {addExpenseCats.map((c) => (
          <button key={c} onClick={() => setExpCat(c)} style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${expCat === c ? C.green : C.border}`, background: expCat === c ? C.greenLight : C.card, color: C.navy, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <div style={{ borderRadius: 16, padding: 16, background: CARD_GRADIENT, marginBottom: 18, position: "relative" }}>
        <div style={{ color: "rgba(255,255,255,0.85)", fontWeight: 800, fontSize: 13 }}>Account</div>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.4)", margin: "10px 0" }} />
        <div onClick={() => setShowAccountDropdown((s) => !s)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}><Wallet size={16} /> {expAccount}</span>
          <ChevronDown color="#fff" size={17} style={{ transform: showAccountDropdown ? "rotate(180deg)" : "none" }} />
        </div>
        {showAccountDropdown && (
          <>
            <div onClick={() => setShowAccountDropdown(false)} style={{ position: "fixed", inset: 0, zIndex: 55 }} />
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 16, right: 16, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", zIndex: 60, boxShadow: "0 14px 30px -10px rgba(0,0,0,0.3)" }}>
              {["Main wallet", "Savings wallet"].map((acc) => (
                <div
                  key={acc}
                  onClick={() => { setExpAccount(acc); setShowAccountDropdown(false); }}
                  style={{ padding: "12px 14px", fontSize: 13.5, fontWeight: 600, color: C.navy, background: acc === expAccount ? C.greenLight : "transparent", cursor: "pointer" }}
                >
                  {acc}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <h4 style={{ color: C.navy, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Date</h4>
      <div style={{ marginBottom: 18 }}>
        <DatePickerField value={expDate} onChange={setExpDate} formatLongDate={formatLongDate} />
      </div>
      <h4 style={{ color: C.navy, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Notes (optional)</h4>
      <textarea value={expNote} onChange={(e) => setExpNote(e.target.value)} placeholder="e.g Lunch with friends" style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, fontSize: 13.5, marginBottom: 20, minHeight: 60, fontFamily: "inherit" }} />
      <PrimaryButton
        onClick={() => {
          if (!expAmount) return;
          const todayISOStr = toISODate(new Date());
          const yestDateObj = new Date();
          yestDateObj.setDate(yestDateObj.getDate() - 1);
          const yestISOStr = toISODate(yestDateObj);
          const groupLabel =
            expDate === todayISOStr ? `Today, ${formatShortGroupDate(expDate)}` :
            expDate === yestISOStr ? `Yesterday, ${formatShortGroupDate(expDate)}` :
            formatShortGroupDate(expDate);
          setTransactions((t) => [{ id: Date.now(), cat: expCat === "All" ? "Others" : expCat, name: expNote || expCat, place: expCat, amount: Number(expAmount), date: expDate, time: formatTime(new Date()), group: groupLabel }, ...t]);
          setExpAmount(""); setExpNote("");
          goToTab("transactions");
        }}
      >
        Save Expenses
      </PrimaryButton>
    </Screen>
  );
}
