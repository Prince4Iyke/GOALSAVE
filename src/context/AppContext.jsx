import React, {createContext,useContext,useState,useMemo,useEffect,useRef,} from "react";
import {Target,AlertTriangle,Receipt,HandCoins,MoreHorizontal,} from "lucide-react";
import {buildInitialTransactions,buildInitialGoals,buildInitialNotifications,budgetCategoryOptions,} from "../data";
import { toISODate, formatTime } from "../utils";
import { fmtNShort } from "../theme";
import { USE_MOCK_DATA, ApiError } from "../api/client";
import {AuthAPI,ProfileAPI,BudgetAPI,TransactionsAPI,WalletsAPI,CategoriesAPI,GoalsAPI,NotificationsAPI,DashboardAPI,SecurityAPI,} from "../api/endpoints";
import {startOfWeek,endOfWeek,weekTotal,daysAgo,relativeWhen,groupFor,} from "../utils/dateHelpers";

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  console.log("AppProvider rendered");

  const [screen, setScreen] = useState("splash");
  const [screenData, setScreenData] = useState(null);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
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
    const msg =
      err instanceof ApiError
        ? err.message
        : fallbackMsg || "Something went wrong. Please try again.";

    showToast(msg);
  };

  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhoneState] = useState("");

  const phoneStorageKey = (email) =>
    `goalsave_phone:${(email || "").toLowerCase()}`;

  const setProfilePhone = (value) => {
    setProfilePhoneState(value);

    try {
      if (profileEmail) {
        localStorage.setItem(phoneStorageKey(profileEmail), value || "");
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  // Dashboard totals
  const [totalBalance, setTotalBalance] = useState(0);

  console.log("Current totalBalance state:", totalBalance);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpensesState, setTotalExpenses] = useState(0);

  const loadLocalPhone = (email) => {
    try {
      return localStorage.getItem(phoneStorageKey(email)) || "";
    } catch {
      return "";
    }
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [income, setIncome] = useState(0);
  const [currency, setCurrency] = useState("Nigerian Naira (₦)");
  const [budgetCats, setBudgetCats] = useState([]);
  const [allocations, setAllocations] = useState({});

  // Budgets are the source of truth for all budget-derived totals.
  // Refreshed through a full GET /budgets request after budget changes.
  const [budgets, setBudgets] = useState([]);

  const budgetsByCategory = useMemo(() => {
    const map = {};

    budgets.forEach((budget) => {
      const key = budget.category?.name;

      if (key) {
        map[key] = budget._id;
      }
    });

    return map;
  }, [budgets]);

  const totalAllocated = useMemo(
    () =>
      budgets.reduce(
        (sum, budget) => sum + (budget.amount || 0),
        0
      ),
    [budgets]
  );

  const totalRemaining = useMemo(
    () =>
      budgets.reduce(
        (sum, budget) => sum + (budget.remaining || 0),
        0
      ),
    [budgets]
  );

 const totalSpent = useMemo(
  () =>
    budgets.reduce(
      (sum, budget) => sum + (budget.spent || 0),
      0
    ),
  [budgets]
);

// Total amount actually spent against all budgets.
// Uses the backend-provided `spent` value from each budget.
const totalBudgetSpent = totalSpent;

// This is intentionally based on the backend-provided remaining values.
const budgetRemaining = totalRemaining;

  
  const [notifFilter, setNotifFilter] = useState("All");

  const [
    notificationsBackendAvailable,
    setNotificationsBackendAvailable,
  ] = useState(false);

  const [txFilter, setTxFilter] = useState("All");

  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);

  console.log("APP PROVIDER INSTANCE:", {
    categories,
  });

  /* ------------------------------- ADD WALLET ------------------------------- */

  const [newWalletName, setNewWalletName] = useState("");
  const [walletFormError, setWalletFormError] = useState("");

  const handleCreateWallet = async () => {
    const trimmed = newWalletName.trim();

    if (trimmed.length < 2) {
      setWalletFormError("Wallet name must be at least 2 characters.");
      return;
    }

    setWalletFormError("");
    setApiBusy(true);

    try {
      if (USE_MOCK_DATA) {
        setWallets((w) => [
          ...w,
          {
            _id: `local-${Date.now()}`,
            name: trimmed,
          },
        ]);

        setNewWalletName("");
        goBack();
        return;
      }

      // Create wallet on backend
      await WalletsAPI.create({
        name: trimmed,
      });

      // Get the actual wallets from backend again
      const updatedWallets = await WalletsAPI.list();

      console.log("UPDATED WALLETS:", updatedWallets);

      setWallets(updatedWallets);

      setNewWalletName("");
      goBack();
    } catch (err) {
      console.error("Create Wallet Error:", err);

      setWalletFormError(
        err instanceof ApiError
          ? err.message
          : "Couldn't create this wallet. Please try again."
      );
    } finally {
      setApiBusy(false);
    }
  };


  /* ------------------------------ ADD CATEGORY ------------------------------ */
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("Expense");
  const [categoryFormError, setCategoryFormError] = useState("");

  const handleCreateCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (trimmed.length < 2) {
      setCategoryFormError("Category name must be at least 2 characters.");
      return;
    }
    setCategoryFormError("");

    if (USE_MOCK_DATA) {
      setCategories((c) => [...c, { _id: `local-${Date.now()}`, name: trimmed, type: newCategoryType }]);
      setNewCategoryName("");
      goBack();
      return;
    }

    setApiBusy(true);
    try {
      const created = await CategoriesAPI.create({ name: trimmed, type: newCategoryType });
      setCategories((c) => [...c, created]);
      setNewCategoryName("");
      goBack();
    } catch (err) {
      setCategoryFormError(err instanceof ApiError ? err.message : "Couldn't create this category. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  const formatShortGroupDateStatic = (iso) => {
    const d = new Date(iso + "T00:00:00");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  
  const normalizeTransaction = (t) => {
    if (!t || typeof t !== "object") return t;
    const categoryName = t.category?.name || "Uncategorized";
    const walletName = t.wallet?.name || "";
    const iso = t.transactionDate ? toISODate(new Date(t.transactionDate)) : toISODate(new Date());
    const todayISOStr = toISODate(new Date());
    const yestDateObj = new Date();
    yestDateObj.setDate(yestDateObj.getDate() - 1);
    const yestISOStr = toISODate(yestDateObj);
    const groupLabel =
      iso === todayISOStr ? `Today, ${formatShortGroupDateStatic(iso)}` :
      iso === yestISOStr ? `Yesterday, ${formatShortGroupDateStatic(iso)}` :
      formatShortGroupDateStatic(iso);
    return {
      id: t._id,
      _id: t._id,
      wallet: t.wallet,
      category: t.category,
      type: t.type,
      cat: categoryName,
      name: t.description || categoryName,
      place: walletName || categoryName,
      amount: Number(t.amount) || 0,
      date: iso,
      time: new Date(t.createdAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
      group: groupLabel,
    };
  };

  const mergeTransactionRelations = (transaction, categoryId, walletId) => {
    if (!transaction) return null;

  const pickedCategory = categories.find(
    (c) => (c._id || c.id) === categoryId
  );

  const pickedWallet = wallets.find(
    (w) => (w._id || w.id) === walletId
  );

  return {
    ...transaction,
    category:
      transaction.category?.name
        ? transaction.category
        : pickedCategory || transaction.category,
    wallet:
      transaction.wallet?.name
        ? transaction.wallet
        : pickedWallet || transaction.wallet,
  };
};

  
  const normalizeGoal = (g) => {
    if (!g || typeof g !== "object") return g;
    return {
      ...g,
      id: g._id || g.id,
      name: g.title || g.name,
      target: g.targetAmount ?? g.target,
      saved: g.currentAmount ?? g.saved ?? 0,
      due: g.targetDate || g.due,
    };
  };

  
  const fetchAllTransactions = async () => {
    const limit = 100;
    let page = 1;
    let all = [];
    while (true) {
      const batch = await TransactionsAPI.list({ page, limit });
      if (!Array.isArray(batch) || batch.length === 0) break;
      all = all.concat(batch);
      if (batch.length < limit) break;
      page += 1;
    }
    return all;
  };

  useEffect(() => {
    if (USE_MOCK_DATA) return;
    (async () => {
      try {
        console.log("SECURITY LOAD TEST: starting Promise.all");
        const [
  me,
  dashboard,
  fetchedBudgets,
  tx,
  gl,
  nf,
  sec,
  wl,
  cats,
] = await Promise.all([
  AuthAPI.me().catch(() => null),
  DashboardAPI.get().catch(() => null),
  BudgetAPI.list().catch(() => null),
  fetchAllTransactions().catch(() => null),
  GoalsAPI.list().catch(() => null),
  NotificationsAPI.list().catch(() => null),
  SecurityAPI.get().catch((err) => {
    console.error(
      "SECURITY API ERROR:",
      err
    );

    return null;
  }),
  WalletsAPI.list().catch(() => null),
  CategoriesAPI.list().catch(() => null),
]);
console.log("SECURITY LOAD TEST: Promise.all finished");
console.log("SECURITY LOAD TEST: sec =", sec);
console.log(
  "SECURITY LOAD TEST: sec JSON =",
  JSON.stringify(sec, null, 2)
);

        console.log("========== ALL DATA LOADED ==========");
        console.log("cats from Promise.all:", cats);
        console.log("cats is array:", Array.isArray(cats));

        console.log("WALLETS FROM PROMISE ALL:", wl);
        console.log("WALLETS FROM PROMISE ALL IS ARRAY:", Array.isArray(wl));

        if (Array.isArray(cats)) {
          console.log("SETTING CATEGORIES:", cats);
          setCategories(cats);

          const expenseCategories = cats.filter(
            (c) => c.type === "Expense" && c.isActive !== false
          );

          const realBudgetCats = expenseCategories.map((c) => {
            const existingOption = budgetCategoryOptions.find(
              (option) => option.key === c.name
            );

            return {
              key: c.name,
              label: c.name,
              icon: existingOption?.icon || MoreHorizontal,
              checked: false,
            };
          });

  console.log("REAL BUDGET CATEGORIES:", realBudgetCats);

  setBudgetCats(realBudgetCats);
}

        if (me?.user) {
          const email = me.user.email || "";
          setName(me.user.firstName || me.user.name || me.user.fullName || "");
          setProfileEmail(email);
          setProfilePhoneState(loadLocalPhone(email));
        }

        if (dashboard) {
          console.log("========== DASHBOARD TEST ==========");
          console.log("Dashboard:", dashboard);
          console.log("Dashboard totalBalance:", dashboard?.totalBalance);
          console.log("Dashboard totalIncome:", dashboard?.totalIncome);

          setTotalBalance(dashboard.totalBalance || 0);
          setTotalIncome(dashboard.totalIncome || 0);
          
        }        
        if (Array.isArray(fetchedBudgets)) {
          setBudgets(fetchedBudgets);

          console.log("SETTING BUDGETS:", fetchedBudgets);
          console.log("BUDGET COUNT:", fetchedBudgets.length);

          console.log(
            "REAL BUDGET DATA:",
            JSON.stringify(fetchedBudgets, null, 2)
          );
          if (fetchedBudgets.length > 0) {
            const allocMap = {};
            const savedKeys = new Set();
            fetchedBudgets.forEach((b) => {
              const key = b.category?.name;
              if (!key) return;
              allocMap[key] = b.amount;
              savedKeys.add(key);
            });
            if (Object.keys(allocMap).length) setAllocations((a) => ({ ...a, ...allocMap }));
            setBudgetCats((cs) => cs.map((c) => (savedKeys.has(c.key) ? { ...c, checked: true } : c)));
          }
        }
        if (Array.isArray(tx)) {
          const normalized = tx.map(normalizeTransaction);

          setTransactions(normalized);

          const income = normalized
              .filter(t => t.type === "Income")
              .reduce((sum, t) => sum + Number(t.amount), 0);

          const expense = normalized
              .filter(t => t.type === "Expense")
              .reduce((sum, t) => sum + Number(t.amount), 0);

          setTotalIncome(income);
          
      }
        if (Array.isArray(gl)) setGoals(gl.map(normalizeGoal));
        if (Array.isArray(nf)) {
          setNotifications(nf);
          setNotificationsBackendAvailable(true);
        }
        if (sec) {
          if (sec.biometricEnabled != null) {
            setBiometricEnabled(sec.biometricEnabled);
          }

          if (sec.twoFactorEnabled != null) {
            setTwoFactorEnabled(sec.twoFactorEnabled);
          }
        }
        console.log("ABOUT TO PROCESS WALLETS:", wl)
        if (Array.isArray(wl)) {
          console.log("========== SETTING WALLETS ==========");
          console.log("wl:", wl);
          console.log("wl length:", wl.length);

          setWallets(wl);

          console.log("WALLETS BEING SET:", wl);
        }
        if (Array.isArray(cats)) {
          console.log("========== CATEGORIES TEST ==========");
          console.log("cats:", cats);
          console.log("cats length:", cats.length);
          console.log("first category:", cats[0]);

          console.log(">>> CALLING setCategories NOW <<<");

          setCategories(cats);

          console.log(">>> setCategories WAS CALLED <<<");
        }
      } catch (err) {
        console.error("========== APP DATA LOAD ERROR ==========");
        console.error(err);
        reportApiError(err, "Couldn't load your data from the server.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 const navigate = (next, data = null) => {
  setHistory((h) => [...h, screen]);
  setScreenData(data);
  setScreen(next);
};
  const goToTab = (tab) => {
  setHistory([]);
  setScreenData(null);

  if (tab === "budgetHub") {
    setBudgetStep(1);
  }

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

   
  
  const totalExpenses = useMemo(
    () => transactions.filter((t) => !t.type || t.type === "Expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
 
 

  /* ------------------------------- LOGIN ------------------------------- */
  const [phone, setPhone] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [pin, setPin] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleForgotPassword = async () => {
    showToast("Password reset isn't available yet. Please contact support.");
  };

  const handleLogin = async () => {
    if (!loginEmail.trim() && !pin.trim()) {
      setLoginError("Email and password are required.");
      return;
    }
    if (!loginEmail.trim()) {
      setLoginError("Email address is required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(loginEmail.trim())) {
      setLoginError("Enter a valid email address.");
      return;
    }
    if (!pin.trim()) {
      setLoginError("Password is required.");
      return;
    }
    setLoginError("");

    if (USE_MOCK_DATA) {
      setProfileEmail(loginEmail.trim());
      goToTab("dashboard");
      return;
    }

    setApiBusy(true);
    try {
      const data = await AuthAPI.login({ email: loginEmail.trim(), password: pin });
      if (data?.user) {
        const email = data.user.email || loginEmail.trim();
        setName(data.user.firstName || data.user.name || data.user.fullName || "");
        setProfileEmail(email);
        setProfilePhoneState(loadLocalPhone(email));
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
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupErrors, setSignupErrors] = useState({});

  const validatePassword = (pw) => pw.length >= 8 && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);

  const handleCreateAccount = async () => {
    const errs = {};
    if (!name.trim()) errs.name = "First name is required.";
    if (!lastName.trim()) errs.lastName = "Last name is required.";
    if (!signupEmail.trim()) errs.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(signupEmail.trim())) errs.email = "Enter a valid email address.";
    if (!signupPassword.trim()) errs.password = "Password is required.";
    else if (!validatePassword(signupPassword)) errs.password = "Password doesn't meet the requirements below.";
    setSignupErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (USE_MOCK_DATA) {
      setProfileEmail(signupEmail.trim());
      setProfilePhone(signupPhone.trim());
      navigate("otp");
      return;
    }

    setApiBusy(true);
    try {
      const data = await AuthAPI.signup({
        firstName: name.trim(),
        lastName: lastName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      });
      const email = data?.user?.email || signupEmail.trim();
      if (data?.user) {
        setName(data.user.firstName || name.trim());
      }
      setProfileEmail(email);
     
     
      const phoneVal = signupPhone.trim();
      setProfilePhoneState(phoneVal);
      try {
        localStorage.setItem(phoneStorageKey(email), phoneVal);
      } catch {
        
      }
      navigate("income");
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
    navigate("income");
  };

  const handleResendOtp = async () => {
    setResendSeconds(45);
    showToast("A new code has been sent.");
  };

  /* ---------------------------- CURRENCY CHOICE --------------------------- */
  const currencies = ["Nigerian Naira (\u20A6)", "US Dollar ($)", "Euro (\u20AC)", "British Pound (\u00A3)"];

  /* ------------------------- BUDGET CREATION WIZARD ------------------------ */
  const [budgetStep, setBudgetStep] = useState(1);
  const [incomeType, setIncomeType] = useState("Salary");
  const customIncomeInputRef = useRef(null);
  const steps = ["Income", "Categories", "Review", "Complete"];

  const toggleCat = (key) => setBudgetCats((cs) => cs.map((c) => (c.key === key ? { ...c, checked: !c.checked } : c)));

 
  const wizardTotalAllocated = useMemo(
    () => budgetCats.filter((c) => c.checked).reduce((s, c) => s + (allocations[c.key] || 0), 0),
    [budgetCats, allocations]
  );

 
  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: toISODate(start), endDate: toISODate(end) };
  };

 
  const resolveCategoryId = async (categoryName, type = "Expense") => {
    const existing = categories.find(
      (c) => (c.name || "").toLowerCase() === categoryName.toLowerCase() && c.type === type
    );
    if (existing) return existing._id || existing.id;
    try {
      const created = await CategoriesAPI.create({ name: categoryName, type });
      setCategories((cs) => [...cs, created]);
      return created._id || created.id;
    } catch (err) {
      const fresh = await CategoriesAPI.list().catch(() => null);
      if (Array.isArray(fresh)) {
        setCategories(fresh);
        const match = fresh.find(
          (c) => (c.name || "").toLowerCase() === categoryName.toLowerCase() && c.type === type
        );
        if (match) return match._id || match.id;
      }
      throw err;
    }
  };

 
  const handleFinishBudget = async () => {
    if (!USE_MOCK_DATA) {
      const { startDate, endDate } = getCurrentMonthRange();

      const selected = budgetCats.filter(
        (c) => c.checked && allocations[c.key] > 0
      );

      if (selected.length === 0) {
        showToast(
          "No categories with an allocation to save — add an amount first."
        );
        return;
      }

      try {
        await Promise.all(
          selected.map(async (c) => {
            const categoryId = await resolveCategoryId(
              c.key,
              "Expense"
            );

            const payload = {
              title: `${c.key} Budget`,
              category: categoryId,
              amount: allocations[c.key],
              startDate,
              endDate,
            };

            const existingId = budgetsByCategory[c.key];

            try {
              if (existingId) {
                await BudgetAPI.update(existingId, payload);
              } else {
                await BudgetAPI.create(payload);
              }
            } catch (err) {
              const isPeriodConflict =
                err instanceof ApiError &&
                err.status === 409 &&
                /already exists for this period/i.test(
                  err.message || ""
                );

              if (!isPeriodConflict) {
                throw err;
              }

              const fresh = await BudgetAPI.list().catch(
                () => null
              );

              const match = Array.isArray(fresh)
                ? fresh.find(
                    (b) => b.category?.name === c.key
                  )
                : null;

              if (!match) {
                throw err;
              }

              await BudgetAPI.update(
                match._id,
                payload
              );
            }
          })
        );

        const fresh = await BudgetAPI.list();

        if (Array.isArray(fresh)) {
          setBudgets(fresh);
        }

        showToast("Your budget has been saved.");

        // IMPORTANT:
        // Stay inside the wizard and show the Complete screen.
        setBudgetStep(4);

      } catch (err) {
        console.error(
          "Save budget error:",
          err
        );

        reportApiError(
          err,
          "Couldn't save your budget. Please try again."
        );

        // Do NOT move to Step 4 if saving failed.
        return;
      }
    } else {
      // Mock-data mode still needs to reach the Complete screen.
      setBudgetStep(4);
    }
  };

  /* -------------------------------- DASHBOARD ------------------------------ */
  
  const CATEGORY_FALLBACK_COLORS = ["#16A34A", "#F5A524", "#20B0C4", "#E23FA0", "#9B59B6", "#101B3D"];

  const spendingBreakdown = useMemo(() => {
    const totals = {};
    transactions.forEach((t) => {
      
      if (t.type && t.type !== "Expense") return;
      const key = t.cat || "Uncategorized";
      totals[key] = (totals[key] || 0) + (Number(t.amount) || 0);
    });
    const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);
    if (totalSpent === 0) return [];
    const top5 = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return top5.map(([cat, amount], i) => ({
      cat,
      pct: Math.round((amount / totalSpent) * 100),
      color: CATEGORY_FALLBACK_COLORS[i % CATEGORY_FALLBACK_COLORS.length],
    }));
  }, [transactions]);
  const donutGradient = (() => {
    
    if (spendingBreakdown.length === 0) return "conic-gradient(#D9D9D9 0% 100%)";
    let acc = 0;
    const parts = spendingBreakdown.map((s) => {
      const start = acc; acc += s.pct;
      return `${s.color} ${start}% ${acc}%`;
    });
    return `conic-gradient(${parts.join(",")})`;
  })();

  
  const emergency = goals.find((g) => g.name === "Emergency Fund") || {
    id: null,
    name: "Emergency Fund",
    saved: 0,
    target: 1, // prevent divide-by-zero
    due: "-",
  };
  

  /* ------------------------------- ADD EXPENSE ------------------------------ */
  const [expAmount, setExpAmount] = useState("");
  
  const [expAccount, setExpAccount] = useState("");
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [expCat, setExpCat] = useState("");
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

  const handleUpdateTransaction = async (transactionId, payload) => {
  console.log("================================");
  console.log("UPDATING TRANSACTION");
  console.log("Transaction ID:", transactionId);
  console.log("Update Payload:", payload);
  console.log("================================");

  if (!transactionId) {
    reportApiError(null, "Transaction ID is missing.");
    return false;
  }

  setApiBusy(true);

  try {
    const updated = await TransactionsAPI.update(
      transactionId,
      payload
    );

    console.log("UPDATED TRANSACTION FROM API:", updated);

    if (updated) {
      setTransactions((current) =>
        current.map((t) =>
          t.id === transactionId ||
          t._id === transactionId
            ? normalizeTransaction(updated)
            : t
        )
      );
    }

    // Refresh wallets because editing a transaction
    // can change the wallet balance.
    const updatedWallets = await WalletsAPI.list();

    console.log(
      "UPDATED WALLETS AFTER TRANSACTION UPDATE:",
      updatedWallets
    );

    setWallets(
      Array.isArray(updatedWallets)
        ? updatedWallets.map(normalizeWallet)
        : []
    );

    // Refresh savings goals because a savings contribution
    // may have been changed.
    const updatedGoals = await GoalsAPI.list();

    console.log(
      "UPDATED GOALS AFTER TRANSACTION UPDATE:",
      updatedGoals
    );

    setGoals(
      Array.isArray(updatedGoals)
        ? updatedGoals.map(normalizeGoal)
        : []
    );

    // Refresh dashboard totals.
    const updatedDashboard =
      await DashboardAPI.get();

    console.log(
      "UPDATED DASHBOARD AFTER TRANSACTION UPDATE:",
      updatedDashboard
    );

    if (updatedDashboard) {
      setDashboard(updatedDashboard);

      if (
        updatedDashboard.totalBalance !== undefined
      ) {
        setTotalBalance(
          updatedDashboard.totalBalance
        );
      }
    }

    console.log(
      "TRANSACTION UPDATE COMPLETED SUCCESSFULLY"
    );

    return true;

  } catch (err) {
    console.error(
      "UPDATE TRANSACTION ERROR:",
      err
    );

    reportApiError(
      err,
      "Couldn't update the transaction."
    );

    return false;

  } finally {
    setApiBusy(false);
  }
};


const handleSaveExpense = async () => {
  console.log("1. handleSaveExpense started");

  if (!expAmount) {
    console.log("No amount entered");
    return;
  }

  const isSavingsContribution =
    screenData?.type === "savingsContribution";

  // Savings contributions still need an Expense category
  // because the Transaction model requires one.
  let categoryId = expCat;

  if (isSavingsContribution) {
  let savingsCategory = categories.find(
    (c) =>
      c.type === "Expense" &&
      c.isActive !== false &&
      (
        c.name === "Savings" ||
        c.name === "Savings Contribution"
      )
  );

  if (!savingsCategory) {
    console.log(
      "Savings category not found. Creating it..."
    );

    try {
      savingsCategory = await CategoriesAPI.create({
        name: "Savings",
        type: "Expense",
        color: "#14AD4C",
        icon: "piggy-bank",
      });

      console.log(
        "Savings category created:",
        savingsCategory
      );

      setCategories((cs) => [
        ...cs,
        savingsCategory,
      ]);
    } catch (categoryError) {
      console.error(
        "Failed to create Savings category:",
        categoryError
      );

      reportApiError(
        categoryError,
        "Couldn't create the Savings category."
      );

      return;
    }
  }

  categoryId =
    savingsCategory._id ||
    savingsCategory.id;

  console.log(
    "Using Savings category:",
    savingsCategory
  );
}
  if (!expAccount || !categoryId) {
    console.log("Wallet or category missing");

    reportApiError(
      null,
      "Please choose a wallet and category."
    );

    return;
  }

  const payload = {
    wallet: expAccount,
    category: categoryId,
    type: "Expense",
    amount: Number(expAmount),
    description: isSavingsContribution
      ? `Savings contribution: ${
          screenData?.goal?.title ||
          screenData?.goal?.name ||
          "Savings Goal"
        }`
      : expNote || "",
    transactionDate: expDate,
  };

  console.log(
    "Savings contribution:",
    isSavingsContribution
  );

  console.log(
    "Final Expense Payload:",
    payload
  );

  if (
    isSavingsContribution &&
    screenData?.goal
  ) {
    const goalId =
      screenData.goal.id ||
      screenData.goal._id;

    if (goalId) {
      payload.savingsGoal = goalId;
    }
  }

  console.log("Final Payload:", payload);

  setApiBusy(true);

  try {
    console.log("Calling API...");

    const created =
      await TransactionsAPI.create(payload);

    console.log("API returned:", created);

    // Refresh budgets because this expense may have changed
    // the backend-computed `spent`, `remaining`, and `percentageUsed`.
    const updatedBudgets = await BudgetAPI.list();
    console.log(
      "UPDATED BUDGETS AFTER EXPENSE:",
      JSON.stringify(updatedBudgets, null, 2)
    );

    if (Array.isArray(updatedBudgets)) {
      setBudgets(updatedBudgets);
    }

    const merged = mergeTransactionRelations(
      created,
      categoryId,
      expAccount
    );

    if (merged) {
      setTransactions((t) => [
        normalizeTransaction(merged),
        ...t,
      ]);
    }

    // Refresh budget statistics so Dashboard reflects the new expense.
    if (!USE_MOCK_DATA) {
      const updatedBudgets = await BudgetAPI.list();

      if (Array.isArray(updatedBudgets)) {
        setBudgets(updatedBudgets);
      }
    }

    if (isSavingsContribution) {
      // refresh goals only
      const updatedGoals = await GoalsAPI.list();

      setGoals(updatedGoals.map(normalizeGoal));
    }

    // refresh wallets for EVERY expense
    const updatedWallets = await WalletsAPI.list();

    if (Array.isArray(updatedWallets)) {
      setWallets(updatedWallets);

      const newTotalBalance = updatedWallets.reduce(
        (sum, wallet) => sum + Number(wallet.balance || 0),
        0
      );

      console.log("UPDATED WALLETS:", updatedWallets);
      console.log("NEW TOTAL BALANCE:", newTotalBalance);

      setTotalBalance(newTotalBalance);
    }

    // refresh dashboard for EVERY transaction
    const updatedDashboard = await DashboardAPI.get();

    if (updatedDashboard) {
      console.log("UPDATED DASHBOARD:", updatedDashboard);

      setTotalBalance(updatedDashboard.totalBalance || 0);
      setTotalIncome(updatedDashboard.totalIncome || 0);
    }

    setExpAmount("");
    setExpNote("");

    goToTab(
      isSavingsContribution
        ? "goals"
        : "transactions"
    );

  } catch (err) {
    console.error(
      "Save Expense Error:",
      err
    );

    reportApiError(
      err,
      isSavingsContribution
        ? "Couldn't save this contribution. Please try again."
        : "Couldn't save expense."
    );

  } finally {
    setApiBusy(false);
  }
};  

/* -------------------------------- ADD INCOME ------------------------------- */
  const [incAmount, setIncAmount] = useState("");
  
  const [incSource, setIncSource] = useState("Salary");
  const [incAccount, setIncAccount] = useState("");
  const [incCat, setIncCat] = useState("");
  const [incNote, setIncNote] = useState("");
  const [incDate, setIncDate] = useState(() => toISODate(new Date()));
  const incomeSources = ["Salary", "Business", "Gift", "Investment", "Other"];

  const handleSaveIncome = async () => {
    console.log("handleSaveIncome called");
    if (!incAmount) return;
    const amt = Number(incAmount);
    console.log({
      incAccount,
      incCat,
      incAmount,
      incDate,
    });

    if (USE_MOCK_DATA) {
      setTotalIncome((t) => t + amt);
      showToast(`${fmtNShort(amt)} added to your total income.`);
      setIncAmount(""); setIncNote("");
      goToTab("dashboard");
      return;
    }

    
    if (!incAccount || !incCat) {
      reportApiError(null, "Please choose a wallet and category before saving.");
      return;
    }

    setApiBusy(true);
    try {
      const created = await TransactionsAPI.create({
        wallet: incAccount,
        category: incCat,
        type: "Income",
        amount: amt,
        description: incNote ? `${incSource}: ${incNote}` : incSource,
        transactionDate: incDate,
      });
      
      const merged = mergeTransactionRelations(created, incCat, incAccount);

      if (merged) {
        setTransactions((t) => [normalizeTransaction(merged), ...t]);
      }
      
      setTotalIncome((t) => t + amt);
      setTotalBalance((b) => b + amt);
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
  const dailyBudget = useMemo(() => {
    if (!totalAllocated || totalAllocated <= 0) return 0;

    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    return totalAllocated / daysInMonth;
  }, [totalAllocated]);
    const spentToday = transactions
      .filter((t) => t.group.startsWith("Today") && (!t.type || t.type === "Expense"))
      .reduce((s, t) => s + t.amount, 0);

  /* --------------------------- WEEKLY  ------------------------- */
  
  const spentThisWeek = useMemo(() => {
    const now = new Date();
    return weekTotal(transactions, startOfWeek(now), endOfWeek(now));
  }, [transactions]);

  const weeklyBudget = dailyBudget * 7;

  // Real expense totals for the current week and the 3 before it (oldest
  // first), for Transactions.jsx's bar chart — replaces the old hardcoded
  // [53, 72, 53, 96] px array.
  const weeklySpendTrend = useMemo(() => {
    const now = new Date();
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const ref = new Date(now);
      ref.setDate(ref.getDate() - i * 7);
      weeks.push(weekTotal(transactions, startOfWeek(ref), endOfWeek(ref)));
    }
    return weeks;
  }, [transactions]);

  /* -------------------------------- ANALYTICS ------------------------------- */
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [analyticsPeriod, setAnalyticsPeriod] = useState("Monthly");
  const [analyticsMonthIndex, setAnalyticsMonthIndex] = useState(() => new Date().getMonth());
  const [analyticsYear, setAnalyticsYear] = useState(() => new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Was a hardcoded [22, 46, 18, 52, 30, 60, 24] array that never changed
  // regardless of which month was selected. Real replacement: for the
  // selected analytics month/year, sum real expense transactions per
  // weekday (Mon..Sun) — shows the actual weekday spending pattern for
  // that month rather than fabricated numbers. Reuses the same
  // Mon-Sun weekday indexing as startOfWeek elsewhere in this file.
  const weeklyTrend = useMemo(() => {
    const totals = [0, 0, 0, 0, 0, 0, 0]; // Mon..Sun
    transactions.forEach((t) => {
      if (t.type && t.type !== "Expense") return;
      const d = new Date(t.date + "T00:00:00");
      if (d.getFullYear() !== analyticsYear || d.getMonth() !== analyticsMonthIndex) return;
      const day = d.getDay(); // 0 = Sun
      const idx = day === 0 ? 6 : day - 1; // Mon=0 .. Sun=6
      totals[idx] += Number(t.amount) || 0;
    });
    return totals;
  }, [transactions, analyticsYear, analyticsMonthIndex]);

  // Was a hardcoded [30, 38, 26, 34, 58, 44, 40] array, same problem. Real
  // replacement: real weekly expense totals (Mon-start calendar weeks,
  // reusing startOfWeek/endOfWeek/weekTotal already defined above for
  // weeklyBudget) for every week that overlaps the selected month, in
  // chronological order. Number of weeks varies 4-6 depending on the
  // month, unlike the old fixed 7-point array.
  const monthlyTrend = useMemo(() => {
    const monthStart = new Date(analyticsYear, analyticsMonthIndex, 1);
    const monthEnd = new Date(analyticsYear, analyticsMonthIndex + 1, 0);
    const weeks = [];
    let cursor = startOfWeek(monthStart);
    while (cursor <= monthEnd) {
      weeks.push(weekTotal(transactions, cursor, endOfWeek(cursor)));
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + 7);
    }
    return weeks;
  }, [transactions, analyticsYear, analyticsMonthIndex]);

  const monthWeekLabels = useMemo(
    () => monthlyTrend.map((_, i) => `W${i + 1}`),
    [monthlyTrend]
  );

  const activeTrend = analyticsPeriod === "Weekly" ? weeklyTrend : monthlyTrend;
  const activeLabels = analyticsPeriod === "Weekly" ? dayLabels : monthWeekLabels;

  // Month-scoped spending breakdown/donut for Analytics.jsx — the
  // all-time spendingBreakdown/donutGradient above are for Dashboard's
  // "Spending Overview" card and stay all-time on purpose. Analytics has
  // its own month selector (goToPrevMonth/goToNextMonth/analyticsYear/
  // analyticsMonthIndex) that previously had no effect on the donut or
  // category list at all — switching months only moved the trend chart.
  // Same top-5-by-amount logic as spendingBreakdown, just filtered to the
  // selected month/year first.
  const analyticsSpendingBreakdown = useMemo(() => {
    const totals = {};
    transactions.forEach((t) => {
      if (t.type && t.type !== "Expense") return;
      const d = new Date(t.date + "T00:00:00");
      if (d.getFullYear() !== analyticsYear || d.getMonth() !== analyticsMonthIndex) return;
      const key = t.cat || "Uncategorized";
      totals[key] = (totals[key] || 0) + (Number(t.amount) || 0);
    });
    const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);
    if (totalSpent === 0) return [];
    const top5 = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return top5.map(([cat, amount], i) => ({
      cat,
      pct: Math.round((amount / totalSpent) * 100),
      color: CATEGORY_FALLBACK_COLORS[i % CATEGORY_FALLBACK_COLORS.length],
    }));
  }, [transactions, analyticsYear, analyticsMonthIndex]);

  const analyticsDonutGradient = (() => {
    if (analyticsSpendingBreakdown.length === 0) return "conic-gradient(#D9D9D9 0% 100%)";
    let acc = 0;
    const parts = analyticsSpendingBreakdown.map((s) => {
      const start = acc; acc += s.pct;
      return `${s.color} ${start}% ${acc}%`;
    });
    return `conic-gradient(${parts.join(",")})`;
  })();

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
  const others = goals.filter((g) => g.id !== emergency.id);

  const addContribution = async (goalId, amount) => {
  const amt = Number(amount);

  if (!amt || !goalId) return;

  const g = goals.find((x) => x.id === goalId);

  if (USE_MOCK_DATA) {
    setGoals((gs) =>
      gs.map((x) =>
        x.id === goalId
          ? { ...x, saved: x.saved + amt }
          : x
      )
    );

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setContributionHistory((h) => [
      {
        id: Date.now(),
        goalName: g ? g.name : "Goal",
        amount: amt,
        time,
      },
      ...h,
    ]);

    return;
  }

  navigate("addExpense", {
    type: "savingsContribution",
    goal: g,
  });
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
      // Backend expects title and targetAmount
      // the 400 response from POST /savings) — NOT `name`/`target`.
      const created = await GoalsAPI.create({ title: newGoalName.trim(), targetAmount: Number(newGoalTarget) });
      // Normalize the return goal.
      const normalized = created ? { ...localGoal, ...normalizeGoal(created) } : localGoal;
      setGoals((gs) => [...gs, normalized]);
      setNewGoalName(""); setNewGoalTarget(""); setShowAddGoal(false);
    } catch (err) {
      reportApiError(err, "Couldn't create this goal. Please try again.");
      setApiBusy(false);
    }
  };

  /* ------------------------------ NOTIFICATIONS ----------------------------- */
  // There is NO backend /notifications module — confirmed earlier: none of
  // NotificationsAPI's routes (/notifications, /notifications/:id,
  // /notifications/read-all) exist in routes/, controllers/, services/, or
  // models/. So `notifications` state (seeded from buildInitialNotifications)
  // would otherwise show the same fixed mock entries forever, even in live
  // mode, since NotificationsAPI.list() always 404s and gets swallowed by
  // .catch(() => null) in the initial load effect.
  //
  // Until that backend module exists, this generates notifications directly
  // from real data already confirmed elsewhere in this file: budgets (with
  // backend-computed percentageUsed), transactions, and goal contributions.
  // "Security" notifications are omitted entirely — SecurityAPI is equally
  // unbuilt, so there's no real security event to report; showing an empty
  // category would misleadingly imply monitoring that doesn't exist.
  //
  // The two thresholds below are frontend display heuristics, not backend
  // facts — there's no "large transaction" or "alert" concept on the
  // backend to derive them from. Adjust freely; they only decide which
  // notifications get synthesized, nothing is persisted from this.
  const BUDGET_ALERT_THRESHOLD_PCT = 90;
  const LARGE_TRANSACTION_THRESHOLD = 50000;
  const BILLS_LOOKBACK_DAYS = 30;

  
  const generatedNotifications = useMemo(() => {
    const items = [];

   // Budget alerts
    budgets.forEach((b) => {
      if ((b.percentageUsed || 0) >= BUDGET_ALERT_THRESHOLD_PCT) {
        items.push({
          id: `budget-alert-${b._id}`,
          cat: "Alerts",
          type: "Budget Alert",
          body: `You've used ${b.percentageUsed}% of your ${b.category?.name || "budget"} budget.`,
          icon: AlertTriangle,
          unread: true,
          relatedCategory: b.category?.name || null,
          when: relativeWhen(b.updatedAt || b.startDate),
          group: groupFor(b.updatedAt || b.startDate),
        });
      }
    });

    // Large expense alerts
    transactions.forEach((t) => {
      if (t.type && t.type !== "Expense") return;
      if ((t.amount || 0) < LARGE_TRANSACTION_THRESHOLD) return;
      items.push({
        id: `large-tx-${t.id || t._id}`,
        cat: "Alerts",
        type: "Large Transaction",
        body: `${fmtNShort(t.amount)} spent on ${t.cat || "Uncategorized"}.`,
        icon: AlertTriangle,
        unread: true,
        relatedCategory: t.cat || null,
        when: relativeWhen(t.date),
        group: groupFor(t.date),
      });
    });

    // Recent bill payments
    transactions.forEach((t) => {
      if (t.type && t.type !== "Expense") return;
      if (t.cat !== "Bills") return;
      if (daysAgo(t.date) > BILLS_LOOKBACK_DAYS) return;
      items.push({
        id: `bill-${t.id || t._id}`,
        cat: "Bills",
        type: "Bill Payment",
        body: `${t.name || t.place || "Bill"} — ${fmtNShort(t.amount)}.`,
        icon: Receipt,
        unread: false,
        relatedCategory: "Bills",
        when: relativeWhen(t.date),
        group: groupFor(t.date),
      });
    });

    
    contributionHistory.forEach((c) => {


      items.push({
        id: `goal-contrib-${c.id}`,
        cat: "Goals",
        type: "Goal Contribution",
        body: `You added ${fmtNShort(c.amount)} to ${c.goalName}.`,
        icon: HandCoins,
        unread: false,
        relatedCategory: null,
        when: c.time || "Today",
        group: "Today",
      });
    });

goals.forEach((g) => {
  if (g.target > 0 && g.saved >= g.target) {
    items.push({
      id: `goal-complete-${g.id}`,
      cat: "Goals",
      type: "Goal Reached",
      body: `You've reached your ${g.name} goal!`,
      icon: HandCoins,
      unread: false,
      relatedCategory: null,
      when: "",
      group: "Earlier",
    });
  }
});

    return items;
  }, [budgets, transactions, contributionHistory, goals]);

  // Mock mode keeps the original seeded mock notifications
  // (buildInitialNotifications) so the demo/offline experience is
  // unchanged. Live mode prefers real backend notifications the moment
  // that module exists (notificationsBackendAvailable), and falls back to
  // the real-data-generated list until then.
  const activeNotifications = USE_MOCK_DATA
    ? notifications
    : (notificationsBackendAvailable ? notifications : generatedNotifications);
  const unreadCount = activeNotifications.filter((n) => n.unread).length;
  const filteredNotifs = notifFilter === "All" ? activeNotifications : activeNotifications.filter((n) => n.cat === notifFilter);
  const notifGrouped = filteredNotifs.reduce((acc, n) => { (acc[n.group] = acc[n.group] || []).push(n); return acc; }, {});

  const handleMarkNotificationRead = (id) => {
    if (USE_MOCK_DATA) {
      setNotifications((ns) => ns.map((x) => (x.id === id ? { ...x, unread: false } : x)));
      return;
    }
    if (notificationsBackendAvailable) {
      setNotifications((ns) => ns.map((x) => (x.id === id ? { ...x, unread: false } : x)));
      NotificationsAPI.markRead(id).catch((err) => reportApiError(err, "Couldn't update this notification."));
      return;
    }
    // Generated notifications re-derive fresh from real data every render
    // (see generatedNotifications above) — they aren't stored state, so
    // there's nothing persistable to mark read until the real backend
    // module exists.
  };

  const handleMarkAllNotificationsRead = () => {
    if (USE_MOCK_DATA) {
      setNotifications((ns) => ns.map((x) => ({ ...x, unread: false })));
      return;
    }
    if (notificationsBackendAvailable) {
      setNotifications((ns) => ns.map((x) => ({ ...x, unread: false })));
      NotificationsAPI.markAllRead().catch((err) => reportApiError(err, "Couldn't mark all as read."));
      return;
    }
  };

  /* -------------------------------- PROFILE --------------------------------- */
  const handleSaveProfile = async () => {
    setIsEditingProfile(false);
    if (USE_MOCK_DATA) return;
    try {
      await ProfileAPI.update({ firstName: name, email: profileEmail });
    } catch (err) {
      reportApiError(err, "Couldn't save your profile changes.");
    }
  };

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
    screen,
    setScreen,
    screenData,
    setScreenData,
    history,
    setHistory,
    name,
    setName,
    darkMode,
    setDarkMode,
    biometricEnabled,
    setBiometricEnabled,
    twoFactorEnabled,
    setTwoFactorEnabled,
    toast,
    setToast,
    showToast,
    profileEmail,
    setProfileEmail,
    profilePhone,
    setProfilePhone,
    isEditingProfile,
    setIsEditingProfile,
    transactions,
    setTransactions,
    goals,
    setGoals,
    notifications,
    setNotifications,
    income,
    setIncome,
    currency,
    setCurrency,
    budgetCats,
    setBudgetCats,
    allocations,
    setAllocations,
    budgets,
    setBudgets,
    budgetsByCategory,
    notifFilter,
    setNotifFilter,
    txFilter,
    setTxFilter,

    navigate,
    goToTab,
    goBack,

    totalBalance,
    setTotalBalance,
    totalIncome,
    setTotalIncome,
    totalExpenses,
    totalAllocated,
    wizardTotalAllocated,
    totalBudgetSpent,
    budgetRemaining,

    phone,
    setPhone,
    pin,
    setPin,

    showLoginPw,
    setShowLoginPw,
    rememberPassword,
    setRememberPassword,
    loginError,
    setLoginError,
    handleLogin,

    showPw,
    setShowPw,

    lastName,
    setLastName,
    loginEmail,
    setLoginEmail,

    signupEmail,
    setSignupEmail,
    signupPhone,
    setSignupPhone,
    signupPassword,
    setSignupPassword,
    signupErrors,
    setSignupErrors,
    validatePassword,
    handleCreateAccount,
    clearErr,

    otp,
    setOtp,
    otpError,
    handleVerifyOtp,
    handleResendOtp,
    resendSeconds,
    setResendSeconds,

    currencies,

    budgetStep,
    setBudgetStep,
    incomeType,
    setIncomeType,
    customIncomeInputRef,
    steps,
    toggleCat,

    spendingBreakdown,
    donutGradient,
    analyticsSpendingBreakdown,
    analyticsDonutGradient,

    emergency,
    unreadCount,

    expAmount,
    setExpAmount,
    expAccount,
    setExpAccount,
    showAccountDropdown,
    setShowAccountDropdown,
    expCat,
    setExpCat,
    expNote,
    setExpNote,
    expDate,
    setExpDate,

    ordinal,
    formatLongDate,
    formatShortGroupDate,
    addExpenseCats,

    incAmount,
    setIncAmount,
    incSource,
    setIncSource,
    incAccount,
    setIncAccount,
    incCat,
    setIncCat,
    incNote,
    setIncNote,
    incDate,
    setIncDate,
    incomeSources,

    txSearch,
    setTxSearch,
    txSortNewest,
    setTxSortNewest,
    searchedTx,
    catFilteredTx,
    filteredTx,
    grouped,

    dailyBudget,
    spentToday,
    weeklyBudget,
    spentThisWeek,
    weeklySpendTrend,
    monthlyTrend,
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

    apiBusy,

    handleForgotPassword,
    handleFinishBudget,
    handleSaveExpense,
    handleSaveIncome,
    handleUpdateTransaction,
    handleCreateGoal,
    handleMarkNotificationRead,
    handleMarkAllNotificationsRead,

    handleSaveProfile,
    handleToggleBiometric,
    handleEnableBiometric,
    handleToggleTwoFactor,

    wallets,
    categories,

    newWalletName,
    setNewWalletName,
    walletFormError,
    handleCreateWallet,

    newCategoryName,
    setNewCategoryName,
    newCategoryType,
    setNewCategoryType,
    categoryFormError,
    handleCreateCategory,
  };

    return (
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    );
}