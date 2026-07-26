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

export default function BudgetWizard() {
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

  const StepDots = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "6px 0 20px" }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${budgetStep >= i + 1 ? C.green : C.border}`,
              background: budgetStep >= i + 1 ? C.greenLight : "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 12, color: budgetStep >= i + 1 ? C.green : C.textMuted, transform: "rotate(45deg)",
            }}>
              <span style={{ transform: "rotate(-45deg)" }}>{i + 1}</span>
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: budgetStep >= i + 1 ? C.green : C.textMuted }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: budgetStep > i + 1 ? C.green : C.border, margin: "0 4px 14px" }} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Screen nav active="budgetHub" onNavigate={goToTab}>
      <BackHeader title="Create Budget" onBack={() => (budgetStep > 1 ? setBudgetStep((s) => s - 1) : goToTab("dashboard"))} right={<Clock size={18} color={C.navy} />} />
      <StepDots />

      {budgetStep === 1 && (
        <div>
          <div style={{ border: `1.5px solid ${C.green}`, borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <div style={{ fontWeight: 800, color: C.navy, fontSize: 14.5 }}>Income type</div>
            <div style={{ color: C.textMuted, fontSize: 12 }}>Select how you earn</div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {[{ k: "Salary", label: "Salary/Employment", sub: "Income from your job or an employer", icon: Briefcase }, { k: "Business", label: "Business", sub: "Income from business or a side hustle", icon: Store }].map((opt) => (
                <div key={opt.k} onClick={() => setIncomeType(opt.k)} style={{
                  flex: 1, border: `1.5px solid ${incomeType === opt.k ? C.green : C.border}`, borderRadius: 12, padding: 12, cursor: "pointer", position: "relative",
                }}>
                  {incomeType === opt.k && <div style={{ position: "absolute", top: 8, right: 8 }}><Check size={14} color={C.green} /></div>}
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "#F3E7CF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                    <opt.icon size={16} color="#8A5A21" />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 12.5, color: C.navy }}>{opt.label}</div>
                  <div style={{ fontSize: 10.5, color: C.textMuted, marginTop: 2 }}>{opt.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontWeight: 800, color: C.navy, fontSize: 14.5 }}>Monthly Income Amount</div>
            <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 10 }}>Enter your average monthly income</div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 10.5, color: C.textMuted }}>Amount (NGN)</div>
              <input ref={customIncomeInputRef} value={income || ""} onChange={(e) => setIncome(Number(e.target.value.replace(/\D/g, "")) || 0)} placeholder="0.00" style={{ border: "none", outline: "none", fontSize: 16, fontWeight: 800, color: C.navy, width: "100%" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[1000000, 500000, 400000, 300000, 200000, 100000].map((v) => (
                <button key={v} onClick={() => setIncome(v)} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 4px", fontSize: 12, fontWeight: 700, color: C.navy, background: income === v ? C.greenLight : C.card, cursor: "pointer" }}>
                  {fmtNShort(v)}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setIncome(0); customIncomeInputRef.current && customIncomeInputRef.current.focus(); }}
              style={{ marginTop: 8, width: "100%", border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 4px", fontSize: 12, fontWeight: 700, color: C.navy, background: C.card, cursor: "pointer" }}
            >
              Others
            </button>
          </div>
          <PrimaryButton style={{ marginTop: 18 }} onClick={() => setBudgetStep(2)}>Continue</PrimaryButton>
        </div>
      )}

      {budgetStep === 2 && (
        <div>
          <h3 style={{ color: C.navy, fontSize: 15, fontWeight: 800 }}>Select budget categories</h3>
          <p style={{ color: C.textMuted, fontSize: 12.5, marginBottom: 12 }}>Choose the categories you want to include in your budget.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {budgetCats.map((c) => (
              <label key={c.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 2px", cursor: "pointer" }}>
                <input type="checkbox" checked={c.checked} onChange={() => toggleCat(c.key)} style={{ width: 17, height: 17, accentColor: C.green }} />
                <c.icon size={16} color={C.navy} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{c.label}</span>
              </label>
            ))}
          </div>
          <PrimaryButton style={{ marginTop: 18 }} onClick={() => setBudgetStep(3)}>Continue</PrimaryButton>
        </div>
      )}

      {budgetStep === 3 && (
        <div>
          <h3 style={{ color: C.navy, fontSize: 15, fontWeight: 800 }}>Allocate your income</h3>
          <p style={{ color: C.textMuted, fontSize: 12.5, marginBottom: 14 }}>Drag the sliders to set how much you want to spend in each category.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {budgetCats.filter((c) => c.checked).map((c) => (
              <div key={c.key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
                  <span>{c.label}</span><span>{fmtNShort(allocations[c.key] || 0)}</span>
                </div>
                <input
                  type="range" min={0} max={150000} step={5000}
                  value={allocations[c.key] || 0}
                  onChange={(e) => setAllocations((a) => ({ ...a, [c.key]: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: C.green }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, marginTop: 16 }}>
            <div><div style={{ fontSize: 11, color: C.textMuted }}>Total Allocation</div><div style={{ fontWeight: 800, color: C.navy }}>{fmtNShort(totalAllocated)}</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: C.textMuted }}>Remaining</div><div style={{ fontWeight: 800, color: C.navy }}>{fmtNShort(Math.max(0, income - totalAllocated))}</div></div>
          </div>
          <PrimaryButton style={{ marginTop: 18 }} onClick={() => setBudgetStep(4)}>Continue</PrimaryButton>
        </div>
      )}

      {budgetStep === 4 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 20 }}>
          <div style={{ width: 74, height: 74, borderRadius: 40, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Check size={34} color={C.green} />
          </div>
          <h3 style={{ color: C.navy, fontSize: 18, fontWeight: 800 }}>You're all set!</h3>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 6 }}>Your account is ready to go. Start tracking, budgeting and achieving your goals.</p>
          <div style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginTop: 20, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ color: C.textMuted, fontSize: 12.5 }}>Monthly Income</span><b style={{ color: C.navy }}>{fmtNShort(income || 245000)}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ color: C.textMuted, fontSize: 12.5 }}>Total Budget</span><b style={{ color: C.navy }}>{fmtNShort(totalAllocated || 215000)}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.textMuted, fontSize: 12.5 }}>Savings Goal</span><b style={{ color: C.navy }}>Not set yet</b></div>
          </div>
          <PrimaryButton style={{ marginTop: 22 }} onClick={() => (history.length === 0 ? navigate("securityPrompt") : goToTab("dashboard"))}>
            {history.length === 0 ? "Continue" : "Go to Dashboard"}
          </PrimaryButton>
        </div>
      )}
    </Screen>
  );
}
