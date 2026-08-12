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
import { USE_MOCK_DATA } from "../api/client";

// Design tokens pulled from the Figma spec
const NAVY = "#070540";
const GREEN = "#14AD4C";
const GRAY = "#D9D9D9";
const FONT = "'Roboto Condensed', sans-serif";

export default function Transactions() {
  const ctx = useApp();
  const C = useTheme();
  const {
  screen,setScreen,history,setHistory,name,setName,darkMode,setDarkMode,biometricEnabled,setBiometricEnabled,twoFactorEnabled,setTwoFactorEnabled,
  toast,setToast,showToast,profileEmail,setProfileEmail,profilePhone,setProfilePhone,isEditingProfile,setIsEditingProfile,transactions,
  setTransactions,goals,setGoals,notifications,setNotifications,income,setIncome,currency,setCurrency,budgetCats,setBudgetCats,
  allocations,setAllocations,notifFilter,setNotifFilter,txFilter,setTxFilter,navigate,goToTab,goBack,totalIncome, setTotalIncome,
  totalExpenses,totalAllocated,totalRemaining,phone,setPhone,pin,setPin,showLoginPw,setShowLoginPw,rememberPassword,setRememberPassword,
  loginError,setLoginError,handleLogin,showPw,setShowPw,signupEmail,setSignupEmail,signupPhone,setSignupPhone,signupPassword,
  setSignupPassword,signupErrors,setSignupErrors,validatePassword,handleCreateAccount,clearErr,otp,setOtp,resendSeconds,
  setResendSeconds,currencies,budgetStep,setBudgetStep,incomeType,setIncomeType,customIncomeInputRef,steps,toggleCat,spendingBreakdown,donutGradient,emergency,
  unreadCount,expAmount,setExpAmount,expAccount,setExpAccount,showAccountDropdown,setShowAccountDropdown,expCat,setExpCat,
  expNote,setExpNote,expDate,setExpDate,ordinal,formatLongDate,formatShortGroupDate,addExpenseCats,incAmount,setIncAmount,
  incSource,setIncSource,incNote,setIncNote,incDate,setIncDate,incomeSources,txSearch,setTxSearch,txSortNewest,setTxSortNewest,
  searchedTx,catFilteredTx,filteredTx,grouped,dailyBudget,spentToday,weeklyBudget,spentThisWeek,weeklySpendTrend,monthlyTrend,
  weeklyTrend,
  monthWeekLabels,
  dayLabels,
  monthNamesShort,
  monthNamesFull,
  analyticsPeriod,
  setAnalyticsPeriod,
  analyticsMonthIndex,
  setAnalyticsMonthIndex,
  analyticsYear,
  setAnalyticsYear,
  showMonthPicker,
  setShowMonthPicker,
  activeTrend,
  activeLabels,
  goToPrevMonth,
  goToNextMonth,
  contribAmount,
  setContribAmount,
  contributionHistory,
  setContributionHistory,
  showAllHistory,
  setShowAllHistory,
  showAddGoal,
  setShowAddGoal,
  newGoalName,
  setNewGoalName,
  newGoalTarget,
  setNewGoalTarget,
  expandedGoalId,
  setExpandedGoalId,
  otherContribAmount,
  setOtherContribAmount,
  others,
  addContribution,
  filteredNotifs,
  notifGrouped,
  categories,
} = ctx;

  const remainingDailyBudget = Math.max(
  0,
  dailyBudget - spentToday
);

const remainingPct =dailyBudget > 0 ? Math.max(0,Math.min(100, Math.round((remainingDailyBudget / dailyBudget) * 100))) : 0;

  // Mock mode keeps the original fixed demo chip list. Live mode builds
  // chips from the user's real categories (both Income and Expense — a
  // transaction's own `type` field decides Income vs Expense, not the
  // category; see transaction.model.js/validator), so any category
  // actually created via handleCreateCategory shows up here instead of
  // only ever matching "Others".
  const categoryChipOptions = USE_MOCK_DATA
    ? ["All", "Food", "Transportation", "Bills", "Entertainment", "Shopping", "More"]
    : ["All", ...Array.from(new Set((categories || []).map((c) => c.name).filter(Boolean)))];

  // Bars for the weekly card, scaled against the largest of the 4 weeks
  // (current week + 3 prior) so the tallest bar always fills the card,
  // same visual language as the old hardcoded [53, 72, 53, 96] array —
  // just driven by real spend now.
  const maxWeek = Math.max(...weeklySpendTrend, 1);
  const barHeights = weeklySpendTrend.map((v) => Math.max(6, Math.round((v / maxWeek) * 96)));

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
        {categoryChipOptions.map((c) => (
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
      <div
        style={{
          background: NAVY,
          borderRadius: 10,
          padding: "10px 20px",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: 18,
            lineHeight: "22px",
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          Remaining Daily Budget
        </div>

        <div
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 19,
            lineHeight: "23px",
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {fmtNShort(remainingDailyBudget)} of{" "}
          {fmtNShort(dailyBudget)}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 25,
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              height: 10,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 4,
                left: 0,
                right: 0,
                height: 2,
                background: GRAY,
                borderRadius: 2,
              }}
            />

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

          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: 18,
              lineHeight: "22px",
              color: "#FFFFFF",
            }}
          >
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
              const meta =
                CATEGORY_META[t.cat] || CATEGORY_META.Others;

              const isLast = i === items.length - 1;
              const isIncome = t.type === "Income";

              return (
                <div key={t.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      paddingLeft: 10,
                    }}
                  >
                    {/* Category icon */}
                    < div
                      style={{
                        width: 31,
                        height: 33,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <meta.icon size={20} color="#FFFFFF" />
                    </div>

                    {/* Transaction information */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: FONT,
                          fontWeight: 400,
                          fontSize: 20,
                          letterSpacing: "0.02em",
                          color: "#FFFFFF",
                        }}
                      >
                        {t.cat} - {t.name}
                      </div>

                      <div
                        style={{
                          fontFamily: FONT,
                          fontWeight: 400,
                          fontSize: 13,
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {t.place}
                      </div>
                    </div>

                    {/* Amount + time */}
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: FONT,
                          fontWeight: 400,
                          fontSize: 20,
                          lineHeight: "24px",
                          color: isIncome ? "#5CE187" : "#FFFFFF",
                        }}
                      >
                        {isIncome ? "+" : "-"}
                        {fmtNShort(t.amount)}
                      </div>

                      <div
                        style={{
                          fontFamily: FONT,
                          fontWeight: 400,
                          fontSize: 12,
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {t.time}
                      </div>
                    </div>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => {
                        console.log(
                          "EDIT TRANSACTION CLICKED:",
                          t
                        );

                        const transactionId =
                          t.id || t._id;

                        if (!transactionId) {
                          console.error(
                            "Transaction ID missing:",
                            t
                          );

                          reportApiError(
                            null,
                            "Transaction ID is missing."
                          );

                          return;
                        }

                        navigate("editTransaction", {
                          transaction: t,
                        });
                      }}
                      style={{
                        width: 36,
                        height: 36,
                        border: "none",
                        borderRadius: 8,
                        background: "transparent",
                        color: "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      ⋮
                    </button>
                  </div>

                  {!isLast && (
                    <div
                      style={{
                        borderBottom:
                          "1px solid #FFFFFF",
                        marginTop: 12,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* This week card — real figures: spentThisWeek/weeklyBudget/weeklySpendTrend
          all come from AppContext, derived from real transactions + real budget
          totals (see comments there). Replaces the old hardcoded
          totalExpenses / 75000 / [53,72,53,96]. */}
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
            Spent {fmtNShort(spentThisWeek)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 18, lineHeight: "22px", color: "#000000" }}>
            Budget {weeklyBudget > 0 ? fmtNShort(weeklyBudget) : "Not set"}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
            {barHeights.map((h, idx) => (
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