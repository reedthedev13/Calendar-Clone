import { useState, useMemo } from "react";
import { addMonths, subMonths } from "date-fns";
import { getMonthDays } from "../utils/dateUtils";

export function useCalendar(initialDate: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);

  // Navigation
  const prevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const thisMonth = () => setCurrentMonth(new Date());

  // Compute all days for the current month
  const monthDays = useMemo(() => getMonthDays(currentMonth), [currentMonth]);

  return {
    currentMonth,
    monthDays,
    prevMonth,
    nextMonth,
    thisMonth,
    setCurrentMonth,
  };
}
