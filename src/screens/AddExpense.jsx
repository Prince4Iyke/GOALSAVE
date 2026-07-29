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
import { fmtN, fmtNShort } from "../theme";
import { formatTime, toISODate } from "../utils";

// Colors pulled directly from the Figma spec
const GREEN = "#14AD4C";
const NAVY = "#070540";
const FONT = "'Roboto Condensed', sans-serif";

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
    handleSaveExpense, apiBusy,
  } = ctx;

  return (
    <Screen nav active="dashboard" onNavigate={goToTab}>
      <style>{`
    /* Hide scrollbars everywhere (desktop + mobile) while keeping scroll functional */
    html, body, * {
      scrollbar-width: none;      /* Firefox */
      -ms-overflow-style: none;   /* IE / old Edge */
    }
    *::-webkit-scrollbar {        /* Chrome, Safari, new Edge, mobile WebKit */
      display: none;
      width: 0;
      height: 0;
    }
  `}</style>
      <BackHeader title="Add Expenses" onBack={goBack} />

      {/* Amount */}
      <div
        style={{
          boxSizing: "border-box",
          padding: "1px 10px",
          borderRadius: 10,
          background: GREEN,
          border: `2px solid ${GREEN}`,
          marginBottom: 18,
        }}
      >
        <div style={{ fontFamily: FONT, color: "#fff", fontWeight: 600, fontSize: 23, letterSpacing: "-0.02em", padding: "8px 0 0" }}>
          Amount
        </div>
        <div style={{ border: "1px solid rgba(0,0,0,0.45)", margin: "8px 0" }} />
        <input
          value={expAmount}
          onChange={(e) => setExpAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="N0.00"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: 20,
            width: "100%",
            padding: "0 0 8px",
          }}
        />
      </div>

      {/* Category */}
      <h4 style={{ fontFamily: FONT, color: "#000", fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        Category
      </h4>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
        {addExpenseCats.map((c) => (
          <button
            key={c}
            onClick={() => setExpCat(c)}
            style={{
              boxSizing: "border-box",
              whiteSpace: "nowrap",
              padding: "10px",
              borderRadius: 5,
              border: `1px solid ${NAVY}`,
              background: expCat === c ? NAVY : "#fff",
              color: expCat === c ? "#fff" : "#000",
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: "-0.02em",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Account */}
      <div
        style={{
          boxSizing: "border-box",
          padding: 10,
          borderRadius: 10,
          background: GREEN,
          border: `2px solid ${GREEN}`,
          marginBottom: 18,
          position: "relative",
        }}
      >
        <div style={{ fontFamily: FONT, color: "#fff", fontWeight: 600, fontSize: 23, letterSpacing: "-0.02em" }}>
          Account
        </div>
        <div style={{ border: "1px solid rgba(0,0,0,0.45)", margin: "8px 0" }} />
        <div
          onClick={() => setShowAccountDropdown((s) => !s)}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "0 4px 0 4px" }}
        >
          <span style={{ fontFamily: FONT, color: "#fff", fontWeight: 400, fontSize: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <Wallet size={18} color="#fff" /> {expAccount}
          </span>
          <ChevronDown color="#fff" size={17} style={{ transform: showAccountDropdown ? "rotate(180deg)" : "none" }} />
        </div>
        {showAccountDropdown && (
          <>
            <div onClick={() => setShowAccountDropdown(false)} style={{ position: "fixed", inset: 0, zIndex: 55 }} />
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 4,
                right: 4,
                background: "#fff",
                border: "1px solid rgba(204,204,204,0.6)",
                borderRadius: 10,
                overflow: "hidden",
                zIndex: 60,
                boxShadow: "0 14px 30px -10px rgba(0,0,0,0.3)",
              }}
            >
              {["Main wallet", "Savings wallet"].map((acc) => (
                <div
                  key={acc}
                  onClick={() => { setExpAccount(acc); setShowAccountDropdown(false); }}
                  style={{
                    padding: "12px 14px",
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 400,
                    color: "#000",
                    background: acc === expAccount ? "rgba(20,173,76,0.12)" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {acc}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Date */}
      <h4 style={{ fontFamily: FONT, color: "#000", fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        Date
      </h4>
      <div
        style={{
          boxSizing: "border-box",
          alignItems: "center",
          padding: "10px 15px",
          borderRadius: 10,
          background: "#fff",
          border: "2px solid rgba(204,204,204,0.4)",
          marginBottom: 18,
        }}
      >
        <DatePickerField
          value={expDate}
          onChange={setExpDate}
          formatLongDate={formatLongDate}
          Style={{ fontFamily: FONT, fontWeight: 400, fontSize: 20, color: "#000", border: "none", background: "transparent" }}
        />
      </div>

      {/* Notes */}
      <h4 style={{ fontFamily: FONT, color: "#000", fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 9 }}>
        Notes (optional)
      </h4>
      <textarea
        value={expNote}
        onChange={(e) => setExpNote(e.target.value)}
        placeholder="e.g Lunch with friends"
        style={{
          boxSizing: "border-box",
          width: "100%",
          border: "2px solid rgba(204,204,204,0.4)",
          borderRadius: 10,
          padding: 10,
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 20,
          color: "rgba(0,0,0,0.85)",
          marginBottom: 20,
          minHeight: 61,
        }}
      />

      {/* Save / Next */}
      <button
        onClick={handleSaveExpense}
        disabled={apiBusy}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: "0 15px",
          height: 60,
          background: GREEN,
          borderRadius: 20,
          border: "none",
          cursor: apiBusy ? "default" : "pointer",
          opacity: apiBusy ? 0.7 : 1,
        }}
      >
        <span style={{ fontFamily: FONT, color: "#fff", fontWeight: 600, fontSize: 28, letterSpacing: "-0.02em", textAlign: "center" }}>
          {apiBusy ? "Saving..." : "Next"}
        </span>
      </button>
    </Screen>
  );
}