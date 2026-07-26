import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from "react";
import { buildInitialTransactions, buildInitialGoals, buildInitialNotifications, budgetCategoryOptions } from "../data";
import { toISODate } from "../utils";

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [screen, setScreen] = useState("splash");
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("Faith");
  const [darkMode, setDarkMode] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [toast, setToast] = useState(null);
  const showToast = (msg) => setToast(msg);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);
  const [profileEmail, setProfileEmail] = useState("faith233@gmail.com");
  const [profilePhone, setProfilePhone] = useState("0802 123 4567");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [transactions, setTransactions] = useState(buildInitialTransactions);
  const [goals, setGoals] = useState(buildInitialGoals);
  const [notifications, setNotifications] = useState(buildInitialNotifications);
  const [income, setIncome] = useState(0);
  const [currency, setCurrency] = useState("Nigerian Naira (\u20A6)");
  const [budgetCats, setBudgetCats] = useState(budgetCategoryOptions);
  const [allocations, setAllocations] = useState({ Food: 60000, Transport: 30000, Housing: 80000, Utilities: 20000, Entertainment: 15000, Others: 10000 });
  const [notifFilter, setNotifFilter] = useState("All");
  const [txFilter, setTxFilter] = useState("All");

  const navigate = (next) => {
    setHistory((h) => [...h, screen]);
    setScreen(next);
  };
  const goToTab = (tab) => {
    setHistory([]);
    if (tab === "budgetHub") setBudgetStep(1);
    setScreen(tab);
  };
  const goBack = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const copy = [...h];
      const prev = copy.pop();
      setScreen(prev);
      return copy;
    });
  };

  const [totalIncome, setTotalIncome] = useState(245000);
  const totalExpenses = useMemo(() => transactions.reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalAllocated = useMemo(() => Object.values(allocations).reduce((a, b) => a + b, 0), [allocations]);

  /* ------------------------------ SPLASH ------------------------------ */

  /* --------------------------- ONBOARDING --------------------------- */


  /* ------------------------------- LOGIN ------------------------------- */
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const handleLogin = () => {
    if (!phone.trim() && !pin.trim()) {
      setLoginError("Phone number and password are required.");
      return;
    }
    if (!phone.trim()) {
      setLoginError("Phone number is required.");
      return;
    }
    if (!pin.trim() || !validatePassword(pin)) {
      setLoginError("Enter your password (min 8 characters, 1 number, 1 special character).");
      return;
    }
    setLoginError("");
    goToTab("dashboard");
  };

  /* ------------------------------ SIGN UP ------------------------------ */
  const [showPw, setShowPw] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupErrors, setSignupErrors] = useState({});

  const validatePassword = (pw) => pw.length >= 8 && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);

  const handleCreateAccount = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!signupEmail.trim()) errs.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(signupEmail.trim())) errs.email = "Enter a valid email address.";
    if (!signupPhone.trim()) errs.phone = "Phone number is required.";
    if (!signupPassword.trim()) errs.password = "Password is required.";
    else if (!validatePassword(signupPassword)) errs.password = "Password doesn't meet the requirements below.";
    setSignupErrors(errs);
    if (Object.keys(errs).length === 0) navigate("otp");
  };

  const clearErr = (key) => setSignupErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));


  /* -------------------------------- OTP -------------------------------- */
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendSeconds, setResendSeconds] = useState(45);
  useEffect(() => {
    if (screen !== "otp" || resendSeconds <= 0) return;
    const id = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [screen, resendSeconds]);

  /* ----------------------------- INCOME SETUP ---------------------------- */

  /* ---------------------------- CURRENCY CHOICE --------------------------- */
  const currencies = ["Nigerian Naira (\u20A6)", "US Dollar ($)", "Euro (\u20AC)", "British Pound (\u00A3)"];

  /* ------------------------- BUDGET CREATION WIZARD ------------------------ */
  const [budgetStep, setBudgetStep] = useState(1);
  const [incomeType, setIncomeType] = useState("Salary");
  const customIncomeInputRef = useRef(null);
  const steps = ["Income", "Categories", "Review", "Complete"];


  const toggleCat = (key) => setBudgetCats((cs) => cs.map((c) => (c.key === key ? { ...c, checked: !c.checked } : c)));


  /* ---------------------------- SECURITY PROMPT --------------------------- */

  /* -------------------------------- DASHBOARD ------------------------------ */
  const spendingBreakdown = [
    { cat: "Food", pct: 45, color: "#16A34A" },
    { cat: "Shopping", pct: 20, color: "#F5A524" },
    { cat: "Bills", pct: 15, color: "#20B0C4" },
    { cat: "Entertainment", pct: 13, color: "#E23FA0" },
    { cat: "Transportation", pct: 7, color: "#101B3D" },
  ];
  const donutGradient = (() => {
    let acc = 0;
    const parts = spendingBreakdown.map((s) => {
      const start = acc; acc += s.pct;
      return `${s.color} ${start}% ${acc}%`;
    });
    return `conic-gradient(${parts.join(",")})`;
  })();

  const emergency = goals.find((g) => g.name === "Emergency Fund");
  const unreadCount = notifications.filter((n) => n.unread).length;


  /* ------------------------------- ADD EXPENSE ------------------------------ */
  const [expAmount, setExpAmount] = useState("");
  const [expAccount, setExpAccount] = useState("Main wallet");
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [expCat, setExpCat] = useState("Food");
  const [expNote, setExpNote] = useState("");
  const [expDate, setExpDate] = useState(() => toISODate(new Date()));

  const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const formatLongDate = (iso) => {
    if (!iso) return "Select a date";
    const d = new Date(iso + "T00:00:00");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${ordinal(d.getDate())} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  };
  const formatShortGroupDate = (iso) => {
    const d = new Date(iso + "T00:00:00");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };
  const addExpenseCats = ["All", "Food", "Transportation", "Bills", "Entertainment"];


  /* -------------------------------- ADD INCOME ------------------------------- */
  const [incAmount, setIncAmount] = useState("");
  const [incSource, setIncSource] = useState("Salary");
  const [incNote, setIncNote] = useState("");
  const [incDate, setIncDate] = useState(() => toISODate(new Date()));
  const incomeSources = ["Salary", "Business", "Gift", "Investment", "Other"];

  const [txSearch, setTxSearch] = useState("");
  const [txSortNewest, setTxSortNewest] = useState(true);
  const searchedTx = transactions.filter((t) => t.name.toLowerCase().includes(txSearch.toLowerCase()) || t.cat.toLowerCase().includes(txSearch.toLowerCase()));
  const catFilteredTx = txFilter === "All" ? searchedTx : searchedTx.filter((t) => t.cat === txFilter || (txFilter === "Transportation" && t.cat === "Transport"));
  const filteredTx = txSortNewest ? catFilteredTx : [...catFilteredTx].sort((a, b) => b.amount - a.amount);
  const grouped = filteredTx.reduce((acc, t) => { (acc[t.group] = acc[t.group] || []).push(t); return acc; }, {});
  const dailyBudget = 15000;
  const spentToday = transactions.filter((t) => t.group.startsWith("Today")).reduce((s, t) => s + t.amount, 0);


  /* -------------------------------- ANALYTICS ------------------------------- */
  const monthlyTrend = [30, 38, 26, 34, 58, 44, 40];
  const weeklyTrend = [22, 46, 18, 52, 30, 60, 24];
  const monthWeekLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [analyticsPeriod, setAnalyticsPeriod] = useState("Monthly");
  const [analyticsMonthIndex, setAnalyticsMonthIndex] = useState(() => new Date().getMonth());
  const [analyticsYear, setAnalyticsYear] = useState(() => new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const activeTrend = analyticsPeriod === "Weekly" ? weeklyTrend : monthlyTrend;
  const activeLabels = analyticsPeriod === "Weekly" ? dayLabels : monthWeekLabels;
  const goToPrevMonth = () => {
    if (analyticsMonthIndex === 0) { setAnalyticsMonthIndex(11); setAnalyticsYear((y) => y - 1); }
    else setAnalyticsMonthIndex((m) => m - 1);
  };
  const goToNextMonth = () => {
    if (analyticsMonthIndex === 11) { setAnalyticsMonthIndex(0); setAnalyticsYear((y) => y + 1); }
    else setAnalyticsMonthIndex((m) => m + 1);
  };

  /* --------------------------------- GOALS ---------------------------------- */
  const [contribAmount, setContribAmount] = useState("");
  const [contributionHistory, setContributionHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [otherContribAmount, setOtherContribAmount] = useState("");
  const others = goals.filter((g) => !g.featured);

  const addContribution = (goalId, amount) => {
    const amt = Number(amount);
    if (!amt) return;
    const g = goals.find((x) => x.id === goalId);
    setGoals((gs) => gs.map((x) => (x.id === goalId ? { ...x, saved: x.saved + amt } : x)));
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setContributionHistory((h) => [{ id: Date.now(), goalName: g ? g.name : "Goal", amount: amt, time }, ...h]);
  };


  /* ------------------------------ NOTIFICATIONS ----------------------------- */
  const filteredNotifs = notifFilter === "All" ? notifications : notifications.filter((n) => n.cat === notifFilter);
  const notifGrouped = filteredNotifs.reduce((acc, n) => { (acc[n.group] = acc[n.group] || []).push(n); return acc; }, {});


  /* -------------------------------- PROFILE --------------------------------- */

  /* --------------------------- PERSONAL INFORMATION ------------------------- */

  /* ---------------------------- SECURITY CENTER ----------------------------- */


  const value = {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
