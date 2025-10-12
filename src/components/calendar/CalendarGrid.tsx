import React, { memo, useRef, useState, useEffect, useCallback } from "react";
import type { CalendarEvent } from "../../types/Event";
import DayCell from "./DayCell";

export interface CalendarGridProps {
  currentMonth: Date;
  monthDays?: Date[];
  events?: CalendarEvent[];
  openEditModal: (date: Date, event?: CalendarEvent) => void;
  openViewModal: (events: CalendarEvent[]) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  monthDays = [],
  events = [],
  openEditModal,
  openViewModal,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellHeight, setCellHeight] = useState(144);

  // dynamic cell height
  useEffect(() => {
    if (!gridRef.current) return;

    const updateCellHeight = () => {
      const gridHeight = gridRef.current?.clientHeight || 0;
      const numRows = Math.ceil(monthDays.length / 7) || 1;
      const rowGap = 4;
      const availableHeight = gridHeight - rowGap * (numRows - 1);
      setCellHeight(Math.floor(availableHeight / numRows));
    };

    const observer = new ResizeObserver(updateCellHeight);
    observer.observe(gridRef.current);
    window.addEventListener("resize", updateCellHeight);
    updateCellHeight();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateCellHeight);
    };
  }, [monthDays.length]);

  // stable event handler
  const handleEventClick = useCallback(
    (event: CalendarEvent) => openEditModal(new Date(event.date), event),
    [openEditModal]
  );

  // helper to generate handlers per day without hooks inside loop
  const getDayHandlers = (day: Date, dayEvents: CalendarEvent[]) => {
    return {
      onClick: () => openEditModal(day),
      onAddClick: () => openEditModal(day),
      onOverflowClick: () => openViewModal(dayEvents),
    };
  };

  const rows: React.ReactNode[] = [];
  let days: React.ReactNode[] = [];

  monthDays.forEach((day, idx) => {
    const isOutOfMonth = day.getMonth() !== currentMonth.getMonth();
    const isToday = new Date().toDateString() === day.toDateString();

    const dayEvents = events.filter(
      (e) => new Date(e.date).toDateString() === day.toDateString()
    );
    const showWeekday = idx < 7;

    const { onClick, onAddClick, onOverflowClick } = getDayHandlers(
      day,
      dayEvents
    );

    days.push(
      <DayCell
        key={day.toISOString()}
        date={day}
        isToday={isToday}
        isOutOfMonth={isOutOfMonth}
        events={dayEvents}
        showWeekday={showWeekday}
        onClick={onClick}
        onAddClick={onAddClick}
        onEventClick={handleEventClick}
        onOverflowClick={onOverflowClick}
        style={{ height: `${cellHeight}px` }}
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

  return (
    <div
      ref={gridRef}
      className="flex-1 overflow-y-auto min-h-[200px] max-h-[80vh]"
    >
      {rows}
    </div>
  );
};

export default memo(
  CalendarGrid,
  (prevProps, nextProps) =>
    prevProps.currentMonth.getTime() === nextProps.currentMonth.getTime() &&
    prevProps.monthDays?.length === nextProps.monthDays?.length &&
    prevProps.events?.length === nextProps.events?.length
);
