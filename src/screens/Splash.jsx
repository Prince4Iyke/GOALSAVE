import React, { useEffect, useState } from "react";
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
import logo from "../assets/logo.jpg";

export default function Splash() {
  const ctx = useApp();
  const C = useTheme();
  const { navigate } = ctx;

  const FADE_MS = 700;   // transition duration
  const HOLD_MS = 1800;  // how long the splash stays fully visible

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // fade in just after mount (so the initial opacity:0 actually renders first)
    const fadeIn = setTimeout(() => setVisible(true), 30);

    // start fading out, then navigate once the fade-out finishes
    const fadeOut = setTimeout(() => setVisible(false), HOLD_MS);
    const goNext = setTimeout(() => navigate("onboard1"), HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
      clearTimeout(goNext);
    };
  }, [navigate]);

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", background: "#FFFFFF", padding: 24,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0px) scale(1)" : "translateY(8px) scale(0.98)",
      transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
    }}>

      {/* Logo — replaces the hand-built card/wallet illustration */}
      <img src={logo} alt="GoalSave logo" style={{ width: 260, height: "auto", objectFit: "contain" }} />

      {/* Frame 1171275253 — bordered stencil "GoalSave" wordmark */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", margin: "30px auto 0",
        width: 216, height: 60, padding: 10,
        border: "3px solid #070540", borderRadius: 10,
      }}>
        <span style={{
          fontFamily: "'Saira Stencil One', sans-serif", fontWeight: 600,
          fontSize: 40, lineHeight: "56px", letterSpacing: "-0.04em",
          textAlign: "center", color: "#070540",
        }}>
          GoalSave
        </span>
      </div>
    </div>
  );
}
