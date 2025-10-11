import React from "react";
import type { CalendarEvent } from "../../types/Event";
import DayCell from "./DayCell";
import { JSX } from "react";

export interface CalendarGridProps {
  currentMonth: Date;
  monthDays: Date[];
  events: CalendarEvent[];
  openEditModal: (date: Date, event?: CalendarEvent) => void;
  openViewModal: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  monthDays,
  events,
  openEditModal,
  openViewModal,
}) => {
  const rows: JSX.Element[] = [];
  let days: JSX.Element[] = [];

  monthDays.forEach((day, idx) => {
    const isOutOfMonth = day.getMonth() !== currentMonth.getMonth();
    const isToday = new Date().toDateString() === day.toDateString();
    const dayEvents = events.filter(
      (e) => new Date(e.date).toDateString() === day.toDateString()
    );

    const showWeekday = idx < 7; // Only first row shows weekdays

    days.push(
      <DayCell
        key={day.toString()}
        date={day}
        isToday={isToday}
        isOutOfMonth={isOutOfMonth}
        events={dayEvents}
        showWeekday={showWeekday}
        onClick={(date) => openEditModal(date)}
        onAddClick={(date) => openEditModal(date)}
        onEventClick={(event) => openEditModal(new Date(event.date), event)}
        onOverflowClick={(date) => openViewModal(date)}
      />
    );

    if ((idx + 1) % 7 === 0) {
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      );
      days = [];
    }
  });

  return <div className="flex-1 overflow-y-auto">{rows}</div>;
};

export default CalendarGrid;
