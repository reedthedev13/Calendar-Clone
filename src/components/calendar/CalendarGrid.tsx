import React from "react";
import DayCell from "./DayCell";
import type { CalendarEvent } from "../../types/Event";
import { addDays, isSameMonth, isToday } from "date-fns";
import { JSX } from "react";

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
  const monthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const monthEnd = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const startDate = addDays(monthStart, -monthStart.getDay());
  const endDate = addDays(monthEnd, 6 - monthEnd.getDay());

  const rows: JSX.Element[] = [];
  let days: JSX.Element[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const outOfMonth = !isSameMonth(day, monthStart);
      const today = isToday(day);

      const dayEvents = events.filter(
        (e) => new Date(e.date).toDateString() === cloneDay.toDateString()
      );

      const showWeekday = day <= addDays(startDate, 6); // only first row shows weekday

      days.push(
        <DayCell
          key={day.toString()}
          date={cloneDay}
          isToday={today}
          isOutOfMonth={outOfMonth}
          events={dayEvents}
          showWeekday={showWeekday}
          onClick={(date) => openEditModal(date)}
          onAddClick={(date) => openEditModal(date)}
          onEventClick={(event) => openEditModal(new Date(event.date), event)}
          onOverflowClick={(date) => openViewModal(date)}
        />
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-0">
        {days}
      </div>
    );
    days = [];
  }

  return <div className="flex-1 overflow-y-auto">{rows}</div>;
};

export default CalendarGrid;
