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

// Design tokens pulled from the Figma spec
const GREEN = "#14AD4C";
const FONT = "'Roboto Condensed', sans-serif";

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
    handleMarkNotificationRead, handleMarkAllNotificationsRead,
  } = ctx;

  return (
    <Screen nav active="profile" onNavigate={goToTab}>
      <BackHeader
        title="Notification"
        onBack={goBack}
        right={<div onClick={() => showToast("Help Center isn't available in this demo yet.")} style={{ cursor: "pointer", display: "flex" }}><HelpCircle size={17} color={C.navy} /></div>}
      />

      {/* Filter pills — matches Frame 1171275390 spacing/sizing from spec.
          "Security" was removed: there's no backend data source for it at
          all (SecurityAPI is unbuilt, same as NotificationsAPI), so keeping
          the pill visible would imply monitoring that doesn't exist.
          "Transactions" was added: every real transaction (income and
          expense) now generates a notification entry (see AppContext.jsx's
          generatedNotifications) so people can see their activity feed on
          this screen, not just alerts/bills/goals. */}
      <div className="hide-scrollbar" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "10px 0", marginBottom: 10, overflowX: "auto" }}>
        {["All", "Alerts", "Transactions", "Bills", "Goals"].map((c) => (
          <button
            key={c}
            onClick={() => setNotifFilter(c)}
            style={{
              whiteSpace: "nowrap",
              padding: "10px 14px",
              borderRadius: 5,
              border: `1px solid ${notifFilter === c ? GREEN : "#000000"}`,
              background: notifFilter === c ? GREEN : "#FFFFFF",
              color: notifFilter === c ? "#FFFFFF" : "#000000",
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "19px",
              letterSpacing: "-0.02em",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* "Today" label + mark-all-as-read row.
          Was: notifications.some((n) => n.unread) — `notifications` is the
          raw context state, only meaningful in mock mode. In live mode the
          real list is activeNotifications (generated or real backend data),
          already reflected in unreadCount. */}
      {unreadCount > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 20, lineHeight: "24px", color: "#000000" }}>
            Today
          </span>
          <span
            onClick={handleMarkAllNotificationsRead}
            style={{ fontFamily: FONT, fontWeight: 400, fontSize: 16, lineHeight: "24px", color: GREEN, cursor: "pointer" }}
          >
            Mark all as read
          </span>
        </div>
      )}

      {Object.keys(notifGrouped).length === 0 && (
        <div style={{ textAlign: "center", color: "#8A8A8A", fontFamily: FONT, fontSize: 13, padding: "24px 0" }}>
          Nothing here yet.
        </div>
      )}

      {Object.entries(notifGrouped).map(([group, items]) => (
        <div key={group} style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 400, lineHeight: "24px", color: "#000000", marginBottom: 8 }}>
            {group}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  handleMarkNotificationRead(n.id);
                  // Was: hardcoded setTxFilter("Food") for every "Alerts"
                  // notification, regardless of what the alert was actually
                  // about (a Bills overspend alert would still filter
                  // transactions to Food). Now uses the notification's own
                  // relatedCategory — set from the real budget/transaction
                  // category it was generated from (see AppContext.jsx's
                  // generatedNotifications) — falling back to showing all
                  // transactions if a notification has no specific category.
                  if (n.cat === "Alerts") {
                    if (n.relatedCategory) setTxFilter(n.relatedCategory);
                    else setTxFilter("All");
                    goToTab("transactions");
                  }
                  else if (n.cat === "Transactions") {
                    setTxFilter(n.relatedCategory || "All");
                    goToTab("transactions");
                  }
                  else if (n.cat === "Bills") { setTxFilter("Bills"); goToTab("transactions"); }
                  else if (n.cat === "Goals") { goToTab("goals"); }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 8px",
                  background: "#FFFFFF",
                  border: `1px solid ${GREEN}`,
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(217,217,217,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {(() => {
  const NIcon = n.icon || Bell;
  return <NIcon size={19} color={GREEN} />;
})()}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 19, lineHeight: "23px", letterSpacing: "-0.02em", color: "#000000" }}>
                    {n.type}
                  </span>
                  <p style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: "18px", color: "#000000", margin: "4px 0 0" }}>
                    {n.body}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 16, lineHeight: "19px", letterSpacing: "-0.02em", color: "#000000" }}>
                    {n.when}
                  </span>
                  {n.unread && <div style={{ width: 10, height: 10, borderRadius: 5, background: GREEN }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
        onClick={() => navigate("securityCenter")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "12px 8px",
          background: "#FFFFFF",
          border: `1px solid ${GREEN}`,
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(217,217,217,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Bell size={19} color={GREEN} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 19, lineHeight: "23px", letterSpacing: "-0.02em", color: "#000000" }}>
            Notification settings
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: "18px", color: "#000000", marginTop: 4 }}>
            Manage how and when you receive notification
          </div>
        </div>
        <ChevronRight size={16} color="#000000" />
      </div>
    </Screen>
  );
}
