import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import type { CalendarEvent } from "../../types/Event";
import DayCell from "./DayCell";

export interface CalendarGridProps {
  currentMonth: Date;
  monthDays: Date[];
  events: CalendarEvent[];
  openEditModal: (date: Date, event?: CalendarEvent) => void;
  openViewModal: (events: CalendarEvent[]) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  monthDays,
  events,
  openEditModal,
  openViewModal,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellHeight, setCellHeight] = useState(144);

  // Dynamic cell height
  useEffect(() => {
    if (!gridRef.current) return;

    const updateCellHeight = () => {
      const gridHeight = gridRef.current?.clientHeight || 0;
      const numRows = Math.ceil(monthDays.length / 7);
      const gap = 4;
      const availableHeight = gridHeight - gap * (numRows - 1);
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

  // Handlers outside loop
  const handleEditClick = useCallback(
    (day: Date, event?: CalendarEvent) => {
      openEditModal(day, event);
    },
    [openEditModal]
  );

  const handleOverflowClick = useCallback(
    (events: CalendarEvent[]) => {
      openViewModal(events);
    },
    [openViewModal]
  );

  const rows: React.ReactNode[] = [];
  let days: React.ReactNode[] = [];

  monthDays.forEach((day, idx) => {
    const isOutOfMonth = day.getMonth() !== currentMonth.getMonth();
    const isToday = new Date().toDateString() === day.toDateString();
    const dayEvents = events.filter(
      (e) => new Date(e.date).toDateString() === day.toDateString()
    );
    const showWeekday = idx < 7;

    const maxVisibleEvents = Math.max(
      1,
      Math.floor((cellHeight - (showWeekday ? 18 : 0) - 32) / 24)
    );

    days.push(
      <DayCell
        key={day.toISOString()}
        date={day}
        isToday={isToday}
        isOutOfMonth={isOutOfMonth}
        events={dayEvents}
        showWeekday={showWeekday}
        onClick={() => handleEditClick(day)}
        onAddClick={() => handleEditClick(day)}
        onEventClick={(event) => handleEditClick(new Date(event.date), event)}
        onOverflowClick={() => handleOverflowClick(dayEvents)}
        style={{ height: `${cellHeight}px` }}
        maxVisibleEvents={maxVisibleEvents}
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

export default memo(CalendarGrid);
