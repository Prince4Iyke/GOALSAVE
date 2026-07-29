import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from "react";
import { Target } from "lucide-react";
import { buildInitialTransactions, buildInitialGoals, buildInitialNotifications, budgetCategoryOptions } from "../data";
import { toISODate } from "../utils";
import { fmtNShort } from "../theme";
import { USE_MOCK_DATA, ApiError } from "../api/client";
import { AuthAPI, ProfileAPI, BudgetAPI, TransactionsAPI, IncomeAPI, GoalsAPI, NotificationsAPI, SecurityAPI } from "../api/endpoints";

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
  const [apiBusy, setApiBusy] = useState(false);
  const reportApiError = (err, fallbackMsg) => {
    const msg = err instanceof ApiError ? err.message : fallbackMsg || "Something went wrong. Please try again.";
    showToast(msg);
  };
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

  // Pull real data from the backend once, on first mount, when a token is
  // already present (e.g. returning user) and mock mode is off. Login/signup
  // flows load their own data right after authenticating (see handleLogin /
  // AuthAPI.verifyOtp callers below), so this mainly covers page refreshes.
  useEffect(() => {
    if (USE_MOCK_DATA) return;
    (async () => {
      try {
        const [me, budget, tx, gl, nf, sec] = await Promise.all([
          AuthAPI.me().catch(() => null),
          BudgetAPI.get().catch(() => null),
          TransactionsAPI.list().catch(() => null),
          GoalsAPI.list().catch(() => null),
          NotificationsAPI.list().catch(() => null),
          SecurityAPI.get().catch(() => null),
        ]);
        if (me?.user) {
          setName(me.user.name || me.user.fullName || "");
          setProfileEmail(me.user.email || "");
          setProfilePhone(me.user.phone || "");
        }
        if (budget) {
          if (budget.income != null) setIncome(budget.income);
          if (budget.currency) setCurrency(budget.currency);
          if (budget.categories) setBudgetCats(budget.categories);
          if (budget.allocations) setAllocations(budget.allocations);
        }
        if (Array.isArray(tx)) setTransactions(tx);
        if (Array.isArray(gl)) setGoals(gl);
        if (Array.isArray(nf)) setNotifications(nf);
        if (sec) {
          if (sec.biometricEnabled != null) setBiometricEnabled(sec.biometricEnabled);
          if (sec.twoFactorEnabled != null) setTwoFactorEnabled(sec.twoFactorEnabled);
        }
      } catch (err) {
        reportApiError(err, "Couldn't load your data from the server.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const handleForgotPassword = async () => {
    if (!phone.trim()) {
      showToast("Enter your phone number first, then tap Forgot Password.");
      return;
    }
    if (USE_MOCK_DATA) {
      showToast(`If ${phone} is registered, we've sent a reset code.`);
      return;
    }
    try {
      await AuthAPI.forgotPassword({ phone: phone.trim() });
      showToast(`If ${phone} is registered, we've sent a reset code.`);
    } catch (err) {
      reportApiError(err, "Couldn't send a reset code. Please try again.");
    }
  };
  const handleLogin = async () => {
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

    if (USE_MOCK_DATA) {
      goToTab("dashboard");
      return;
    }

    setApiBusy(true);
    try {
      const data = await AuthAPI.login({ phone: phone.trim(), password: pin });
      if (data?.user) {
        setName(data.user.name || data.user.fullName || "");
        setProfileEmail(data.user.email || "");
        setProfilePhone(data.user.phone || phone.trim());
      }
      goToTab("dashboard");
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  /* ------------------------------ SIGN UP ------------------------------ */
  const [showPw, setShowPw] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupErrors, setSignupErrors] = useState({});

  const validatePassword = (pw) => pw.length >= 8 && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);

  const handleCreateAccount = async () => {
    const errs = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!signupEmail.trim()) errs.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(signupEmail.trim())) errs.email = "Enter a valid email address.";
    if (!signupPhone.trim()) errs.phone = "Phone number is required.";
    if (!signupPassword.trim()) errs.password = "Password is required.";
    else if (!validatePassword(signupPassword)) errs.password = "Password doesn't meet the requirements below.";
    setSignupErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (USE_MOCK_DATA) {
      navigate("otp");
      return;
    }

    setApiBusy(true);
    try {
      await AuthAPI.signup({
        fullName: name.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        password: signupPassword,
      });
      navigate("otp");
    } catch (err) {
      setSignupErrors({ email: err instanceof ApiError ? err.message : "Sign up failed. Please try again." });
    } finally {
      setApiBusy(false);
    }
  };

  const clearErr = (key) => setSignupErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));


  /* -------------------------------- OTP -------------------------------- */
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendSeconds, setResendSeconds] = useState(45);
  const [otpError, setOtpError] = useState("");
  useEffect(() => {
    if (screen !== "otp" || resendSeconds <= 0) return;
    const id = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [screen, resendSeconds]);

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Enter the full 6-digit code.");
      return;
    }
    setOtpError("");
    if (USE_MOCK_DATA) {
      navigate("income");
      return;
    }
    setApiBusy(true);
    try {
      const data = await AuthAPI.verifyOtp({ phone: signupPhone.trim(), code });
      if (data?.user) {
        setName(data.user.name || data.user.fullName || "");
        setProfileEmail(data.user.email || "");
        setProfilePhone(data.user.phone || signupPhone.trim());
      }
      navigate("income");
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "That code didn't work. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  const handleResendOtp = async () => {
    setResendSeconds(45);
    if (USE_MOCK_DATA) {
      showToast("A new code has been sent.");
      return;
    }
    try {
      await AuthAPI.resendOtp({ phone: signupPhone.trim() });
      showToast("A new code has been sent.");
    } catch (err) {
      reportApiError(err, "Couldn't resend the code. Please try again.");
    }
  };

  /* ----------------------------- INCOME SETUP ---------------------------- */

  /* ---------------------------- CURRENCY CHOICE --------------------------- */
  const currencies = ["Nigerian Naira (\u20A6)", "US Dollar ($)", "Euro (\u20AC)", "British Pound (\u00A3)"];

  /* ------------------------- BUDGET CREATION WIZARD ------------------------ */
  const [budgetStep, setBudgetStep] = useState(1);
  const [incomeType, setIncomeType] = useState("Salary");
  const customIncomeInputRef = useRef(null);
  const steps = ["Income", "Categories", "Review", "Complete"];


  const toggleCat = (key) => setBudgetCats((cs) => cs.map((c) => (c.key === key ? { ...c, checked: !c.checked } : c)));

  const handleFinishBudget = async () => {
    if (!USE_MOCK_DATA) {
      try {
        await BudgetAPI.save({ income, currency, categories: budgetCats, allocations });
      } catch (err) {
        reportApiError(err, "Couldn't save your budget. It's kept locally for now.");
      }
    }
    if (history.length === 0) navigate("securityPrompt");
    else goToTab("dashboard");
  };


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

  const handleSaveExpense = async () => {
    if (!expAmount) return;
    const todayISOStr = toISODate(new Date());
    const yestDateObj = new Date();
    yestDateObj.setDate(yestDateObj.getDate() - 1);
    const yestISOStr = toISODate(yestDateObj);
    const groupLabel =
      expDate === todayISOStr ? `Today, ${formatShortGroupDate(expDate)}` :
      expDate === yestISOStr ? `Yesterday, ${formatShortGroupDate(expDate)}` :
      formatShortGroupDate(expDate);
    const category = expCat === "All" ? "Others" : expCat;
    const localTx = { id: Date.now(), cat: category, name: expNote || category, place: category, amount: Number(expAmount), date: expDate, time: formatTime(new Date()), group: groupLabel };

    if (USE_MOCK_DATA) {
      setTransactions((t) => [localTx, ...t]);
      setExpAmount(""); setExpNote("");
      goToTab("transactions");
      return;
    }

    setApiBusy(true);
    try {
      const created = await TransactionsAPI.create({
        cat: category, name: expNote || category, place: category,
        amount: Number(expAmount), date: expDate, time: localTx.time,
      });
      setTransactions((t) => [created || localTx, ...t]);
      setExpAmount(""); setExpNote("");
      goToTab("transactions");
    } catch (err) {
      reportApiError(err, "Couldn't save this expense. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };


  /* -------------------------------- ADD INCOME ------------------------------- */
  const [incAmount, setIncAmount] = useState("");
  const [incSource, setIncSource] = useState("Salary");
  const [incNote, setIncNote] = useState("");
  const [incDate, setIncDate] = useState(() => toISODate(new Date()));
  const incomeSources = ["Salary", "Business", "Gift", "Investment", "Other"];

  const handleSaveIncome = async () => {
    if (!incAmount) return;
    const amt = Number(incAmount);

    if (USE_MOCK_DATA) {
      setTotalIncome((t) => t + amt);
      showToast(`${fmtNShort(amt)} added to your total income.`);
      setIncAmount(""); setIncNote("");
      goToTab("dashboard");
      return;
    }

    setApiBusy(true);
    try {
      const result = await IncomeAPI.add({ amount: amt, source: incSource, account: "Main wallet", date: incDate, note: incNote });
      setTotalIncome(result?.totalIncome != null ? result.totalIncome : (t) => t + amt);
      showToast(`${fmtNShort(amt)} added to your total income.`);
      setIncAmount(""); setIncNote("");
      goToTab("dashboard");
    } catch (err) {
      reportApiError(err, "Couldn't save this income. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

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

  const addContribution = async (goalId, amount) => {
    const amt = Number(amount);
    if (!amt) return;
    const g = goals.find((x) => x.id === goalId);

    if (USE_MOCK_DATA) {
      setGoals((gs) => gs.map((x) => (x.id === goalId ? { ...x, saved: x.saved + amt } : x)));
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setContributionHistory((h) => [{ id: Date.now(), goalName: g ? g.name : "Goal", amount: amt, time }, ...h]);
      return;
    }

    setApiBusy(true);
    try {
      const data = await GoalsAPI.contribute(goalId, { amount: amt });
      if (data?.goal) {
        setGoals((gs) => gs.map((x) => (x.id === goalId ? data.goal : x)));
      } else {
        setGoals((gs) => gs.map((x) => (x.id === goalId ? { ...x, saved: x.saved + amt } : x)));
      }
      const time = data?.entry?.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setContributionHistory((h) => [data?.entry || { id: Date.now(), goalName: g ? g.name : "Goal", amount: amt, time }, ...h]);
    } catch (err) {
      reportApiError(err, "Couldn't save this contribution. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoalName.trim() || !newGoalTarget) return;
    const localGoal = { id: Date.now(), name: newGoalName.trim(), icon: Target, saved: 0, target: Number(newGoalTarget) };

    if (USE_MOCK_DATA) {
      setGoals((gs) => [...gs, localGoal]);
      setNewGoalName(""); setNewGoalTarget(""); setShowAddGoal(false);
      return;
    }

    setApiBusy(true);
    try {
      const created = await GoalsAPI.create({ name: newGoalName.trim(), target: Number(newGoalTarget) });
      setGoals((gs) => [...gs, created ? { ...localGoal, ...created } : localGoal]);
      setNewGoalName(""); setNewGoalTarget(""); setShowAddGoal(false);
    } catch (err) {
      reportApiError(err, "Couldn't create this goal. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };


  /* ------------------------------ NOTIFICATIONS ----------------------------- */
  const filteredNotifs = notifFilter === "All" ? notifications : notifications.filter((n) => n.cat === notifFilter);
  const notifGrouped = filteredNotifs.reduce((acc, n) => { (acc[n.group] = acc[n.group] || []).push(n); return acc; }, {});

  const handleMarkNotificationRead = (id) => {
    setNotifications((ns) => ns.map((x) => (x.id === id ? { ...x, unread: false } : x)));
    if (!USE_MOCK_DATA) {
      NotificationsAPI.markRead(id).catch((err) => reportApiError(err, "Couldn't update this notification."));
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((ns) => ns.map((x) => ({ ...x, unread: false })));
    if (!USE_MOCK_DATA) {
      NotificationsAPI.markAllRead().catch((err) => reportApiError(err, "Couldn't mark all as read."));
    }
  };


  /* -------------------------------- PROFILE --------------------------------- */
  const handleSaveProfile = async () => {
    setIsEditingProfile(false);
    if (USE_MOCK_DATA) return;
    try {
      await ProfileAPI.update({ name, email: profileEmail, phone: profilePhone });
    } catch (err) {
      reportApiError(err, "Couldn't save your profile changes.");
    }
  };

  /* --------------------------- PERSONAL INFORMATION ------------------------- */

  /* ---------------------------- SECURITY CENTER ----------------------------- */
  const handleToggleBiometric = () => {
    const next = !biometricEnabled;
    setBiometricEnabled(next);
    if (!USE_MOCK_DATA) {
      SecurityAPI.update({ biometricEnabled: next }).catch((err) => reportApiError(err, "Couldn't update biometric login."));
    }
  };
  const handleEnableBiometric = () => {
    setBiometricEnabled(true);
    if (!USE_MOCK_DATA) {
      SecurityAPI.update({ biometricEnabled: true }).catch((err) => reportApiError(err, "Couldn't update biometric login."));
    }
  };
  const handleToggleTwoFactor = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    if (!USE_MOCK_DATA) {
      SecurityAPI.update({ twoFactorEnabled: next }).catch((err) => reportApiError(err, "Couldn't update two-factor authentication."));
    }
  };


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
    otpError, handleVerifyOtp, handleResendOtp, apiBusy, handleForgotPassword, handleFinishBudget,
    handleSaveExpense, handleSaveIncome, handleCreateGoal,
    handleMarkNotificationRead, handleMarkAllNotificationsRead,
    handleSaveProfile, handleToggleBiometric, handleEnableBiometric, handleToggleTwoFactor,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
