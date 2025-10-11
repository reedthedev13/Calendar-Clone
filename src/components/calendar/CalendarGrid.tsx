// CalendarGrid.tsx
import React from "react";
import DayCell from "./DayCell";
import type { CalendarEvent } from "../../types/Event";
import { getMonthDays, isSameDay } from "../../utils/dateUtils";

interface CalendarGridProps {
  currentMonth: Date;
  events: CalendarEvent[];
  openEditModal: (date: Date, event?: CalendarEvent) => void;
  openViewModal: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  events,
  openEditModal,
  openViewModal,
}) => {
  const monthDays = getMonthDays(currentMonth);

  // Group into weeks (rows of 7)
  const weeks: Date[][] = [];
  for (let i = 0; i < monthDays.length; i += 7) {
    weeks.push(monthDays.slice(i, i + 7));
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {weeks.map((week, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-7 gap-0">
          {week.map((day) => {
            const dayEvents = events.filter((e) =>
              isSameDay(new Date(e.date), day)
            );
            const showWeekday = rowIndex === 0;

            return (
              <DayCell
                key={day.toString()}
                date={day}
                isToday={new Date().toDateString() === day.toDateString()}
                isOutOfMonth={day.getMonth() !== currentMonth.getMonth()}
                events={dayEvents}
                showWeekday={showWeekday}
                onClick={(date) => openEditModal(date)}
                onAddClick={(date) => openEditModal(date)}
                onEventClick={(event) =>
                  openEditModal(new Date(event.date), event)
                }
                onOverflowClick={(date) => openViewModal(date)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
