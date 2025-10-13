import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import type { CalendarEvent } from "../../types/Event";
import DayCell from "./DayCell";

export interface CalendarGridProps {
  currentMonth: Date;
  monthDays: Date[];
  events: CalendarEvent[];
  openEditModal: (date: Date, event?: CalendarEvent) => void;
  openViewModal: (events: CalendarEvent[]) => void;
  focusedDate?: Date | null;
  setFocusedDate?: React.Dispatch<React.SetStateAction<Date | null>>;
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
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

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
    (day: Date, event?: CalendarEvent) => openEditModal(day, event),
    [openEditModal]
  );

  const handleOverflowClick = useCallback(
    (dayEvents: CalendarEvent[]) => openViewModal(dayEvents),
    [openViewModal]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (focusedIndex === null) return;

    let newIndex = focusedIndex;

    switch (e.key) {
      case "ArrowRight":
        newIndex = Math.min(focusedIndex + 1, monthDays.length - 1);
        break;
      case "ArrowLeft":
        newIndex = Math.max(focusedIndex - 1, 0);
        break;
      case "ArrowDown":
        newIndex = Math.min(focusedIndex + 7, monthDays.length - 1);
        break;
      case "ArrowUp":
        newIndex = Math.max(focusedIndex - 7, 0);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        const day = monthDays[focusedIndex];
        const dayEvents = events.filter(
          (ev) => new Date(ev.date).toDateString() === day.toDateString()
        );
        if (dayEvents.length > 0) handleOverflowClick(dayEvents);
        else handleEditClick(day);
        return;
      default:
        return;
    }

    setFocusedIndex(newIndex);
    e.preventDefault();
    const newDayCell =
      gridRef.current?.querySelectorAll<HTMLElement>('[role="gridcell"]')[
        newIndex
      ];
    newDayCell?.focus();
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
        tabIndex={focusedIndex === idx ? 0 : -1}
        role="gridcell"
        aria-selected={isToday}
        aria-label={`${day.toDateString()} with ${dayEvents.length} events`}
        onFocus={() => setFocusedIndex(idx)}
      />
    );

    if ((idx + 1) % 7 === 0) {
      rows.push(
        <div
          key={day.toISOString()}
          className="grid grid-cols-7 gap-0"
          role="row"
        >
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
      role="grid"
      aria-label="Calendar"
      onKeyDown={handleKeyDown}
    >
      {rows}
    </div>
  );
};

export default memo(CalendarGrid);
