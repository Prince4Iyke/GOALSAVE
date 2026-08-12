export const pad2 = (n) => String(n).padStart(2, "0");
export const toISODate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const shortGroupDate = (d) => `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
export const ordinalSuffix = (n) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
export const formatLongDateFromObj = (d) => `${ordinalSuffix(d.getDate())} ${MONTH_FULL[d.getMonth()]}, ${d.getFullYear()}`;
export const formatTime = (d) => {
  let h = d.getHours();
  const m = pad2(d.getMinutes());
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
export function firstWeekday(year, month) {
  return new Date(year, month, 1).getDay();
}

