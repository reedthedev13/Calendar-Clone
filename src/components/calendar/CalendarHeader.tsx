import React from "react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-[#dadce0]">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onToday}
          className="px-2 sm:px-3 py-1 text-sm border border-[#dadce0] rounded hover:bg-[#f1f3f4] transition"
        >
          Today
        </button>
        <button
          onClick={onPrevMonth}
          className="px-2 sm:px-3 py-1 text-sm border border-[#dadce0] rounded hover:bg-[#f1f3f4] transition"
        >
          &lt;
        </button>
        <button
          onClick={onNextMonth}
          className="px-2 sm:px-3 py-1 text-sm border border-[#dadce0] rounded hover:bg-[#f1f3f4] transition"
        >
          &gt;
        </button>
        <h2 className="ml-2 text-lg sm:text-xl font-semibold text-[#333]">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
      </div>
    </div>
  );
};

export default CalendarHeader;
