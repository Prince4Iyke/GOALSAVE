import {
  ArrowLeft, Bell, Search, Filter, Calendar, Plus, Wallet, ShieldCheck, Lock,
  Fingerprint, CreditCard, TrendingUp, PiggyBank, User, Home, List, PieChart,
  Target, ChevronRight, ChevronDown, Check, Eye, EyeOff, Mail, Phone, Smartphone,
  Building2, HelpCircle, LogOut, AlertTriangle, Star, ShieldAlert, Utensils, Bus,
  Receipt, ShoppingBag, Film, Zap, GraduationCap, Plane, Key, MoreHorizontal,
  Moon, Sun, Coins, BarChart3, Clock, Briefcase, Store,
  HeartPulse, HandCoins,
} from "lucide-react";

import { toISODate, shortGroupDate, formatLongDateFromObj, formatTime } from "./utils";

export function buildInitialTransactions() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const todayISO = toISODate(today);
  const yestISO = toISODate(yesterday);
  const todayLabel = `Today, ${shortGroupDate(today)}`;
  const yestLabel = `Yesterday, ${shortGroupDate(yesterday)}`;

  // Scale today's demo timestamps between midnight and the actual current moment,
  // so they always land in the real past relative to right now.
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const elapsedMs = today.getTime() - startOfToday.getTime();
  const t1 = new Date(startOfToday.getTime() + elapsedMs * 0.55);
  const t2 = new Date(startOfToday.getTime() + elapsedMs * 0.35);
  const t3 = new Date(startOfToday.getTime() + elapsedMs * 0.3);

  // Yesterday is a full calendar day in the past, so fixed hours are always valid.
  const y1 = new Date(yesterday); y1.setHours(19, 15, 0, 0);
  const y2 = new Date(yesterday); y2.setHours(16, 20, 0, 0);

  return [
    { id: 1, cat: "Food", name: "Lunch", place: "Restaurant", amount: 2500, date: todayISO, time: formatTime(t1), group: todayLabel },
    { id: 2, cat: "Transport", name: "Bus fare", place: "Transport", amount: 1200, date: todayISO, time: formatTime(t2), group: todayLabel },
    { id: 3, cat: "Bills", name: "Internet Subscription", place: "Bills", amount: 5000, date: todayISO, time: formatTime(t3), group: todayLabel },
    { id: 4, cat: "Shopping", name: "Supermarket", place: "Shopping", amount: 4700, date: yestISO, time: formatTime(y1), group: yestLabel },
    { id: 5, cat: "Food", name: "Snacks", place: "Food", amount: 800, date: yestISO, time: formatTime(y2), group: yestLabel },
  ];
}

export function buildInitialGoals() {
  const due = new Date();
  due.setMonth(due.getMonth() + 6);
  return [
    { id: 1, name: "Emergency Fund", icon: HandCoins, saved: 0, target: 500000, due: formatLongDateFromObj(due), featured: true },
    { id: 2, name: "New phone", icon: Smartphone, saved: 0, target: 350000 },
    { id: 3, name: "Vacation", icon: Plane, saved: 0, target: 600000 },
    { id: 4, name: "Education", icon: GraduationCap, saved: 0, target: 1000000 },
    { id: 5, name: "Apartment", icon: Key, saved: 0, target: 2500000 },
  ];
}

export function buildInitialNotifications() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const elapsedMs = now.getTime() - startOfToday.getTime();
  const alertTime = new Date(startOfToday.getTime() + elapsedMs * 0.6);
  const billTime = new Date(startOfToday.getTime() + elapsedMs * 0.4);
  return [
    { id: 1, type: "Overspending Alert", icon: TrendingUp, body: "You've spent 90% of your daily budget for Food.", when: formatTime(alertTime), group: "Today", unread: true, cat: "Alerts" },
    { id: 2, type: "Upcoming Bill", icon: Calendar, body: "Electricity bill of \u20A612,500 is due tomorrow.", when: formatTime(billTime), group: "Today", unread: false, cat: "Bills" },
    { id: 3, type: "Savings Milestone", icon: Star, body: "Congratulations! You've reached 60% of your Emergency Fund goal.", when: "Yesterday", group: "Yesterday", unread: false, cat: "Goals" },
    { id: 4, type: "Unusual Transaction", icon: ShieldAlert, body: "A transaction of \u20A625,000 was detected from a new device.", when: "Yesterday", group: "Yesterday", unread: false, cat: "Security" },
  ];
}

export const budgetCategoryOptions = [
  { key: "Food", label: "Food & Dining", icon: Utensils, checked: true },
  { key: "Transport", label: "Transport", icon: Bus, checked: true },
  { key: "Housing", label: "Housing", icon: Building2, checked: true },
  { key: "Utilities", label: "Utilities", icon: Zap, checked: true },
  { key: "Health", label: "Health", icon: HeartPulse, checked: false },
  { key: "Entertainment", label: "Entertainment", icon: Film, checked: true },
  { key: "Shopping", label: "Shopping", icon: ShoppingBag, checked: false },
  { key: "Education", label: "Education", icon: GraduationCap, checked: false },
  { key: "Others", label: "Others", icon: MoreHorizontal, checked: false },
];

