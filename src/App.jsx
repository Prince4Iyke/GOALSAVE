import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { ThemeContext, LIGHT_C, DARK_C } from "./theme";

import Splash from "./screens/Splash";
import Onboard1 from "./screens/Onboard1";
import Onboard2 from "./screens/Onboard2";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Otp from "./screens/Otp";
import IncomeSetup from "./screens/IncomeSetup";
import Currency from "./screens/Currency";
import BudgetWizard from "./screens/BudgetWizard";
import SecurityPrompt from "./screens/SecurityPrompt";
import Dashboard from "./screens/Dashboard";
import AddExpense from "./screens/AddExpense";
import AddIncome from "./screens/AddIncome";
import Transactions from "./screens/Transactions";
import Analytics from "./screens/Analytics";
import Goals from "./screens/Goals";
import Notifications from "./screens/Notifications";
import Profile from "./screens/Profile";
import PersonalInfo from "./screens/PersonalInfo";
import SecurityCenter from "./screens/SecurityCenter";

const screenComponents = {
  splash: Splash,
  onboard1: Onboard1,
  onboard2: Onboard2,
  login: Login,
  signup: SignUp,
  otp: Otp,
  income: IncomeSetup,
  currency: Currency,
  budgetHub: BudgetWizard,
  securityPrompt: SecurityPrompt,
  dashboard: Dashboard,
  addExpense: AddExpense,
  addIncome: AddIncome,
  transactions: Transactions,
  analytics: Analytics,
  goals: Goals,
  notifications: Notifications,
  profile: Profile,
  securityCenter: SecurityCenter,
  personalInfo: PersonalInfo,
};

function Shell() {
  const { screen, darkMode, toast } = useApp();
  const C = darkMode ? DARK_C : LIGHT_C;
  const Current = screenComponents[screen] || Dashboard;

  return (
    <div style={{ minHeight: "100dvh", width: "100%", background: darkMode ? "#05080F" : "#EDEFEE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        .goalsave-shell-wrap { width: 100%; height: 100dvh; display: flex; align-items: center; justify-content: center; }
        .goalsave-shell { width: 100%; height: 100%; }
        @media (min-width: 640px) {
          .goalsave-shell-wrap { padding: 28px; }
          .goalsave-shell {
            width: 100%;
            max-width: 430px;
            height: min(860px, 92dvh);
            border-radius: 34px;
            border: 8px solid #17181A;
            box-shadow: 0 30px 60px -20px rgba(0,0,0,0.35);
          }
        }
        @media (min-width: 1024px) {
          .goalsave-shell { max-width: 460px; }
        }

        /* Hover feedback for every real <button> across the app */
        .goalsave-shell button:not(:disabled) {
          transition: filter 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
        }
        .goalsave-shell button:not(:disabled):hover {
          filter: brightness(0.94);
        }
        .goalsave-shell button:not(:disabled):active {
          transform: scale(0.97);
        }

        /* Hover feedback for custom clickable elements (cards, rows, chips, links) */
        .goalsave-shell [style*="cursor: pointer"] {
          transition: opacity 0.15s ease, filter 0.15s ease;
        }
        .goalsave-shell [style*="cursor: pointer"]:hover {
          opacity: 0.85;
        }
        .goalsave-shell input[type="checkbox"],
        .goalsave-shell input[type="radio"] {
          cursor: pointer;
        }
      `}</style>
      <div className="goalsave-shell-wrap">
        <ThemeContext.Provider value={C}>
          <div className="goalsave-shell" style={{ background: C.bg, overflow: "hidden", position: "relative" }}>
            <Current />
            {toast && (
              <div style={{ position: "absolute", left: 16, right: 16, bottom: 84, background: "#17181A", color: "#fff", padding: "12px 16px", borderRadius: 12, fontSize: 12.5, fontWeight: 600, zIndex: 200, boxShadow: "0 10px 24px -8px rgba(0,0,0,0.4)" }}>
                {toast}
              </div>
            )}
          </div>
        </ThemeContext.Provider>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
