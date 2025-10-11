import React, { memo, useCallback } from "react";
import type { CalendarEvent } from "../../types/Event";
import DayCell from "./DayCell";

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
  const rows: React.ReactNode[] = [];
  let days: React.ReactNode[] = [];

  monthDays.forEach((day, idx) => {
    const isOutOfMonth = day.getMonth() !== currentMonth.getMonth();
    const isToday = new Date().toDateString() === day.toDateString();

    // Filter events for this day
    const dayEvents = events.filter(
      (e) => new Date(e.date).toDateString() === day.toDateString()
    );

    const showWeekday = idx < 7; // Only first row shows weekdays

    // Memoized handlers
    const handleClick = useCallback(
      () => openEditModal(day),
      [day, openEditModal]
    );
    const handleAddClick = useCallback(
      () => openEditModal(day),
      [day, openEditModal]
    );
    const handleOverflowClick = useCallback(
      () => openViewModal(day),
      [day, openViewModal]
    );
    const handleEventClick = useCallback(
      (event: CalendarEvent) => openEditModal(new Date(event.date), event),
      [openEditModal]
    );

    days.push(
      <DayCell
        key={day.toISOString()}
        date={day}
        isToday={isToday}
        isOutOfMonth={isOutOfMonth}
        events={dayEvents}
        showWeekday={showWeekday}
        onClick={handleClick}
        onAddClick={handleAddClick}
        onEventClick={handleEventClick}
        onOverflowClick={handleOverflowClick}
      />
    );

    if ((idx + 1) % 7 === 0) {
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      );
      days = [];
    }
  });

  return <div className="flex-1 overflow-y-auto">{rows}</div>;
};

// CalendarGrid
export default memo(
  CalendarGrid,
  (prevProps, nextProps) =>
    prevProps.currentMonth.getTime() === nextProps.currentMonth.getTime() &&
    prevProps.monthDays.length === nextProps.monthDays.length &&
    prevProps.events.length === nextProps.events.length
);
