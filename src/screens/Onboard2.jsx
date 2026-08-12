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
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(180deg, ${C.card} 0%, ${C.card} 70%, #FAFBFC 100%)`,
        padding: "40px 22px 26px",
        overflowY: "auto",
      }}
    >
     <BackHeader style={{ margin: "10px auto 2px" }} title="" onBack={goBack} />

<div
  style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20, // small, safe offset instead of -100
  }}
>
        <h2
          style={{
            textAlign: "center",
            color: C.navy,
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: "-0.3px",
            margin: "-30px auto 2px"
          }}
        >
          All your finances
          <br />
          in one place
        </h2>

        <p
          style={{
            textAlign: "center",
            color: C.textMuted,
            fontSize: 13.5,
            lineHeight: 1.5,
            marginTop: 8,
            marginBottom: 26,
            maxWidth: 260,
          }}
        >
          Track expenses, create budgets, save for goals and more.
        </p>

        {/* Preview card */}
<div
  style={{
    width: "100%",
    borderRadius: 20,
    border: `1px solid ${C.border}`,
    padding: 20,
    background: `linear-gradient(160deg, ${C.card} 0%, #FCFDFD 100%)`,
    boxShadow:
      "0 18px 40px -18px rgba(16,27,61,0.28), 0 4px 10px -4px rgba(16,27,61,0.08)",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  }}
>
  {/* subtle decorative glow */}
  <div
    style={{
      position: "absolute",
      top: -60,
      right: -60,
      width: 140,
      height: 140,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${C.green}22 0%, transparent 70%)`,
      pointerEvents: "none",
    }}
  />

  <div
    style={{
      fontSize: 11,
      color: C.textMuted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    }}
  >
    Total Balance
  </div>

  <div
    style={{
      fontSize: 24,
      fontWeight: 800,
      color: C.navy,
      margin: "6px 0 14px",
      letterSpacing: "-0.4px",
    }}
  >
    {fmtNShort(128450)}
  </div>

  {/* Linear graph replacing bar chart */}
  <div style={{ height: 46, position: "relative" }}>
    <svg
      viewBox="0 0 280 46"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.green} stopOpacity="0.28" />
          <stop offset="100%" stopColor={C.green} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill under the line */}
      <path
        d="M0,32 L40,20 L80,28 L120,10 L160,22 L200,6 L240,16 L280,4 L280,46 L0,46 Z"
        fill="url(#lineFill)"
      />

      {/* The line itself */}
      <path
        d="M0,32 L40,20 L80,28 L120,10 L160,22 L200,6 L240,16 L280,4"
        fill="none"
        stroke={C.green}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Highlighted end point */}
      <circle cx="280" cy="4" r="4" fill={C.card} stroke={C.green} strokeWidth="2.5" />
    </svg>
  </div>

  <div
    style={{
      marginTop: 16,
      height: 8,
      borderRadius: 6,
      background: "linear-gradient(90deg, #F1F1F1 0%, #E9E9E9 100%)",
    }}
  />
  <div
    style={{
      marginTop: 8,
      height: 8,
      width: "70%",
      borderRadius: 6,
      background: "linear-gradient(90deg, #F1F1F1 0%, #ECECEC 100%)",
    }}
  />
</div>

        {/* Pagination dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: i === 0 ? 20 : 6,
                height: 6,
                borderRadius: 4,
                background: i === 0 ? C.navy : "#D8D8D8",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>

        <PrimaryButton
          style={{
            marginTop: 32, fontsize: 45,
            boxShadow: `0 12px 24px -10px ${C.navy}55`,
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            width: 350,
          }}
          onClick={() => navigate("login")}
        >
          Next
        </PrimaryButton>
      </div>
    </div>
  );
}