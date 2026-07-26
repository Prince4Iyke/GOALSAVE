import { createContext, useContext } from "react";
import { Utensils, Bus, Receipt, ShoppingBag, Film, Building2, Zap, HeartPulse, GraduationCap, MoreHorizontal } from "lucide-react";

/* ---------------------------------- THEME ---------------------------------- */
export const LIGHT_C = {
  green: "#159A48",
  greenDark: "#0C7A38",
  greenDarker: "#075C2A",
  greenLight: "#E7F6EC",
  navy: "#101B3D",
  gold: "#D9B24C",
  bg: "#F6F8F7",
  card: "#FFFFFF",
  border: "#DDEBE1",
  textMuted: "#7C8A82",
  red: "#DC4646",
};

export const DARK_C = {
  ...LIGHT_C,
  greenLight: "#123625",
  navy: "#F5F7FA",
  bg: "#0B1220",
  card: "#111B30",
  border: "#26314F",
  textMuted: "#93A4C6",
};

export const ThemeContext = createContext(LIGHT_C);

export const CARD_GRADIENT = `linear-gradient(135deg, ${LIGHT_C.greenDark} 0%, ${LIGHT_C.green} 55%, ${LIGHT_C.greenDarker} 100%)`;

export const CATEGORY_META = {
  Food: { icon: Utensils, color: "#16A34A" },
  Transport: { icon: Bus, color: "#F5A524" },
  Transportation: { icon: Bus, color: "#F5A524" },
  Bills: { icon: Receipt, color: "#20B0C4" },
  Shopping: { icon: ShoppingBag, color: "#E23FA0" },
  Entertainment: { icon: Film, color: "#E23FA0" },
  Housing: { icon: Building2, color: "#7A5CF0" },
  Utilities: { icon: Zap, color: "#F5A524" },
  Health: { icon: HeartPulse, color: "#DC4646" },
  Education: { icon: GraduationCap, color: "#7A5CF0" },
  Others: { icon: MoreHorizontal, color: "#101B3D" },
};

export const fmtN = (n) =>
  "\u20A6" + Number(n || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtNShort = (n) => "\u20A6" + Number(n || 0).toLocaleString("en-NG");

export function useTheme() {
  return useContext(ThemeContext);
}
