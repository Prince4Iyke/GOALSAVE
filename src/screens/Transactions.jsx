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

// Design tokens pulled from the Figma spec
const NAVY = "#070540";
const GREEN = "#14AD4C";
const GRAY = "#D9D9D9";
const FONT = "'Roboto Condensed', sans-serif";

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

  const remainingPct = Math.max(0, Math.round((1 - spentToday / dailyBudget) * 100));

  return (
    <Screen nav active="transactions" onNavigate={goToTab} style={{ fontFamily: FONT, background: "#FFFFFF", borderRadius: 8 }}>
      <style>{`
        html, body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;     /* Firefox */
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;             /* Chrome, Safari, Opera (desktop + mobile) */
          width: 0;
          height: 0;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        *::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
      <BackHeader
        title="Expenses"
        onBack={() => goToTab("dashboard")}
        right={
          <div onClick={() => { setTxSortNewest((s) => !s); showToast(txSortNewest ? "Sorted by highest amount." : "Sorted by newest first."); }} style={{ cursor: "pointer", display: "flex" }}>
            <Filter size={17} color={txSortNewest ? NAVY : GREEN} />
          </div>
        }
      />

      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 19,
          background: GRAY,
          borderRadius: 10,
          padding: "10px 18px",
          marginBottom: 14,
        }}
      >
        <Search size={20} color="rgba(0,0,0,0.45)" />
        <input
          value={txSearch}
          onChange={(e) => setTxSearch(e.target.value)}
          placeholder="Search transactions"
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: 20,
            lineHeight: "24px",
            color: "rgba(0,0,0,0.45)",
            background: "transparent",
          }}
        />
      </div>

      {/* Category filter chips */}
      <div className="hide-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
        {["All", "Food", "Transportation", "Bills", "Entertainment", "Shopping", "More"].map((c) => (
          <button
            key={c}
            onClick={() => setTxFilter(c)}
            style={{
              whiteSpace: "nowrap",
              padding: "10px",
              borderRadius: 5,
              border: `1px solid ${NAVY}`,
              background: txFilter === c ? NAVY : "#FFFFFF",
              color: txFilter === c ? "#FFFFFF" : "#000000",
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

      {/* Remaining daily budget card */}
      <div style={{ background: NAVY, borderRadius: 10, padding: "10px 20px", marginBottom: 18 }}>
        <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 18, lineHeight: "22px", color: "#FFFFFF", textAlign: "center", marginBottom: 4 }}>
          Remaining Daily Budget
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 19, lineHeight: "23px", letterSpacing: "-0.02em", color: "#FFFFFF", textAlign: "center", marginBottom: 10 }}>
          {fmtNShort(Math.max(0, dailyBudget - spentToday))} of {fmtNShort(dailyBudget)}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 25 }}>
          <div style={{ position: "relative", flex: 1, height: 10 }}>
            <div style={{ position: "absolute", top: 4, left: 0, right: 0, height: 2, background: GRAY, borderRadius: 2 }} />
            <div
              style={{
                position: "absolute",
                top: 4,
                left: 0,
                width: `${remainingPct}%`,
                height: 2,
                background: GREEN,
                borderRadius: 2,
              }}
            />
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 18, lineHeight: "22px", color: "#FFFFFF" }}>
            {remainingPct}%
          </span>
        </div>
      </div>

      {Object.keys(grouped).length === 0 && (
        <div style={{ textAlign: "center", color: "#8A8A8A", fontFamily: FONT, fontSize: 13, padding: "24px 0" }}>
          No transactions match your search.
        </div>
      )}

      {/* Spending list */}
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group} style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 20, lineHeight: "24px", color: "#000000", marginBottom: 10 }}>
            {group}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: NAVY,
              borderRadius: 10,
              padding: "10px 25px 10px 15px",
              gap: 21,
            }}
          >
            {items.map((t, i) => {
              const meta = CATEGORY_META[t.cat] || CATEGORY_META.Others;
              const isLast = i === items.length - 1;
              return (
                <div key={t.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 25, paddingLeft: 10 }}>
                    <div style={{ width: 31, height: 33, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <meta.icon size={20} color="#FFFFFF" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 20, letterSpacing: "0.02em", color: "#FFFFFF" }}>
                        {t.cat} - {t.name}
                      </div>
                      <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                        {t.place}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 20, lineHeight: "24px", color: "#FFFFFF" }}>
                        {fmtNShort(t.amount)}
                      </div>
                      <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                        {t.time}
                      </div>
                    </div>
                  </div>
                  {!isLast && <div style={{ borderBottom: "1px solid #FFFFFF", marginTop: 12 }} />}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* This week card */}
      <div
        style={{
          position: "relative",
          border: `2px solid ${GRAY}`,
          borderRadius: 10,
          padding: "12px 15px",
          minHeight: 143,
          marginBottom: 12,
        }}
      >
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 19, letterSpacing: "-0.02em", color: "#000000", marginBottom: 12 }}>
          This week
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 18, lineHeight: "22px", color: "#000000" }}>
            Spent {fmtNShort(totalExpenses)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 18, lineHeight: "22px", color: "#000000" }}>
            Budget {fmtNShort(75000)}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
            {[53, 72, 53, 96].map((h, idx) => (
              <div
                key={idx}
                style={{
                  width: 24,
                  height: h,
                  background: GRAY,
                  border: `2px solid ${GREEN}`,
                  borderRadius: "5px 5px 0 0",
                  boxSizing: "border-box",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("addExpense")}
        style={{
          position: "absolute",
          bottom: 90,
          right: 26,
          width: 46,
          height: 43,
          borderRadius: 100,
          background: GREEN,
          border: "2px solid #FFFFFF",
          color: "#fff",
          boxShadow: "0 10px 20px -6px rgba(21,154,72,0.6)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plus size={22} />
      </button>
    </Screen>
  );
}