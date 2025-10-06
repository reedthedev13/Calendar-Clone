import React, { useEffect, useState } from "react";
import type { CalendarEvent } from "../../types/Event";
import EventBadge from "./EventBadge";
import {
  format,
  startOfDay,
  isBefore,
  isToday as checkIsToday,
} from "date-fns";

interface DayCellProps {
  date: Date;
  isToday: boolean;
  isOutOfMonth: boolean;
  events: CalendarEvent[];
  onClick: (date: Date) => void;
  onAddClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onOverflowClick: (date: Date) => void;
}

const MAX_VISIBLE_EVENTS = 4;

const DayCell: React.FC<DayCellProps> = ({
  date,
  isToday,
  isOutOfMonth,
  events,
  onClick,
  onAddClick,
  onEventClick,
  onOverflowClick,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const todayStart = startOfDay(new Date());
  const isPast = isBefore(startOfDay(date), todayStart) && !checkIsToday(date);

  // Sort events: all-day first, then timed by startTime
  const sortedEvents = [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.startTime && b.startTime) {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }
    return 0;
  });

  const allDayEvents = sortedEvents.filter((e) => e.allDay);
  const timedEvents = sortedEvents.filter((e) => !e.allDay);

  const visibleEvents = isMobile
    ? allDayEvents.slice(0, MAX_VISIBLE_EVENTS)
    : [...allDayEvents, ...timedEvents].slice(0, MAX_VISIBLE_EVENTS);

  const extraCount = isMobile
    ? sortedEvents.length - visibleEvents.length
    : sortedEvents.length - MAX_VISIBLE_EVENTS;

  return (
    <div
      className={`group h-28 sm:h-32 md:h-36 border border-[#dadce0] relative transition-colors cursor-pointer
    ${isOutOfMonth ? "bg-[#dadce0] text-[#777]" : "bg-white text-[#333]"}
    ${isPast ? "opacity-50" : ""}
    hover:bg-[#f1f3f4] flex flex-col items-center`}
      onClick={() => onClick(date)}
    >
      {/* "+" Add button, only visible on hover */}
      <button
        className="absolute top-1 right-1 text-[10px] sm:text-xs text-gray-500 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:text-gray-700"
        onClick={(e) => {
          e.stopPropagation();
          onAddClick(date);
        }}
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

      {/* Events */}
      <div className="mt-1 sm:mt-2 flex flex-col gap-0.5 sm:gap-1 w-full px-1">
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className={`w-full flex items-center ${
              event.allDay ? "justify-center" : "justify-start"
            }`}
          >
            <EventBadge
              event={event}
              onClick={(event) => onEventClick(event)}
            />
          </div>
        ))}

        {extraCount > 0 && (
          <button
            className="text-[11px] sm:text-xs font-bold text-black mt-1 mx-auto 
        hover:text-gray-800 hover:scale-105 hover:shadow-sm transition-all duration-150"
            onClick={(e) => {
              e.stopPropagation();
              onOverflowClick(date);
            }}
          >
            +{extraCount} More
          </button>
        )}
      </div>
    </div>
  );
};

export default DayCell;
