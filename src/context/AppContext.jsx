import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from "react";
import { Target, AlertTriangle, Receipt, HandCoins, Tag } from "lucide-react";
import { buildInitialTransactions, buildInitialGoals, buildInitialNotifications, budgetCategoryOptions } from "../data";
import { toISODate, formatTime } from "../utils";
import { fmtNShort } from "../theme";
import { USE_MOCK_DATA, ApiError } from "../api/client";
import { AuthAPI, ProfileAPI, BudgetAPI, TransactionsAPI, WalletsAPI, CategoriesAPI, GoalsAPI, NotificationsAPI, SecurityAPI } from "../api/endpoints";
// WalletsAPI/CategoriesAPI now also used for creation (handleCreateWallet /
// handleCreateCategory below), not just the initial list fetch.
// NOTE: IncomeAPI import removed — /income doesn't exist on the backend.
// Income is now logged through TransactionsAPI.create() with type: "Income",
// same as expenses, per transaction.validator.js.

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [screen, setScreen] = useState("splash");
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
    const msg = err instanceof ApiError ? err.message : fallbackMsg || "Something went wrong. Please try again.";
    showToast(msg);
  };
  const [profileEmail, setProfileEmail] = useState("");
  // Phone has no home on this backend (the user model only has firstName,
  // lastName, email) — so it's kept purely local, persisted to localStorage
  // under the current user's email so it survives refreshes on this browser.
  // It intentionally starts blank; PersonalInfo shows "Not provided" until
  // the user has entered one (at signup or by editing their profile).
  const [profilePhone, setProfilePhoneState] = useState("");
  const phoneStorageKey = (email) => `goalsave_phone:${(email || "").toLowerCase()}`;
  const setProfilePhone = (value) => {
    setProfilePhoneState(value);
    try {
      if (profileEmail) localStorage.setItem(phoneStorageKey(profileEmail), value || "");
    } catch {
      /* ignore storage errors (e.g. private browsing) */
    }
  };
  const loadLocalPhone = (email) => {
    try {
      return localStorage.getItem(phoneStorageKey(email)) || "";
    } catch {
      return "";
    }
  };
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [transactions, setTransactions] = useState(buildInitialTransactions);
  const [goals, setGoals] = useState(buildInitialGoals);
  const [notifications, setNotifications] = useState(buildInitialNotifications);
  const [income, setIncome] = useState(0);
  const [currency, setCurrency] = useState("Nigerian Naira (\u20A6)");
  const [budgetCats, setBudgetCats] = useState(budgetCategoryOptions);
  const [allocations, setAllocations] = useState({ Food: 60000, Transport: 30000, Housing: 80000, Utilities: 20000, Entertainment: 15000, Others: 10000 });
  // Raw array of Budget documents as returned by GET /budgets — confirmed
  // against budget.service.js: getBudgets() always populates `category`
  // ({ _id, name, color, icon }) and includes backend-computed
  // `spent`/`remaining`/`percentageUsed`/`status` per budget (from
  // calculateBudgetStats, which aggregates real Transaction documents
  // matching that budget's exact category + date range + type "Expense").
  // This is the single source of truth — budgetsByCategory, totalAllocated,
  // and totalBudgetSpent are all derived from it below rather than being
  // separately tracked state that can drift out of sync. Refreshed via a
  // full GET /budgets refetch after every create/update, since POST and
  // PATCH responses are confirmed to return incomplete shapes (POST:
  // category unpopulated, no stats; PATCH: stats included but category
  // still unpopulated) — neither is safe to merge in directly.
  const [budgets, setBudgets] = useState([]);
  // Keyed by budgetCats `key` (e.g. "Food") -> that budget's backend _id.
  // Category names are set to the budgetCats key itself at creation time
  // (see handleFinishBudget), so this matches directly on b.category.name
  // with no fallback/guessing needed.
  const budgetsByCategory = useMemo(() => {
    const map = {};
    budgets.forEach((b) => {
      const key = b.category?.name;
      if (key) map[key] = b._id;
    });
    return map;
  }, [budgets]);
  const totalAllocated = useMemo(() => budgets.reduce((s, b) => s + (b.amount || 0), 0), [budgets]);
  // Backend-computed spend per budget (aggregated from real Transaction
  // documents matching that budget's category + date range + type
  // "Expense") — summed here rather than independently recomputing from
  // the whole `transactions` list, which would include spending outside
  // each budget's date range or in non-budgeted categories.
  const totalBudgetSpent = useMemo(() => budgets.reduce((s, b) => s + (b.spent || 0), 0), [budgets]);
  const budgetRemaining = totalAllocated - totalBudgetSpent;
  const [notifFilter, setNotifFilter] = useState("All");
  // Tracks whether GET /notifications actually returned data (i.e. the
  // backend module has been built) vs. 404ing (confirmed unbuilt as of
  // this writing). Starts false; flips true automatically the first time a
  // real response comes back, so notifications switch from generated
  // (real-data-derived, see NOTIFICATIONS section) to true backend data
  // with no further code changes once that module ships.
  const [notificationsBackendAvailable, setNotificationsBackendAvailable] = useState(false);
  const [txFilter, setTxFilter] = useState("All");

  // Wallets/categories fetched from the backend — these hold the real
  // Mongo _id values that transaction.validator.js requires for `wallet`
  // and `category`. Populated from the API once USE_MOCK_DATA is false.
  const [wallets, setWallets] = useState([]);
  const [categories, setCategories] = useState([]);

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

    if (USE_MOCK_DATA) {
      setWallets((w) => [...w, { _id: `local-${Date.now()}`, name: trimmed }]);
      setNewWalletName("");
      goBack();
      return;
    }

    setApiBusy(true);
    try {
      const created = await WalletsAPI.create({ name: trimmed });
      setWallets((w) => [...w, created]);
      setNewWalletName("");
      goBack();
    } catch (err) {
      setWalletFormError(err instanceof ApiError ? err.message : "Couldn't create this wallet. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  /* ------------------------------ ADD CATEGORY ------------------------------ */
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("Expense");
  const [categoryFormError, setCategoryFormError] = useState("");

  // Keeps the Budget Wizard's own category list (budgetCats) in sync with
  // categories created via AddCategory — so a category added mid-signup
  // (or mid-wizard) shows up already checked in BudgetWizard Step 2
  // without requiring a refetch. Scoped to type: "Expense" only, since
  // budgetCats/allocations/the wizard as a whole are expense-budgeting
  // concepts — an "Income" category created here has nothing to sync into.
  // Matches existing entries case-insensitively by key so re-adding a
  // category that already exists in the default list (e.g. "Food") just
  // re-checks it instead of creating a visual duplicate row.
  const syncBudgetCatFromCreated = (categoryName, type) => {
    if (type !== "Expense") return;
    setBudgetCats((cs) => {
      const existing = cs.find((c) => c.key.toLowerCase() === categoryName.toLowerCase());
      if (existing) {
        return cs.map((c) => (c === existing ? { ...c, checked: true } : c));
      }
      return [...cs, { key: categoryName, label: categoryName, icon: Tag, checked: true }];
    });
  };

  const handleCreateCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (trimmed.length < 2) {
      setCategoryFormError("Category name must be at least 2 characters.");
      return;
    }
    setCategoryFormError("");

    if (USE_MOCK_DATA) {
      setCategories((c) => [...c, { _id: `local-${Date.now()}`, name: trimmed, type: newCategoryType }]);
      syncBudgetCatFromCreated(trimmed, newCategoryType);
      setNewCategoryName("");
      goBack();
      return;
    }

    setApiBusy(true);
    try {
      const created = await CategoriesAPI.create({ name: trimmed, type: newCategoryType });
      setCategories((c) => [...c, created]);
      syncBudgetCatFromCreated(created.name || trimmed, created.type || newCategoryType);
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

  // Confirmed against a real GET /transactions response: wallet and
  // category always come back as populated objects ({ _id, name, ... }),
  // never bare ID strings. This maps that real shape into the
  // { cat, name, place, date, time, group } shape the rest of the UI
  // (search, filters, grouping) expects.
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
      time: new Date(t.transactionDate || t.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      group: groupLabel,
    };
  };

  // Maps a raw /savings document into the { id, name, target, saved, due }
  // shape Goals.jsx and the emergency-fund lookup expect. Field names
  // confirmed against savings.service.js / the SavingsGoal model: _id,
  // title, targetAmount, currentAmount, targetDate.
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

  // GET /transactions defaults to limit: 10 (see queryFeatures.js), sorted
  // -createdAt. Calling TransactionsAPI.list() with no params — what the
  // initial load did before — silently caps every user at their 10 most
  // recently created transactions, regardless of how many they actually
  // have. This pages through with page/limit (both already supported by
  // getQueryFeatures on the backend, confirmed via transaction.service.js)
  // until a page comes back shorter than the page size, so it scales
  // correctly no matter how many transactions the user has.
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
        const [me, fetchedBudgets, tx, gl, nf, sec, wl, cats] = await Promise.all([
          AuthAPI.me().catch(() => null),
          BudgetAPI.get().catch(() => null),
          fetchAllTransactions().catch(() => null),
          GoalsAPI.list().catch(() => null),
          NotificationsAPI.list().catch(() => null),
          SecurityAPI.get().catch(() => null),
          WalletsAPI.list().catch(() => null),
          CategoriesAPI.list().catch(() => null),
        ]);
        if (me?.user) {
          const email = me.user.email || "";
          setName(me.user.firstName || me.user.name || me.user.fullName || "");
          setProfileEmail(email);
          setProfilePhoneState(loadLocalPhone(email));
        }
        // Confirmed against budget.service.js: getBudgets() always
        // populates `category` with `{ _id, name, color, icon }` — no
        // fallback needed. `budgets` (and the derived budgetsByCategory/
        // totalAllocated/totalBudgetSpent above) become the source of
        // truth; allocations and budgetCats' checked state are synced from
        // it below purely for the wizard's own editable UI. There's no
        // `income`/`currency` field on this backend at all, so those stay
        // purely local/unpersisted for now.
        if (Array.isArray(fetchedBudgets)) {
          setBudgets(fetchedBudgets);
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
        if (Array.isArray(tx)) setTransactions(tx.map(normalizeTransaction));
        if (Array.isArray(gl)) setGoals(gl.map(normalizeGoal));
        if (Array.isArray(nf)) {
          setNotifications(nf);
          setNotificationsBackendAvailable(true);
        }
        if (sec) {
          if (sec.biometricEnabled != null) setBiometricEnabled(sec.biometricEnabled);
          if (sec.twoFactorEnabled != null) setTwoFactorEnabled(sec.twoFactorEnabled);
        }
        if (Array.isArray(wl)) setWallets(wl);
        if (Array.isArray(cats)) setCategories(cats);
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

  // Income is now logged into the same `transactions` array as Expense (see
  // handleSaveIncome), so this needs the same type filter spendingBreakdown
  // already uses below — otherwise every income entry inflates "spent"
  // figures instead of being excluded. "No type" is still treated as an
  // expense, to match mock-mode data which never sets `type`.
  const totalExpenses = useMemo(
    () => transactions.filter((t) => !t.type || t.type === "Expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  // totalAllocated / totalBudgetSpent / budgetRemaining are defined earlier,
  // derived directly from the `budgets` array (GET /budgets) — see above.

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
      // Phone isn't stored by the backend — save whatever the user typed at
      // signup as this browser's local record for their account.
      const phoneVal = signupPhone.trim();
      setProfilePhoneState(phoneVal);
      try {
        localStorage.setItem(phoneStorageKey(email), phoneVal);
      } catch {
        /* ignore storage errors (e.g. private browsing) */
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

  // Live, in-progress sum of the wizard's own slider values for currently
  // checked categories — NOT the same as totalAllocated (which only
  // reflects categories already saved as real Budget documents on the
  // backend). Needed so Step 3 ("Total Allocation"/"Remaining") and Step 4
  // ("Total Budget") update live as the user drags sliders, before
  // handleFinishBudget has saved anything to the backend.
  const wizardTotalAllocated = useMemo(
    () => budgetCats.filter((c) => c.checked).reduce((s, c) => s + (allocations[c.key] || 0), 0),
    [budgetCats, allocations]
  );

  // Defaults the required startDate/endDate to the current calendar month,
  // since the wizard has no date-range UI of its own. Revisit if the
  // product wants the user to pick a custom range instead.
  const getCurrentMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: toISODate(start), endDate: toISODate(end) };
  };

  // The backend requires `category` to be a real category ObjectId, not a
  // label. Categories aren't confirmed to be auto-seeded per user (the
  // Category schema's `isDefault` flag defaults to false with no seed
  // logic visible), so this looks for an existing category matching the
  // name/type in what's already been fetched, and creates one on the fly
  // if it isn't there yet — safe whether or not defaults exist.
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
      // Category schema enforces a unique (user, name, type, isActive)
      // index (confirmed in category.model.js) — if this exact category
      // was created elsewhere (another tab/session) between our last
      // GET /categories and this create call, the create fails on that
      // constraint. Refetch and retry the lookup instead of treating this
      // as a hard failure.
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

  // Backend Budget documents are one-per-category (title, category, amount,
  // startDate, endDate) — there's no single object to represent "the whole
  // wizard" the way `income`/`currency`/`allocations` implied. So this
  // saves one budget per checked, allocated category, updating it via
  // PATCH if budgetsByCategory already has an _id for that category, or
  // creating it via POST otherwise. `income`/`currency` have no backend
  // field at all and stay local-only for now.
  //
  // Confirmed against budget.service.js: POST /budgets returns the raw
  // created document with `category` UNPOPULATED and no spent/remaining
  // stats; PATCH /budgets/:id includes stats but `category` is ALSO
  // unpopulated (the update query has no .populate()). Neither response is
  // safe to merge into `budgets` directly — only GET /budgets is confirmed
  // fully populated with stats. So after the saves complete, this refetches
  // GET /budgets and replaces `budgets` wholesale with that canonical data,
  // rather than reconstructing partial objects from create/update responses.
  //
  // createBudget on the backend throws 409 "A budget already exists for
  // this period" whenever there's ANY overlapping Budget for the same
  // (user, category) pair — overlap is checked on the date range, not an
  // exact match, and is scoped per category (confirmed in
  // budget.service.js's createBudget). Local `budgetsByCategory` is built
  // from client-side `budgets` state, which can go stale relative to the
  // backend (e.g. the initial GET /budgets fetch failed and was swallowed
  // by .catch(() => null), or another session already created it) — in
  // that case a save that *should* be an update looks like a fresh
  // category here and gets POSTed, tripping that overlap check. On that
  // specific 409, refetch and retry as a PATCH against the real record
  // instead of surfacing the failure — updateBudget has no such overlap
  // check (confirmed in budget.service.js), so this is safe.
  const handleFinishBudget = async () => {
    if (!USE_MOCK_DATA) {
      const { startDate, endDate } = getCurrentMonthRange();
      const selected = budgetCats.filter((c) => c.checked && allocations[c.key] > 0);
      if (selected.length === 0) {
        showToast("No categories with an allocation to save — add an amount first.");
        if (history.length === 0) navigate("securityPrompt");
        else goToTab("dashboard");
        return;
      }
      try {
        await Promise.all(
          selected.map(async (c) => {
            // Use the internal key (not c.label) for both the category
            // name and the title, since GET /budgets populates
            // category.name and this must match budgetCats' key exactly
            // for budgetsByCategory to resolve correctly on next load.
            const categoryId = await resolveCategoryId(c.key, "Expense");
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
              // Only recover from the specific "stale local state" case —
              // an overlap conflict on a category we thought was new.
              // Anything else (validation error, network error, etc.)
              // should propagate to the outer catch as before.
              // Confirmed against api/client.js: ApiError carries the real
              // HTTP status in `.status` (set from response.status), and
              // this specific case is always a 409 from the backend's
              // AppError("A budget already exists for this period", 409).
              // Checking both status and message avoids misfiring on some
              // other unrelated 409 that happens to share wording.
              const isPeriodConflict =
                err instanceof ApiError &&
                err.status === 409 &&
                /already exists for this period/i.test(err.message || "");
              if (!isPeriodConflict) throw err;

              const fresh = await BudgetAPI.list().catch(() => null);
              const match = Array.isArray(fresh)
                ? fresh.find((b) => b.category?.name === c.key)
                : null;
              if (!match) throw err; // genuinely unresolvable — let it surface

              await BudgetAPI.update(match._id, payload);
            }
          })
        );
        const fresh = await BudgetAPI.get();
        if (Array.isArray(fresh)) setBudgets(fresh);
        showToast("Your budget has been saved.");
      } catch (err) {
        reportApiError(err, "Couldn't save your budget. It's kept locally for now.");
      }
    }
    if (history.length === 0) navigate("securityPrompt");
    else goToTab("dashboard");
  };

  /* -------------------------------- DASHBOARD ------------------------------ */
  // Rotating fallback palette for any expense category that doesn't have a
  // fixed color in Dashboard.jsx's own T.chart map (custom categories added
  // via handleCreateCategory have no fixed slot). Dashboard.jsx already
  // prefers `T.chart[s.cat]` over this when a known category matches, so
  // this is just the fallback tier.
  const CATEGORY_FALLBACK_COLORS = ["#16A34A", "#F5A524", "#20B0C4", "#E23FA0", "#9B59B6", "#101B3D"];

  // Was previously derived from budget allocations (which categories were
  // budgeted and how much), but "Spending Overview" is meant to show actual
  // spending, not budget targets — the Budget Remaining card already covers
  // budgeted-vs-spent. This groups real transactions by category, sums the
  // amount spent in each, and returns the top 5 by amount as a percentage
  // of total spend across ALL categories (so the top 5 percentages may not
  // sum to 100 if there are more than 5 categories in play — the remainder
  // is implicitly "everything else").
  const spendingBreakdown = useMemo(() => {
    const totals = {};
    transactions.forEach((t) => {
      // Only count expenses. Transactions fetched from the backend carry a
      // `type` field ("Income"/"Expense"); locally-seeded mock transactions
      // and the mock-mode Add Expense flow don't set `type` at all (mock
      // Add Income never pushes into `transactions`), so treat "no type"
      // as an expense too rather than dropping it.
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
    // Empty state (no expenses logged yet) — render a flat grey ring
    // instead of an empty conic-gradient(), which is invalid CSS.
    if (spendingBreakdown.length === 0) return "conic-gradient(#D9D9D9 0% 100%)";
    let acc = 0;
    const parts = spendingBreakdown.map((s) => {
      const start = acc; acc += s.pct;
      return `${s.color} ${start}% ${acc}%`;
    });
    return `conic-gradient(${parts.join(",")})`;
  })();

  // Was `goals.find(...)` with no fallback — returned `undefined` whenever no
  // goal named "Emergency Fund" existed yet (e.g. a fresh account with zero
  // goals), which crashed Goals.jsx (`emergency.saved` on undefined).
  // Falling back to a zeroed placeholder keeps the screen renderable either
  // way. Confirmed against the SavingsGoal model: there's no `featured`
  // boolean on the backend at all, so `others` below excludes this goal by
  // id instead of relying on a field that doesn't exist.
  const emergency = goals.find((g) => g.name === "Emergency Fund") || {
    id: null,
    name: "Emergency Fund",
    saved: 0,
    target: 1, // avoid divide-by-zero in (emergency.saved / emergency.target)
    due: "-",
  };
  // unreadCount is defined further down, after generatedNotifications —
  // see the NOTIFICATIONS section — since it now depends on real
  // transaction/budget/goal data that isn't all available this early.

  /* ------------------------------- ADD EXPENSE ------------------------------ */
  const [expAmount, setExpAmount] = useState("");
  // expAccount/expCat hold real Mongo ObjectIds (selected wallet/category
  // _id) once wired to the live backend — transaction.validator.js requires
  // `wallet` and `category` to be real ObjectIds.
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
    const categoryLabel = expCat === "All" ? "Others" : expCat;
    const localTx = { id: Date.now(), cat: categoryLabel, name: expNote || categoryLabel, place: categoryLabel, amount: Number(expAmount), date: expDate, time: formatTime(new Date()), group: groupLabel };

    if (USE_MOCK_DATA) {
      setTransactions((t) => [localTx, ...t]);
      setExpAmount(""); setExpNote("");
      // Popup confirmation the moment an expense is logged — separate from
      // the persistent "Expense Logged" notification-feed entry generated
      // in generatedNotifications below, which is the durable record.
      showToast(`Expense of ${fmtNShort(localTx.amount)} logged.`);
      goToTab("transactions");
      return;
    }

    // Real backend requires wallet/category as ObjectIds and a capitalized
    // type. expAccount/expCat must hold the selected wallet/category _id —
    // see the Add Expense form for how those are set.
    if (!expAccount || !expCat) {
      reportApiError(null, "Please choose a wallet and category before saving.");
      return;
    }

    setApiBusy(true);
    try {
      const created = await TransactionsAPI.create({
        wallet: expAccount,
        category: expCat,
        type: "Expense",
        amount: Number(expAmount),
        description: expNote || "",
        transactionDate: expDate,
      });
      // POST /transactions may not return wallet/category populated the
      // way GET /transactions does — fall back to the category/wallet the
      // user actually picked (we already have their full objects in
      // `categories`/`wallets`) so the new entry doesn't show
      // "Uncategorized" just because the create response was unpopulated.
      const pickedCategory = categories.find((c) => (c._id || c.id) === expCat);
      const pickedWallet = wallets.find((w) => (w._id || w.id) === expAccount);
      const merged = created
        ? {
            ...created,
            category: (created.category && created.category.name) ? created.category : (pickedCategory || created.category),
            wallet: (created.wallet && created.wallet.name) ? created.wallet : (pickedWallet || created.wallet),
          }
        : null;
      setTransactions((t) => [merged ? normalizeTransaction(merged) : localTx, ...t]);
      const savedAmount = Number(expAmount);
      setExpAmount(""); setExpNote("");
      // Popup confirmation on the real save too, same reasoning as the
      // mock-mode branch above.
      showToast(`Expense of ${fmtNShort(savedAmount)} logged.`);
      goToTab("transactions");
    } catch (err) {
      reportApiError(err, "Couldn't save this expense. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  /* -------------------------------- ADD INCOME ------------------------------- */
  const [incAmount, setIncAmount] = useState("");
  // Same story as expAccount/expCat above — must hold real wallet/category
  // _ids once the Add Income form is wired up. incSource stays a plain
  // label (there's no backend field for it); it's folded into `description`
  // below so it isn't silently dropped.
  const [incSource, setIncSource] = useState("Salary");
  const [incAccount, setIncAccount] = useState("");
  const [incCat, setIncCat] = useState("");
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

    // /income doesn't exist on this backend — income is logged as a
    // transaction with type: "Income", same endpoint as expenses.
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
      // Same POST-doesn't-populate issue as handleSaveExpense — fall back
      // to the category/wallet the user actually picked.
      const pickedCategory = categories.find((c) => (c._id || c.id) === incCat);
      const pickedWallet = wallets.find((w) => (w._id || w.id) === incAccount);
      const merged = created
        ? {
            ...created,
            category: (created.category && created.category.name) ? created.category : (pickedCategory || created.category),
            wallet: (created.wallet && created.wallet.name) ? created.wallet : (pickedWallet || created.wallet),
          }
        : null;
      if (merged) setTransactions((t) => [normalizeTransaction(merged), ...t]);
      // Backend has no running-total field to read back (unlike the old
      // /income spec's { totalIncome }), so we keep incrementing locally.
      setTotalIncome((t) => t + amt);
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
  const spentToday = transactions
    .filter((t) => t.group.startsWith("Today") && (!t.type || t.type === "Expense"))
    .reduce((s, t) => s + t.amount, 0);

  /* --------------------------- WEEKLY (real figures) ------------------------- */
  // Real "this week" figures for Transactions.jsx's weekly card. Weeks run
  // Monday–Sunday. weeklyBudget prorates the real monthly budget total
  // (totalAllocated, from actual Budget documents via BudgetAPI.get()) across
  // the number of days in the current calendar month — there's no distinct
  // "weekly budget" on the backend, Budget documents are monthly by design
  // (see getCurrentMonthRange in handleFinishBudget), so this is a derived
  // approximation, not a separately-tracked value.
  const startOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 = Sun
    const diff = day === 0 ? -6 : 1 - day; // shift back to Monday
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  };
  const endOfWeek = (d) => {
    const s = startOfWeek(d);
    const e = new Date(s);
    e.setDate(e.getDate() + 6);
    e.setHours(23, 59, 59, 999);
    return e;
  };
  const weekTotal = (transactionsList, weekStart, weekEnd) =>
    transactionsList
      .filter((t) => !t.type || t.type === "Expense")
      .filter((t) => {
        const d = new Date(t.date + "T00:00:00");
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((s, t) => s + t.amount, 0);

  const weeklyBudget = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Math.round((totalAllocated * 7) / daysInMonth);
  }, [totalAllocated]);

  const spentThisWeek = useMemo(() => {
    const now = new Date();
    return weekTotal(transactions, startOfWeek(now), endOfWeek(now));
  }, [transactions]);

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

  // Labels now match however many weeks monthlyTrend actually returned
  // (was a fixed ["W1".."W7"] regardless of the real week count).
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

  // Fires a one-time popup the moment a contribution pushes a goal to (or
  // past) its target — separate from the persistent "Goal Reached" entry
  // generated in generatedNotifications below, which stays in the feed.
  // `wasComplete`, captured before the update in addContribution, is what
  // keeps this from re-firing on every later render/contribution to an
  // already-completed goal.
  const checkGoalCompletion = (wasComplete, updated) => {
    if (!updated) return;
    if (wasComplete) return;
    if (updated.target > 0 && updated.saved >= updated.target) {
      showToast(`\uD83C\uDF89 You've reached your ${updated.name} goal!`);
    }
  };

  const addContribution = async (goalId, amount) => {
    const amt = Number(amount);
    if (!amt || !goalId) return;
    const g = goals.find((x) => x.id === goalId);
    const wasComplete = g ? g.saved >= g.target : false;

    if (USE_MOCK_DATA) {
      const updated = g ? { ...g, saved: g.saved + amt } : null;
      setGoals((gs) => gs.map((x) => (x.id === goalId ? { ...x, saved: x.saved + amt } : x)));
      checkGoalCompletion(wasComplete, updated);
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setContributionHistory((h) => [{ id: Date.now(), goalId, goalName: g ? g.name : "Goal", amount: amt, time }, ...h]);
      return;
    }

    setApiBusy(true);
    try {
      const data = await GoalsAPI.contribute(goalId, { amount: amt });
      if (data?.goal) {
        const normalized = normalizeGoal(data.goal);
        setGoals((gs) => gs.map((x) => (x.id === goalId ? normalized : x)));
        checkGoalCompletion(wasComplete, normalized);
      } else {
        const updated = g ? { ...g, saved: g.saved + amt } : null;
        setGoals((gs) => gs.map((x) => (x.id === goalId ? { ...x, saved: x.saved + amt } : x)));
        checkGoalCompletion(wasComplete, updated);
      }
      const time = data?.entry?.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      // goalId is spread in explicitly since the backend's `entry` (if any)
      // has no confirmed shape and may not include it.
      const entry = data?.entry ? { ...data.entry, goalId } : { id: Date.now(), goalId, goalName: g ? g.name : "Goal", amount: amt, time };
      setContributionHistory((h) => [entry, ...h]);
    } catch (err) {
      reportApiError(err, "Couldn't save this contribution. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  /* ------------------------------ EDIT / DELETE GOAL ------------------------------ */
  // See GoalsAPI.update/remove — routes are unconfirmed against the actual
  // backend savings router, unlike list/create/contribute.
  const editGoal = async (goalId, { name, target } = {}) => {
    if (!goalId) return;
    const trimmedName = name != null ? name.trim() : undefined;
    if (trimmedName === "") return; // don't allow blanking the name
    const numTarget = target != null && target !== "" ? Number(target) : undefined;
    if (numTarget !== undefined && (!numTarget || numTarget <= 0)) return;
    if (trimmedName === undefined && numTarget === undefined) return;

    if (USE_MOCK_DATA) {
      setGoals((gs) => gs.map((x) => (x.id === goalId
        ? { ...x, ...(trimmedName !== undefined ? { name: trimmedName } : {}), ...(numTarget !== undefined ? { target: numTarget } : {}) }
        : x)));
      return;
    }

    setApiBusy(true);
    try {
      const payload = {};
      if (trimmedName !== undefined) payload.title = trimmedName;
      if (numTarget !== undefined) payload.targetAmount = numTarget;
      const updated = await GoalsAPI.update(goalId, payload);
      setGoals((gs) => gs.map((x) => {
        if (x.id !== goalId) return x;
        if (updated) return { ...x, ...normalizeGoal(updated) };
        // Fallback if the backend returns an empty/unexpected body.
        return { ...x, ...(trimmedName !== undefined ? { name: trimmedName } : {}), ...(numTarget !== undefined ? { target: numTarget } : {}) };
      }));
    } catch (err) {
      reportApiError(err, "Couldn't update this goal. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  const deleteGoal = async (goalId) => {
    if (!goalId) return;
    const prevGoals = goals;
    setGoals((gs) => gs.filter((x) => x.id !== goalId));
    setExpandedGoalId((id) => (id === goalId ? null : id));

    if (USE_MOCK_DATA) return;

    setApiBusy(true);
    try {
      await GoalsAPI.remove(goalId);
    } catch (err) {
      setGoals(prevGoals); // roll back the optimistic removal
      reportApiError(err, "Couldn't delete this goal. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  /* --------------------------- EDIT / DELETE CONTRIBUTION -------------------------- */
  // No backend route exists for a single contribution — only
  // PATCH /savings/:id/contribute (adds to currentAmount) is confirmed.
  // Editing/deleting is done by sending a compensating amount through that
  // same endpoint (delta for edit, negative of the original for delete)
  // and updating local contributionHistory to match. This assumes the
  // backend accepts negative amounts in that call — if it rejects them,
  // this needs a real backend route instead.
  const editContribution = async (historyId, newAmount) => {
    const entry = contributionHistory.find((h) => h.id === historyId);
    if (!entry || !entry.goalId) return;
    const newAmt = Number(newAmount);
    if (!newAmt || newAmt <= 0) return;
    const delta = newAmt - Number(entry.amount);
    if (delta === 0) return;

    if (USE_MOCK_DATA) {
      setGoals((gs) => gs.map((x) => (x.id === entry.goalId ? { ...x, saved: Math.max(0, x.saved + delta) } : x)));
      setContributionHistory((h) => h.map((x) => (x.id === historyId ? { ...x, amount: newAmt } : x)));
      return;
    }

    setApiBusy(true);
    try {
      const data = await GoalsAPI.contribute(entry.goalId, { amount: delta });
      if (data?.goal) {
        setGoals((gs) => gs.map((x) => (x.id === entry.goalId ? normalizeGoal(data.goal) : x)));
      } else {
        setGoals((gs) => gs.map((x) => (x.id === entry.goalId ? { ...x, saved: Math.max(0, x.saved + delta) } : x)));
      }
      setContributionHistory((h) => h.map((x) => (x.id === historyId ? { ...x, amount: newAmt } : x)));
    } catch (err) {
      reportApiError(err, "Couldn't update this contribution. Please try again.");
    } finally {
      setApiBusy(false);
    }
  };

  const deleteContribution = async (historyId) => {
    const entry = contributionHistory.find((h) => h.id === historyId);
    if (!entry || !entry.goalId) return;
    const negAmt = -Number(entry.amount);

    if (USE_MOCK_DATA) {
      setGoals((gs) => gs.map((x) => (x.id === entry.goalId ? { ...x, saved: Math.max(0, x.saved + negAmt) } : x)));
      setContributionHistory((h) => h.filter((x) => x.id !== historyId));
      return;
    }

    setApiBusy(true);
    try {
      const data = await GoalsAPI.contribute(entry.goalId, { amount: negAmt });
      if (data?.goal) {
        setGoals((gs) => gs.map((x) => (x.id === entry.goalId ? normalizeGoal(data.goal) : x)));
      } else {
        setGoals((gs) => gs.map((x) => (x.id === entry.goalId ? { ...x, saved: Math.max(0, x.saved + negAmt) } : x)));
      }
      setContributionHistory((h) => h.filter((x) => x.id !== historyId));
    } catch (err) {
      reportApiError(err, "Couldn't delete this contribution. Please try again.");
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
      // Backend validator requires `title` and `targetAmount` (confirmed via
      // the 400 response from POST /savings) — NOT `name`/`target`.
      const created = await GoalsAPI.create({ title: newGoalName.trim(), targetAmount: Number(newGoalTarget) });
      // Normalize whatever the backend sends back into the shape the rest
      // of the UI expects (same helper used for the initial goals fetch).
      const normalized = created ? { ...localGoal, ...normalizeGoal(created) } : localGoal;
      setGoals((gs) => [...gs, normalized]);
      setNewGoalName(""); setNewGoalTarget(""); setShowAddGoal(false);
    } catch (err) {
      reportApiError(err, "Couldn't create this goal. Please try again.");
    } finally {
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

  const daysAgo = (iso) => {
    if (!iso) return Infinity;
    const diffMs = new Date() - new Date(iso);
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  };
  const relativeWhen = (iso) => {
    const n = daysAgo(iso);
    if (n <= 0) return "Today";
    if (n === 1) return "Yesterday";
    if (!Number.isFinite(n)) return "";
    return `${n}d ago`;
  };
  const groupFor = (iso) => {
    const n = daysAgo(iso);
    if (n <= 0) return "Today";
    if (n === 1) return "Yesterday";
    return "Earlier";
  };

  const generatedNotifications = useMemo(() => {
    const items = [];

    // Alerts — budget at/over its limit. b.percentageUsed is
    // backend-computed (confirmed via budget.service.js's
    // calculateBudgetStats, aggregated from real transactions).
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

    // Alerts — any single expense transaction over the threshold.
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

    // Transactions — every transaction logged (income and expense), so the
    // notification feed reflects actual activity, not just budget/large-
    // transaction alerts. Read=false by default; these are informational,
    // not warnings, so they don't need the same red-dot urgency as Alerts.
    transactions.forEach((t) => {
      const isIncome = t.type === "Income";
      items.push({
        id: `tx-log-${t.id || t._id}`,
        cat: "Transactions",
        type: isIncome ? "Income Logged" : "Expense Logged",
        body: `${isIncome ? "+" : "-"}${fmtNShort(t.amount)} \u2014 ${t.cat || "Uncategorized"}`,
        icon: isIncome ? HandCoins : Receipt,
        unread: false,
        relatedCategory: t.cat || null,
        when: relativeWhen(t.date),
        group: groupFor(t.date),
      });
    });

    // Bills — recent transactions actually logged under the "Bills" category.
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

    // Goals — real contributions already recorded via addContribution.
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

    // Goals — a goal that's been fully funded.
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
    screen, setScreen, history, setHistory, name, setName, darkMode, setDarkMode,
    biometricEnabled, setBiometricEnabled, twoFactorEnabled, setTwoFactorEnabled, toast, setToast, showToast, profileEmail,
    setProfileEmail, profilePhone, setProfilePhone, isEditingProfile, setIsEditingProfile, transactions, setTransactions, goals,
    setGoals, notifications, setNotifications, income, setIncome, currency, setCurrency, budgetCats,
    setBudgetCats, allocations, setAllocations, budgets, setBudgets, budgetsByCategory, notifFilter, setNotifFilter, txFilter, setTxFilter, navigate,
    goToTab, goBack, totalIncome, setTotalIncome, totalExpenses, totalAllocated, wizardTotalAllocated, totalBudgetSpent, budgetRemaining, phone, setPhone,
    pin, setPin, showLoginPw, setShowLoginPw, rememberPassword, setRememberPassword, loginError, setLoginError,
    handleLogin, showPw, setShowPw, lastName, setLastName, loginEmail, setLoginEmail, signupEmail, setSignupEmail, signupPhone, setSignupPhone, signupPassword,
    setSignupPassword, signupErrors, setSignupErrors, validatePassword, handleCreateAccount, clearErr, otp, setOtp,
    resendSeconds, setResendSeconds, currencies, budgetStep, setBudgetStep, incomeType, setIncomeType, customIncomeInputRef,
    steps, toggleCat, spendingBreakdown, donutGradient, analyticsSpendingBreakdown, analyticsDonutGradient, emergency, unreadCount, expAmount, setExpAmount,
    expAccount, setExpAccount, showAccountDropdown, setShowAccountDropdown, expCat, setExpCat, expNote, setExpNote,
    expDate, setExpDate, ordinal, formatLongDate, formatShortGroupDate, addExpenseCats, incAmount, setIncAmount,
    incSource, setIncSource, incAccount, setIncAccount, incCat, setIncCat, incNote, setIncNote, incDate, setIncDate, incomeSources, txSearch,
    setTxSearch, txSortNewest, setTxSortNewest, searchedTx, catFilteredTx, filteredTx, grouped, dailyBudget,
    spentToday, weeklyBudget, spentThisWeek, weeklySpendTrend, monthlyTrend, weeklyTrend, monthWeekLabels, dayLabels, monthNamesShort, monthNamesFull, analyticsPeriod,
    setAnalyticsPeriod, analyticsMonthIndex, setAnalyticsMonthIndex, analyticsYear, setAnalyticsYear, showMonthPicker, setShowMonthPicker, activeTrend,
    activeLabels, goToPrevMonth, goToNextMonth, contribAmount, setContribAmount, contributionHistory, setContributionHistory, showAllHistory,
    setShowAllHistory, showAddGoal, setShowAddGoal, newGoalName, setNewGoalName, newGoalTarget, setNewGoalTarget, expandedGoalId,
    setExpandedGoalId, otherContribAmount, setOtherContribAmount, others, addContribution, filteredNotifs, notifGrouped,
    otpError, handleVerifyOtp, handleResendOtp, apiBusy, handleForgotPassword, handleFinishBudget,
    handleSaveExpense, handleSaveIncome, handleCreateGoal, editGoal, deleteGoal, editContribution, deleteContribution,
    handleMarkNotificationRead, handleMarkAllNotificationsRead,
    handleSaveProfile, handleToggleBiometric, handleEnableBiometric, handleToggleTwoFactor,
    wallets, categories,
    newWalletName, setNewWalletName, walletFormError, handleCreateWallet,
    newCategoryName, setNewCategoryName, newCategoryType, setNewCategoryType, categoryFormError, setCategoryFormError, handleCreateCategory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
