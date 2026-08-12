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
import { USE_MOCK_DATA } from "../api/client";

// See AddExpense.jsx for the same helpers — kept in sync here.
// TODO: confirm actual GET /wallets and GET /categories response field
// names (assumed `_id`/`name`, Mongoose defaults) and simplify once known.
const itemId = (item) => item?._id ?? item?.id ?? "";
const itemLabel = (item) => item?.name ?? item?.label ?? item?.title ?? "Unnamed";

export default function AddIncome() {
  const ctx = useApp();
  const C = useTheme();
  const {
    screen, screenData, setScreen, history, setHistory, name, setName, darkMode, setDarkMode,
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
    incSource, setIncSource, incAccount, setIncAccount, incCat, setIncCat, incNote, setIncNote, incDate, setIncDate, incomeSources, txSearch,
    setTxSearch, txSortNewest, setTxSortNewest, searchedTx, catFilteredTx, filteredTx, grouped, dailyBudget,
    spentToday, monthlyTrend, weeklyTrend, monthWeekLabels, dayLabels, monthNamesShort, monthNamesFull, analyticsPeriod,
    setAnalyticsPeriod, analyticsMonthIndex, setAnalyticsMonthIndex, analyticsYear, setAnalyticsYear, showMonthPicker, setShowMonthPicker, activeTrend,
    activeLabels, goToPrevMonth, goToNextMonth, contribAmount, setContribAmount, contributionHistory, setContributionHistory, showAllHistory,
    setShowAllHistory, showAddGoal, setShowAddGoal, newGoalName, setNewGoalName, newGoalTarget, setNewGoalTarget, expandedGoalId,
    setExpandedGoalId, otherContribAmount, setOtherContribAmount, others, addContribution, filteredNotifs, notifGrouped,
    handleSaveIncome, apiBusy,
    wallets, categories,
  } = ctx;

  const isSavingsContribution =
  screenData?.type === "savingsContribution";

  const [showWalletDropdown, setShowWalletDropdown] = React.useState(false);

  // Categories are scoped by type (category.validator.js requires
  // type: "Income" | "Expense" on creation) — only show Income categories
  // here so a user can't file income under an Expense-only category.
  const categoryOptions = USE_MOCK_DATA
    ? [] // mock mode never sent a category for income before either — nothing to pick
    : categories.filter((c) => c?.type === "Income").map((c) => ({ id: itemId(c), label: itemLabel(c) }));

  const walletOptions = USE_MOCK_DATA
    ? [{ id: "Main wallet", label: "Main wallet" }]
    : wallets.map((w) => ({ id: itemId(w), label: itemLabel(w) }));

  const selectedWalletLabel = walletOptions.find((w) => w.id === incAccount)?.label || "Select a wallet";

  // Mock mode keeps a wallet pre-selected (there's only ever been one),
  // so the demo flow behaves the same as before without user action.
  React.useEffect(() => {
    if (USE_MOCK_DATA && !incAccount) setIncAccount("Main wallet");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen nav active="dashboard" onNavigate={goToTab}>
      <BackHeader title="Add Income" onBack={goBack} />
      <div style={{ borderRadius: 16, padding: 16, background: CARD_GRADIENT, marginBottom: 18 }}>
        <div style={{ color: "rgba(255,255,255,0.85)", fontWeight: 800, fontSize: 13 }}>Amount</div>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.4)", margin: "10px 0" }} />
        <input value={incAmount} onChange={(e) => setIncAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 20, fontWeight: 800, width: "100%" }} />
      </div>
      <h4 style={{ color: C.navy, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Source</h4>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
        {incomeSources.map((s) => (
          <button key={s} onClick={() => setIncSource(s)} style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${incSource === s ? C.green : C.border}`, background: incSource === s ? C.greenLight : C.card, color: C.navy, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>{s}</button>
        ))}
      </div>

      {/* Category — the backend requires one for every transaction, income
          included, even though the old UI never asked for it here. */}
      {!USE_MOCK_DATA && (
        <>
          <h4 style={{ color: C.navy, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Category</h4>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
            {categoryOptions.length === 0 && (
              <span style={{ fontSize: 12.5, color: "rgba(0,0,0,0.5)" }}>No categories yet — add one in Budget first.</span>
            )}
            {categoryOptions
              .filter((c) => {
                if (!isSavingsContribution) return true;

                return c.label.toLowerCase() === "savings";
              })
              .map((c) => (
              <button key={c.id} onClick={() => setIncCat(c.id)} style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${incCat === c.id ? C.green : C.border}`, background: incCat === c.id ? C.greenLight : C.card, color: C.navy, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>{c.label}</button>
            ))}
            <button onClick={() => navigate("addCategory")} style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 10, border: `1.5px dashed ${C.navy}`, background: C.card, color: C.navy, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>+ Add</button>
          </div>
        </>
      )}

      <div style={{ borderRadius: 16, padding: 16, background: CARD_GRADIENT, marginBottom: 18, position: "relative" }}>
        <div style={{ color: "rgba(255,255,255,0.85)", fontWeight: 800, fontSize: 13 }}>Deposit To</div>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.4)", margin: "10px 0" }} />
        {USE_MOCK_DATA ? (
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Wallet size={16} /> Main wallet
          </span>
        ) : (
          <div
            onClick={() => setShowWalletDropdown((s) => !s)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
          >
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Wallet size={16} /> {selectedWalletLabel}
            </span>
            <ChevronDown color="#fff" size={16} style={{ transform: showWalletDropdown ? "rotate(180deg)" : "none" }} />
          </div>
        )}
        {!USE_MOCK_DATA && showWalletDropdown && (
          <>
            <div onClick={() => setShowWalletDropdown(false)} style={{ position: "fixed", inset: 0, zIndex: 55 }} />
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
              {walletOptions.length === 0 && (
                <div style={{ padding: "12px 14px", fontSize: 13, color: "rgba(0,0,0,0.5)" }}>No wallets yet.</div>
              )}
              <div
                onClick={() => { setShowWalletDropdown(false); navigate("addWallet"); }}
                style={{
                  padding: "12px 14px",
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: C.green,
                  borderTop: walletOptions.length > 0 ? `1px solid ${C.border}` : "none",
                  cursor: "pointer",
                }}
              >
                + Add new wallet
              </div>
              {walletOptions.map((w) => (
                <div
                  key={w.id}
                  onClick={() => { setIncAccount(w.id); setShowWalletDropdown(false); }}
                  style={{
                    padding: "12px 14px",
                    fontSize: 13.5,
                    color: "#000",
                    background: w.id === incAccount ? "rgba(20,173,76,0.12)" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  {w.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <h4 style={{ color: C.navy, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Date</h4>
      <div style={{ marginBottom: 18 }}>
        <DatePickerField value={incDate} onChange={setIncDate} formatLongDate={formatLongDate} />
      </div>
      <h4 style={{ color: C.navy, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Notes (optional)</h4>
      <textarea value={incNote} onChange={(e) => setIncNote(e.target.value)} placeholder="e.g May salary" style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, fontSize: 13.5, marginBottom: 20, minHeight: 60, fontFamily: "inherit" }} />
      <PrimaryButton onClick={handleSaveIncome} disabled={apiBusy}>
        {apiBusy ? "Saving..." : "Save Income"}
      </PrimaryButton>
    </Screen>
  );
}