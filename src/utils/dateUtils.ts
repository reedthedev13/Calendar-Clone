import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

// Generate all days to render in the calendar grid
export function getMonthDays(currentDate: Date): Date[] {
  const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

// Check if two dates are the same day
export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.toDateString() === d2.toDateString();
}

// Format YYYY-MM-DD for storage
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
