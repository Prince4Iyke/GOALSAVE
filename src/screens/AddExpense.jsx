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
import { USE_MOCK_DATA } from "../api/client";

// Colors pulled directly from the Figma spec
const GREEN = "#14AD4C";
const NAVY = "#070540";
const FONT = "'Roboto Condensed', sans-serif";

// Backend Wallet/Category documents are expected to look like
// { _id: "<24-char hex>", name: "Main wallet" } — Mongoose's default id
// field is `_id`, not `id`. These helpers fall back to a few likely field
// names (`name`/`label`/`title`, `_id`/`id`) so the UI doesn't break if the
// real response shape turns out slightly different — but TODO: confirm the
// actual GET /wallets and GET /categories response shape against this once
// you can hit them, and simplify these to the real field names.
const itemId = (item) => item?._id ?? item?.id ?? "";
const itemLabel = (item) => item?.name ?? item?.label ?? item?.title ?? "Unnamed";

export default function AddExpense() {
  const ctx = useApp();
  console.log("ADD EXPENSE CATEGORIES:", ctx.categories);
  console.log("ADD EXPENSE CATEGORY LENGTH:", ctx.categories?.length);
  console.log("ADD EXPENSE CATEGORY DATA:", JSON.stringify(ctx.categories));

  console.log("ADD EXPENSE WALLETS:", ctx.wallets);
  console.log("ADD EXPENSE WALLET LENGTH:", ctx.wallets?.length);
  console.log(
    "ADD EXPENSE WALLET DATA:",
    JSON.stringify(ctx.wallets, null, 2)
  );

  console.log("ADD EXPENSE CONTEXT:", {
    wallets: ctx.wallets,
    categories: ctx.categories,
  }
);
  const isSavingsContribution =
  ctx.screenData?.type === "savingsContribution";

const selectedGoal =
  ctx.screenData?.goal || null;


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
    wallets, categories,
  } = ctx;

  // Mock mode keeps the original hardcoded string lists so the demo/seed
  // flow is untouched. Real mode uses actual wallet/category documents
  // fetched from the backend, keyed by their real _id.
  // Categories are scoped by type (category.validator.js requires
  // type: "Income" | "Expense" on creation) — only show Expense categories
  // here so a user can't accidentally file an expense under an Income-only
  // category the backend would reject.
  const categoryOptions = USE_MOCK_DATA
    ? addExpenseCats.filter((c) => c !== "All").map((c) => ({ id: c, label: c }))
    : categories.filter((c) => c?.type === "Expense").map((c) => ({ id: itemId(c), label: itemLabel(c) }));

    React.useEffect(() => {
      console.log("categoryOptions =", JSON.stringify(categoryOptions, null, 2));
      console.log("Selected category =", expCat);
    }, [categoryOptions, expCat]);

    React.useEffect(() => {
      if (!isSavingsContribution) return;



  const savingsCategory = categoryOptions.find(
    (c) => c.label.toLowerCase() === "savings"
  );

  if (savingsCategory) {
    setExpCat(savingsCategory.id);
  }
}, [isSavingsContribution, categoryOptions, setExpCat]);

  const walletOptions = USE_MOCK_DATA
    ? ["Main wallet", "Savings wallet"].map((w) => ({ id: w, label: w }))
    : wallets.map((w) => ({ id: itemId(w), label: itemLabel(w) }));

    React.useEffect(() => {
  if (!isSavingsContribution) return;
  if (expAccount) return;
  if (walletOptions.length === 0) return;

  setExpAccount(walletOptions[0].id);
}, [
  isSavingsContribution,
  expAccount,
  walletOptions,
  setExpAccount,
]);

    console.log("WALLET OPTIONS:", walletOptions);

  
  React.useEffect(() => {
    console.log("screenData =", ctx.screenData);
    console.log("expAmount =", expAmount);

  if (
    isSavingsContribution &&
    ctx.screenData?.amount &&
    !expAmount
  ) {
    console.log("Setting amount:", ctx.screenData.amount);

    setExpAmount(String(ctx.screenData.amount));
  }
}, [
  isSavingsContribution,
  ctx.screenData?.amount,
  expAmount,
  setExpAmount,
]);


  const selectedWalletLabel = walletOptions.find((w) => w.id === expAccount)?.label || "Select a wallet";

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
          {isSavingsContribution ? "Contribution Amount" : "Amount"}
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
            cursor: "text",
            opacity: 1,
          }}
        />
      </div>

      {/* Category */}
      {!isSavingsContribution && (
        <>
          <h4
            style={{
              fontFamily: FONT,
              color: "#000",
              fontSize: 23,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Category
          </h4>
      <h4 style={{ fontFamily: FONT, color: "#000", fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        Category
      </h4>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", marginBottom: 18, paddingBottom: 4 }}>
        {categoryOptions.length === 0 && !USE_MOCK_DATA && (
          <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
            No categories yet — add one in Budget first.
          </span>
        )}
        {categoryOptions.map((c) => (
          <button
            key={c.id}
            onClick={() => setExpCat(c.id)}
            style={{
              boxSizing: "border-box",
              whiteSpace: "nowrap",
              padding: "10px",
              borderRadius: 5,
              border: `1px solid ${NAVY}`,
              background: expCat === c.id ? NAVY : "#fff",
              color: expCat === c.id ? "#fff" : "#000",
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: "-0.02em",
              cursor: "pointer",
            }}
          >
            {c.label}
          </button>
        ))}
        {!USE_MOCK_DATA && !isSavingsContribution && (
  <button
    onClick={() => navigate("addCategory")}
    style={{
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      padding: "10px",
      borderRadius: 5,
      border: `1px dashed ${NAVY}`,
      background: "#fff",
      color: NAVY,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 16,
      letterSpacing: "-0.02em",
      cursor: "pointer",
    }}
  >
    + Add
  </button>
)}
      </div>
        </>
      )}

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
            <Wallet size={18} color="#fff" /> {USE_MOCK_DATA ? (expAccount || "Select a wallet") : selectedWalletLabel}
          </span>
          <ChevronDown color="#fff" size={17} style={{ transform: showAccountDropdown ? "rotate(180deg)" : "none" }} />
        </div>
        {showAccountDropdown && (
          <>
            <div onClick={() => setShowAccountDropdown(false)} style={{ position: "fixed", inset: 0, zIndex: 1 }} />
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
              {walletOptions.length === 0 && !USE_MOCK_DATA && (
                <div style={{ padding: "12px 14px", fontFamily: FONT, fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
                  No wallets yet.
                </div>
              )}
              {!USE_MOCK_DATA && (
                <div
                  onClick={() => { setShowAccountDropdown(false); navigate("addWallet"); }}
                  style={{
                    padding: "12px 14px",
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 600,
                    color: GREEN,
                    borderTop: walletOptions.length > 0 ? "1px solid rgba(204,204,204,0.4)" : "none",
                    cursor: "pointer",
                  }}
                >
                  + Add new wallet
                </div>
              )}
              {walletOptions.map((w) => (
                <div
                  key={w.id}
                  onClick={() => { setExpAccount(w.id); console.log("WALLET SELECTED:", w); console.log("WALLET ID SELECTED:", w.id); setShowAccountDropdown(false); }}
                  style={{
                    padding: "12px 14px",
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 400,
                    color: "#000",
                    background: w.id === expAccount ? "rgba(20,173,76,0.12)" : "transparent",
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
          {apiBusy
            ? "Saving..."
            : isSavingsContribution
              ? "Save Contribution"
              : "Next"}
        </span>
      </button>
    </Screen>
  );
}