import React, { useMemo, useCallback, memo, CSSProperties } from "react";
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
  onOverflowClick: (overflowEvents: CalendarEvent[]) => void;
  style?: CSSProperties;
  maxVisibleEvents: number;
}

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
  style,
  maxVisibleEvents,
}) => {
  const sortedEvents = useMemo(() => sortEvents(events), [events]);
  const visibleEvents = sortedEvents.slice(0, maxVisibleEvents);
  const overflowEvents = sortedEvents.slice(maxVisibleEvents);

  const isPast = useMemo(() => {
    const todayStart = startOfDay(new Date());
    return isBefore(startOfDay(date), todayStart) && !checkIsToday(date);
  }, [date]);

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
      onOverflowClick(overflowEvents);
    },
    [onOverflowClick, overflowEvents]
  );
  const handleEventClick = useCallback(
    (event: CalendarEvent) => onEventClick(event),
    [onEventClick]
  );

  return (
    <div
      className={`group border-[0.5px] border-[#dadce0] relative overflow-hidden transition-colors cursor-pointer
      ${isOutOfMonth ? "bg-[#dadce0] text-[#777]" : "bg-white text-[#333]"}
      ${isPast ? "opacity-50" : ""}
      hover:bg-[#f1f3f4] flex flex-col items-center`}
      style={style}
      onClick={handleClick}
    >
      {showWeekday && (
        <div className="text-[10px] sm:text-xs md:text-sm font-medium text-[#777] mb-1">
          {format(date, "EEE")}
        </div>
      )}

      <button
        className="absolute top-1 right-1 text-[10px] sm:text-xs text-gray-500 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:text-gray-700"
        onClick={handleAddClick}
      >
        +
      </button>

      <div className="relative flex items-center justify-center">
        {isToday && (
          <span className="absolute w-4 h-3 rounded-full bg-[hsl(200,80%,50%)]" />
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

      <div className="mt-1 sm:mt-2 flex flex-col gap-0.5 sm:gap-1 w-full px-1 overflow-hidden">
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

      {overflowEvents.length > 0 && (
        <div className="w-full flex justify-center mt-auto">
          <button
            className="text-[11px] sm:text-xs font-bold text-black hover:text-gray-800 hover:scale-105 hover:shadow-sm transition-all duration-150"
            onClick={handleOverflowClick}
          >
            +{overflowEvents.length} More
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(DayCell);
