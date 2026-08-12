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
const FONT = "'Roboto Condensed', sans-serif";
const INK = "#070540";
const GREEN = "#14AD4C";
const SOFT_BORDER = "rgba(204, 204, 204, 0.4)";

export default function BudgetWizard() {
  const ctx = useApp();
  const C = useTheme();
  const {
    screen, setScreen, history, setHistory, name, setName, darkMode, setDarkMode,
    biometricEnabled, setBiometricEnabled, twoFactorEnabled, setTwoFactorEnabled, toast, setToast, showToast, profileEmail,
    setProfileEmail, profilePhone, setProfilePhone, isEditingProfile, setIsEditingProfile, transactions, setTransactions, goals,
    setGoals, notifications, setNotifications, income, setIncome, currency, setCurrency, budgetCats,
    setBudgetCats, allocations, setAllocations, notifFilter, setNotifFilter, txFilter, setTxFilter, navigate,
    goToTab, goBack, totalIncome, setTotalIncome, totalExpenses, totalAllocated, wizardTotalAllocated, phone, setPhone,
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
    handleFinishBudget,
  } = ctx;

  const INCOME_TYPES = [
    { k: "Salary", label: "Salary/Employment", sub: "Income from your job or an employer", icon: Briefcase, bg: "#F3E7CF", fg: "#7A442C" },
    { k: "Business", label: "Business", sub: "Income from business or a side hustle", icon: Store, bg: "#E3F2FD", fg: "#1E88E5" },
    { k: "Freelance", label: "Freelance", sub: "Income from client projects or gig work", icon: HandCoins, bg: "#E0F2F4", fg: "#2F7889" },
    { k: "Allowance", label: "Allowance & Grants", sub: "Monthly allowance, scholarships/stipend", icon: GraduationCap, bg: "#FFF8E1", fg: "#9E740B" },
    { k: "Other", label: "Other Income", sub: "Investments, rental income or others", icon: Coins, bg: "#E56DE5", fg: "#000000" },
  ];

  const StepDots = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "6px 0 20px" }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, border: `2px solid ${budgetStep >= i + 1 ? GREEN : INK}`,
              background: budgetStep >= i + 1 ? C.greenLight : "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 12, fontFamily: FONT, color: budgetStep >= i + 1 ? GREEN : INK, transform: "rotate(45deg)",
            }}>
              <span style={{ transform: "rotate(-45deg)" }}>{i + 1}</span>
            </div>
            <span style={{ fontFamily: FONT, fontSize: 18, lineHeight: "22px", fontWeight: 400, color: "#000", textAlign: "center" }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 0, borderTop: `1px solid ${INK}`, margin: "0 4px 14px" }} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Screen nav active="budgetHub" onNavigate={goToTab}>
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
      <BackHeader title="Create Budget" onBack={() => (budgetStep > 1 ? setBudgetStep((s) => s - 1) : goToTab("dashboard"))} right={<Clock size={18} color={C.navy} />} />
      <StepDots />

      {budgetStep === 1 && (
        <div>
          <div style={{ border: `2px solid ${GREEN}`, borderRadius: 20, padding: "10px 15px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 15 }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 23, lineHeight: "28px", letterSpacing: "-0.02em", color: "#000" }}>Income type</div>
              <div style={{ fontFamily: FONT, color: C.textMuted, fontSize: 14, lineHeight: "18px" }}>Select how you earn</div>
            </div>

            <div
              className="income-type-scroll"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                paddingBottom: 2,
              }}
            >
              {INCOME_TYPES.map((opt) => (
                <div
                  key={opt.k}
                  onClick={() => setIncomeType(opt.k)}
                  style={{
                    boxSizing: "border-box",
                    flex: "0 0 160px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                    border: `2px solid ${incomeType === opt.k ? GREEN : INK}`,
                    borderRadius: 15,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {incomeType === opt.k && (
                    <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={16} color={INK} />
                    </div>
                  )}
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: opt.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <opt.icon size={17} color={opt.fg} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 15, lineHeight: "18px", letterSpacing: "-0.02em", color: "#000" }}>{opt.label}</div>
                    <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 11, lineHeight: "14px", color: "#5c5c5c", marginTop: 4 }}>{opt.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: `2px solid ${SOFT_BORDER}`, borderRadius: 10, padding: 10, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 23, lineHeight: "28px", letterSpacing: "-0.02em", color: "#000" }}>Monthly Income Amount</div>
              <div style={{ fontFamily: FONT, color: C.textMuted, fontSize: 14, lineHeight: "18px" }}>Enter your average monthly income</div>
            </div>
            <div style={{ border: `1px solid ${SOFT_BORDER}`, borderRadius: 10, padding: 10 }}>
              <div style={{ fontFamily: FONT, fontSize: 12, color: C.textMuted }}>Amount (NGN)</div>
              <input
                ref={customIncomeInputRef}
                value={income || ""}
                onChange={(e) => setIncome(Number(e.target.value.replace(/\D/g, "")) || 0)}
                placeholder="₦0.00"
                style={{ border: "none", outline: "none", fontFamily: FONT, fontSize: 18, lineHeight: "22px", fontWeight: 400, color: "#000", width: "100%" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[1000000, 500000, 400000, 300000, 200000, 100000].map((v) => (
                <button
                  key={v}
                  onClick={() => setIncome(v)}
                  style={{
                    border: `1px solid ${SOFT_BORDER}`, borderRadius: 10, padding: "6px 4px",
                    fontFamily: FONT, fontSize: 14, lineHeight: "17px", fontWeight: 400, textAlign: "center",
                    color: "#000", background: income === v ? C.greenLight : "#fff", cursor: "pointer",
                  }}
                >
                  {fmtNShort(v)}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setIncome(0); customIncomeInputRef.current && customIncomeInputRef.current.focus(); }}
              style={{
                width: "100%", border: `1px solid ${SOFT_BORDER}`, borderRadius: 10, padding: "8px 4px",
                fontFamily: FONT, fontSize: 14, fontWeight: 400, textAlign: "center", color: "#000", background: "#fff", cursor: "pointer",
              }}
            >
              Others
            </button>
          </div>
          <PrimaryButton
            style={{
              marginTop: 18, background: GREEN, borderRadius: 20, height: 60,
              fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", color: "#fff",
            }}
            onClick={() => setBudgetStep(2)}
          >
            Continue
          </PrimaryButton>
        </div>
      )}

      {budgetStep === 2 && (
        <div>
          <h3 style={{ fontFamily: FONT, color: "#000", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Select budget categories</h3>
          <p style={{ fontFamily: FONT, color: C.textMuted, fontSize: 13, marginBottom: 12 }}>Choose the categories you want to include in your budget.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {budgetCats.map((c) => (
              <label key={c.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 2px", cursor: "pointer" }}>
                <input type="checkbox" checked={c.checked} onChange={() => toggleCat(c.key)} style={{ width: 17, height: 17, accentColor: GREEN }} />
                <c.icon size={16} color={INK} />
                <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#000" }}>{c.label}</span>
              </label>
            ))}
          </div>
          <PrimaryButton style={{ marginTop: 18, background: GREEN, borderRadius: 20, height: 60, fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", color: "#fff" }} onClick={() => setBudgetStep(3)}>Continue</PrimaryButton>
        </div>
      )}

      {budgetStep === 3 && (
        <div>
          <h3 style={{ fontFamily: FONT, color: "#000", fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Allocate your income</h3>
          <p style={{ fontFamily: FONT, color: C.textMuted, fontSize: 13, marginBottom: 14 }}>Drag the sliders to set how much you want to spend in each category.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {budgetCats.filter((c) => c.checked).map((c) => (
              <div key={c.key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 4 }}>
                  <span>{c.label}</span><span>{fmtNShort(allocations[c.key] || 0)}</span>
                </div>
                <input
                  type="range" min={0} max={150000} step={5000}
                  value={allocations[c.key] || 0}
                  onChange={(e) => setAllocations((a) => ({ ...a, [c.key]: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: GREEN }}
                />
              </div>
            ))}
          </div>
          {/* Was reading `totalAllocated` — that value (in AppContext) is
              deliberately scoped to categories already saved as real Budget
              documents on the backend (budgetsByCategory), for the
              Dashboard's "Budget Remaining" card. Mid-wizard, before the
              user has hit Continue on this step, nothing is saved yet, so
              totalAllocated was always 0 here regardless of the sliders —
              which is why "Total Allocation" showed 0 and "Remaining" never
              moved off the full income amount. wizardTotalAllocated sums
              the live, in-progress slider values for checked categories
              instead, so this updates as the user drags. */}
          <div style={{ display: "flex", justifyContent: "space-between", border: `1px solid ${SOFT_BORDER}`, borderRadius: 10, padding: 12, marginTop: 16 }}>
            <div><div style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted }}>Total Allocation</div><div style={{ fontFamily: FONT, fontWeight: 700, color: "#000" }}>{fmtNShort(wizardTotalAllocated)}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontFamily: FONT, fontSize: 11, color: C.textMuted }}>Remaining</div><div style={{ fontFamily: FONT, fontWeight: 700, color: "#000" }}>{fmtNShort(Math.max(0, income - wizardTotalAllocated))}</div></div>
          </div>
          <PrimaryButton style={{ marginTop: 18, background: GREEN, borderRadius: 20, height: 60, fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", color: "#fff" }} onClick={() => setBudgetStep(4)}>Continue</PrimaryButton>
        </div>
      )}

      {budgetStep === 4 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 20 }}>
          <div style={{ width: 74, height: 74, borderRadius: 40, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Check size={34} color={GREEN} />
          </div>
          <h3 style={{ fontFamily: FONT, color: "#000", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>You're all set!</h3>
          <p style={{ fontFamily: FONT, color: C.textMuted, fontSize: 14, marginTop: 6 }}>Your account is ready to go. Start tracking, budgeting and achieving your goals.</p>
          <div style={{ width: "100%", border: `1px solid ${SOFT_BORDER}`, borderRadius: 10, padding: 16, marginTop: 20, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontFamily: FONT, color: C.textMuted, fontSize: 13 }}>Monthly Income</span><b style={{ fontFamily: FONT, color: "#000" }}>{fmtNShort(income || 245000)}</b></div>
            {/* Was `fmtNShort(totalAllocated || 215000)` — same
                budgetsByCategory-scoping issue as Step 3: before the save
                happens (this screen renders BEFORE handleFinishBudget is
                called, since it fires from the button below), totalAllocated
                is 0, so this always fell back to the hardcoded 215000 mock
                value instead of reflecting what the user actually chose. */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontFamily: FONT, color: C.textMuted, fontSize: 13 }}>Total Budget</span><b style={{ fontFamily: FONT, color: "#000" }}>{fmtNShort(wizardTotalAllocated || 215000)}</b></div>
            {/* "Savings Goal" here was static text — always "Not set yet",
                never wired to any state or API call. It isn't a data-loading
                bug; nothing was ever fetching or computing a value for it.
                It's also worth flagging structurally: the backend's Budget
                model (see budget.service.js / Budget schema) has no
                savingsGoal field at all — only Transaction does (an
                optional `savingsGoal` ObjectId ref). A budget, as this
                backend models it, isn't linked to a savings goal. So there
                are two honest options, and I didn't pick one for you:
                  1) Drop this row entirely, since a created Budget has
                     nothing to show here — it's not deferred, it's N/A.
                  2) Turn it into a real feature: let the user optionally
                     pick one of their existing `goals` on this screen and
                     surface its name here — but that requires deciding
                     where that link is actually stored, since Budget has
                     no field for it today (would likely mean creating/
                     tagging a Transaction with `savingsGoal` instead, or a
                     backend schema change).
                For now this keeps the exact prior text/behavior. */}
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: FONT, color: C.textMuted, fontSize: 13 }}>Savings Goal</span><b style={{ fontFamily: FONT, color: "#000" }}>Not set yet</b></div>
          </div>
          {/* Was: onClick={() => (history.length === 0 ? navigate("securityPrompt") : goToTab("dashboard"))}
              That duplicated only the navigation half of handleFinishBudget and skipped the
              BudgetAPI call entirely, so the wizard's income/categories/allocations were
              never persisted to the backend. handleFinishBudget already does the save (via
              BudgetAPI.create/update) AND the same navigation, so call it directly. */}
          <PrimaryButton style={{ marginTop: 22 }} onClick={handleFinishBudget}>
            {history.length === 0 ? "Continue" : "Go to Dashboard"}
          </PrimaryButton>
        </div>
      )}
    </Screen>
  );
}
