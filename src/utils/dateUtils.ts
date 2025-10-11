import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

// Generate all days for a calendar grid for a given month
export function getMonthDays(currentDate: Date): Date[] {
  const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

// Check if two dates fall on the same calendar day
export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.toDateString() === d2.toDateString();
}

// Format a date as YYYY-MM-DD (for storage or comparison)
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
