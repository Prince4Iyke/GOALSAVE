# GoalSave

GoalSave is a fintech MVP that helps everyday users make better financial
decisions — building a saving habit, staying on top of a budget, catching
overspending before it becomes a problem, and understanding where their
money actually goes.

It's built as a single mobile-style app (with a responsive web layout) and
covers the full loop from account creation to daily use: onboarding →
budget setup → daily tracking → savings goals → analytics → security.

---

## What the app does

**Onboarding & Account**
- Splash screen, feature walkthrough, and account creation (name, email,
  phone, password with live validation)
- Phone number OTP verification with a real, running countdown/resend timer
- Initial monthly income capture and currency selection
- A guided 4-step budget wizard (income → categories → allocate → review)
  right after signup, plus an optional biometric-login prompt

**Everyday tracking**
- **Dashboard** — total balance, income vs. expenses, an Emergency Fund
  progress card, quick actions, and a spending breakdown donut
- **Add Expense** — amount, category, account, a real calendar date
  picker, and notes
- **Add Income** — a separate flow (source, account, date) that actually
  increases Total Income, kept distinct from logging an expense
- **Transactions** — searchable, filterable by category, sortable
  (newest vs. highest amount), with a running daily-budget indicator

**Goals & insight**
- **Saving Goals** — a featured Emergency Fund goal plus other goals
  (New Phone, Vacation, Education, Apartment); every goal accepts its own
  contributions, all logged to a real contribution history; users can
  create new custom goals from scratch
- **Spending Analytics** — weekly/monthly toggle, month navigation, a
  category donut + legend, a spending trend chart, top category, and an
  auto-generated insight; tapping a category anywhere in the app (Dashboard
  or Analytics) drills straight into filtered Transactions

**Account & safety**
- **Notifications** — overspending alerts, upcoming bills, savings
  milestones, and security alerts, filterable and mark-as-read
- **Profile** — personal info (view/edit), bank accounts, preferences
- **Security Center** — a live security score, working Biometric Login /
  Two-Factor Authentication toggles, device management, and login history

Everything that looks clickable is wired to something real — either actual
app logic (adding money, filtering transactions, toggling settings) or, for
the handful of things a frontend-only MVP can't truly do (Google/Apple
sign-in, a real help desk), an honest in-app message instead of a dead
button.

The whole app supports a **light and dark theme** (toggle from the
Dashboard) and is **fully responsive** — edge-to-edge on a phone, a
centered app card with a phone-style frame on tablet/desktop.

---

## Tech stack

- **React 18** (function components + hooks)
- **Vite** for dev server and bundling
- **lucide-react** for icons
- Plain inline styles (no CSS framework) — colors and spacing come from a
  shared theme object, not Tailwind/utility classes
- A thin API client (`src/api/`) that either talks to a real backend or
  falls back to in-memory mock data — see **API integration** below.

---

## API integration

The app ships with a full API client already wired up (`src/api/client.js`,
`src/api/endpoints.js`) and every user action already calling it — login,
signup, OTP, adding an expense/income, contributing to a goal, toggling
security settings, all of it.

By default it runs in **mock mode**: no network calls happen at all, and
the app works fully on local seed data, so frontend work isn't blocked on
a backend existing yet.

To connect a real backend:

1. Copy `.env.example` to `.env`
2. Set `VITE_API_BASE_URL` to your API's URL
3. Set `VITE_USE_MOCK_DATA=false`

The complete endpoint contract (every request/response shape the backend
needs to implement) is documented in **`API_INTEGRATION.md`** at the
project root — that's the file to hand to whoever's building the backend.

If a request fails, the app shows a toast with the error message rather
than crashing, and keeps whatever data it already had.

---

## Project structure

```
goalsave-mvp/
├── index.html                  Vite HTML entry
├── package.json
├── vite.config.js
├── public/
│   └── images/
│       └── visa-card-bg.jpg    Background image used on the onboarding card
└── src/
    ├── main.jsx                 React entry point — mounts <App />
    ├── App.jsx                  Screen router + the responsive phone-frame shell
    │                            (media queries, light/dark background, toast banner)
    ├── theme.js                 Light & dark color palettes, ThemeContext + useTheme(),
    │                            the green card gradient, category icon/color map,
    │                            currency formatting helpers (fmtN, fmtNShort)
    ├── utils.js                 Date/time helpers (today's date, "Today"/"Yesterday"
    │                            labels, 12-hour clock formatting, calendar math)
    ├── data.js                  Seed data builders — starting transactions, goals,
    │                            notifications, and the budget category list. These
    │                            are functions (not static objects) so seeded dates/
    │                            times are always relative to *today*, not frozen
    │                            to whenever this code was written.
    │
    ├── api/
    │   ├── client.js             Fetch wrapper — base URL, auth token header,
    │   │                         JSON parsing, ApiError normalization
    │   └── endpoints.js          One function per backend endpoint (Auth, Profile,
    │                             Budget, Transactions, Income, Goals, Notifications,
    │                             Security). See API_INTEGRATION.md for the full
    │                             request/response contract.
    │
    ├── context/
    │   └── AppContext.jsx        The app's "brain": every piece of state (screen,
    │                             user, transactions, goals, budget, theme, etc.),
    │                             all derived values (totals, filtered lists, chart
    │                             data), and all app-wide actions (navigate, add a
    │                             transaction, contribute to a goal, toggle a
    │                             setting...). Exposed to every screen via a single
    │                             useApp() hook so screens don't need prop-drilling.
    │
    ├── components/
    │   └── UI.jsx                 Shared building blocks used across screens:
    │                               BackHeader, PrimaryButton, OutlineButton, Field,
    │                               ProgressBar, BottomNav, Screen (the scrollable
    │                               page wrapper), and DatePickerField (a self-built
    │                               calendar dropdown — no native <input type="date">
    │                               dependency).
    │
    └── screens/                   One file per screen. Each imports useApp() and
        │                          useTheme(), and renders using that shared state —
        │                          no screen owns app-wide data itself.
        ├── Splash.jsx              Logo splash / "Get Started"
        ├── Onboard1.jsx            "Take control of your finance" walkthrough slide
        ├── Onboard2.jsx            "All your finances in one place" walkthrough slide
        ├── Login.jsx               Phone + password login, validation, forgot password
        ├── SignUp.jsx              Account creation with live field validation
        ├── Otp.jsx                 Phone verification with a real countdown/resend
        ├── IncomeSetup.jsx         Capture average monthly income
        ├── Currency.jsx            Choose display currency
        ├── BudgetWizard.jsx        4-step guided budget setup (also reused as the
        │                           "Budget" tab and the "Create Budget" quick action)
        ├── SecurityPrompt.jsx      Post-signup biometric login opt-in
        ├── Dashboard.jsx           Home screen — balance, Emergency Fund, quick
        │                           actions, spending overview
        ├── AddExpense.jsx          Log an expense (amount, category, account, date)
        ├── AddIncome.jsx           Log income and increase Total Income
        ├── Transactions.jsx        Full transaction list — search, filter, sort
        ├── Analytics.jsx           Spending analytics — trend chart, category
        │                           breakdown, insights
        ├── Goals.jsx               Saving goals — contributions, history, create
        │                           new goals
        ├── Notifications.jsx       Alerts, bills, milestones, security notices
        ├── Profile.jsx             Account menu — links into the screens below
        ├── PersonalInfo.jsx        View/edit name, email, phone
        └── SecurityCenter.jsx      Security score, biometric/2FA toggles, devices,
                                    login history
```

### How a screen actually works

Every screen file follows the same shape:

```jsx
export default function ScreenName() {
  const ctx = useApp();       // everything from AppContext
  const C = useTheme();       // the active color palette (light or dark)
  const { /* whichever state/actions this screen needs */ } = ctx;

  return ( /* JSX for this screen, using C.* for all colors */ );
}
```

This means:
- Adding a new screen = add one file to `src/screens/`, import it in
  `App.jsx`, add it to the `screenComponents` map.
- Changing something app-wide (e.g. how a transaction is stored) = edit
  `AppContext.jsx` once; every screen that reads it updates automatically.
- Theming is centralized — screens never hardcode a color, they always
  read `C.navy`, `C.green`, `C.border`, etc., so dark mode "just works"
  everywhere without per-screen logic.

---

## Running the app

```bash
npm install
npm run dev
```

Open the local URL Vite prints (typically `http://localhost:5173`).

For a production build:

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

---

## Known limitations (by design, for an MVP)

- Ships in **mock mode** by default — see "API integration" above to
  connect a real backend; `API_INTEGRATION.md` has the full contract
- Google/Apple sign-in, Bank Accounts, Preferences, Change Password,
  Device Management, Login History, and Help Center show an honest
  "not available in this demo yet" message rather than doing nothing —
  they're UI-complete but there's no endpoint contract for them yet
- Currency selection is stored but amounts always display in ₦ (Naira)
