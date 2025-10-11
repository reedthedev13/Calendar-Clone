import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import type { CalendarEvent } from "../../types/Event";
import EventBadge from "./EventBadge";
import {
  format,
  startOfDay,
  isBefore,
  isToday as checkIsToday,
} from "date-fns";
import { sortEvents } from "../../utils/sortEvents";

interface DayCellProps {
  date: Date;
  isToday: boolean;
  isOutOfMonth: boolean;
  events: CalendarEvent[];
  showWeekday: boolean;
  onClick: (date: Date) => void;
  onAddClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onOverflowClick: (date: Date) => void;
}

const DEFAULT_MAX_VISIBLE_EVENTS = 3;

const DayCell: React.FC<DayCellProps> = ({
  date,
  isToday,
  isOutOfMonth,
  events,
  showWeekday,
  onClick,
  onAddClick,
  onEventClick,
  onOverflowClick,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const todayStart = startOfDay(new Date());
  const isPast = isBefore(startOfDay(date), todayStart) && !checkIsToday(date);

  // Sorted events
  const sortedEvents = useMemo(() => sortEvents(events), [events]);
  const allDayEvents = useMemo(
    () => sortedEvents.filter((e) => e.allDay),
    [sortedEvents]
  );
  const timedEvents = useMemo(
    () => sortedEvents.filter((e) => !e.allDay),
    [sortedEvents]
  );

  const maxVisibleEvents = isMobile ? 2 : DEFAULT_MAX_VISIBLE_EVENTS;

  const visibleEvents = useMemo(() => {
    return isMobile
      ? allDayEvents.slice(0, maxVisibleEvents)
      : [...allDayEvents, ...timedEvents].slice(0, maxVisibleEvents);
  }, [allDayEvents, timedEvents, maxVisibleEvents, isMobile]);

  const extraCount = useMemo(
    () => sortedEvents.length - visibleEvents.length,
    [sortedEvents, visibleEvents]
  );

  // Handlers
  const handleClick = useCallback(() => onClick(date), [onClick, date]);
  const handleAddClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddClick(date);
    },
    [onAddClick, date]
  );
  const handleOverflowClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onOverflowClick(date);
    },
    [onOverflowClick, date]
  );
  const handleEventClick = useCallback(
    (event: CalendarEvent) => onEventClick(event),
    [onEventClick]
  );

  return (
    <div
      className={`group min-h-[7rem] sm:min-h-[8rem] md:min-h-[9rem] border-[0.5px] border-[#dadce0] relative overflow-hidden transition-colors cursor-pointer
        ${isOutOfMonth ? "bg-[#dadce0] text-[#777]" : "bg-white text-[#333]"}
        ${isPast ? "opacity-50" : ""}
        hover:bg-[#f1f3f4] flex flex-col items-center`}
      onClick={handleClick}
    >
      {/* Weekday (first row only) */}
      {showWeekday && (
        <div className="text-[10px] sm:text-xs md:text-sm font-medium text-[#777] mb-1">
          {format(date, "EEE")}
        </div>
      )}

      {/* "+" Add button */}
      <button
        className="absolute top-1 right-1 text-[10px] sm:text-xs text-gray-500 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:text-gray-700"
        onClick={handleAddClick}
      >
        +
      </button>

      {/* Day number */}
      <div className="relative flex items-center justify-center">
        {isToday && (
          <span className="absolute w-4 h-4 rounded-full bg-[hsl(200,80%,50%)]" />
        )}
        <span
          className={`z-10 text-[10px] sm:text-[11px] font-normal ${
            isToday
              ? "text-white"
              : isOutOfMonth
              ? "text-[#777]"
              : "text-[#333]"
          }`}
        >
          {format(date, "d")}
        </span>
      </div>

      {/* Events + +X More */}
      <div className="mt-1 sm:mt-2 flex flex-col gap-0.5 sm:gap-1 w-full px-1 flex-1 justify-between">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className={`w-full flex items-center ${
                event.allDay ? "justify-center" : "justify-start"
              }`}
            >
              <EventBadge event={event} onClick={handleEventClick} />
            </div>
          ))}
        </div>

        {extraCount > 0 && (
          <div className="w-full flex justify-center mt-1">
            <button
              className="text-[11px] sm:text-xs font-bold text-black hover:text-gray-800 hover:scale-105 hover:shadow-sm transition-all duration-150"
              onClick={handleOverflowClick}
            >
              +{extraCount} More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// DayCell
export default memo(DayCell, (prev, next) => {
  return (
    prev.date.toDateString() === next.date.toDateString() &&
    prev.isToday === next.isToday &&
    prev.isOutOfMonth === next.isOutOfMonth &&
    prev.showWeekday === next.showWeekday &&
    prev.events === next.events
  );
});
