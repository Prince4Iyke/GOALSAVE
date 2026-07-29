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
import { ArrowRight } from "lucide-react";

export default function Onboard1() {
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
  

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.card, padding: "40px 22px 26px", overflowY: "auto" }}>
      <BackHeader title="" onBack={goBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "95%", borderRadius: 20, padding: 22, minHeight: 220, marginTop: 2, backgroundImage: "url(/images/visa-card-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center", position: "relative", overflow: "visible", boxShadow: "0 16px 30px -12px rgba(12,122,56,0.45)" }}>
          <div 
          style={{ 
            position: "absolute",
            width: 60,
            height: 50,
            left: 24,
            top: 120, 
            borderRadius: 10,
            background: "conic-gradient(from 168.11deg at 44.62% 74.48%, #BF953F 0deg, #FCF6BA 108deg, #B38728 234deg, #FBF5B7 360deg)", 
            marginBottom: 10, 
              }} 
              />
          <div style={{ 
            position: "absolute",
    left: 13.55,
    top: 190,
    fontFamily: "'Istok Web', sans-serif",
    fontSize: 28,
    fontWeight: 300,
    lineHeight: "24px",
    letterSpacing: "3px",
    fontVariantNumeric: "tabular-nums",
    textTransform: "uppercase",
    color: "#FFFFFF",
    whiteSpace: "nowrap",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
            >1543&nbsp;&nbsp;2567&nbsp;&nbsp;8909&nbsp;&nbsp;4322</div>

          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" }}>
            <TrendingUp color="#fff" size={22} />
            <span style={{ position: "absolute",
            margin: "0 310px 0",
            top: 230,
            fontFamily: "'Istok Web', sans-serif",
            fontSize: 24,
            lineHeight: "24px",
            textTransform: "uppercase",
            color: "#FFFFFF",
            }}
            >VISA</span>
          </div>
        </div>
        <h2 style={{ textAlign: "center", color: C.navy, fontSize: 22, fontWeight: 800, marginTop: 10, lineHeight: 1.3 }}>
          Take control of your <p style={{ color: C.green, marginTop: 2 }}>finance</p>
        <div>
          <p style={{ 
            textAlign: "center", 
            fontSize: 13.5, 
            marginBottom: 20, 
            marginTop:1,
            }}
            >Track expenses, set budgets and achieve your saving goals</p>
          
        </div>
           
        </h2>
        <PrimaryButton
            onClick={() => navigate("onboard2")}
            style={{
              background: C.card,
              marginTop: "5%",
              width: "75%",
              height: 55,
              color: C.green,
              border: `1.5px solid ${C.green}`,
              boxShadow: "none",
              fontWeight: 600,
              fontSize: 20,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
          }}
        >
          <span>Next</span>

            <ArrowRight
              size={28}
              strokeWidth={2}
            style={{
              position: "absolute",
              right: 20,
              transform: "scaleX(2)",
              transformOrigin: "center",
              }}
          />
        </PrimaryButton>      
          
      </div>
         
    </div>
  );
}
