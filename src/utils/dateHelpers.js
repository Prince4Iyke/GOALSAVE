export const startOfWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);

  return date;
};

export const endOfWeek = (d) => {
  const start = startOfWeek(d);
  const end = new Date(start);

  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return end;
};

export const weekTotal = (transactions, weekStart, weekEnd) =>
  transactions
    .filter((t) => !t.type || t.type === "Expense")
    .filter((t) => {
      const date = new Date(`${t.date}T00:00:00`);
      return date >= weekStart && date <= weekEnd;
    })
    .reduce((sum, t) => sum + t.amount, 0);

export const daysAgo = (iso) => {
  if (!iso) return Infinity;

  const diff = new Date() - new Date(iso);

  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const relativeWhen = (iso) => {
  const days = daysAgo(iso);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (!Number.isFinite(days)) return "";

  return `${days}d ago`;
};

export const groupFor = (iso) => {
  const days = daysAgo(iso);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";

  return "Earlier";
};