import React from "react";
import type { CalendarEvent } from "../../types/Event";

interface EventBadgeProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
}

const colorMap: Record<string, string> = {
  red: "bg-[hsl(0,75%,60%)]",
  blue: "bg-[hsl(200,80%,50%)]",
  green: "bg-[hsl(150,80%,30%)]",
};

const EventBadge: React.FC<EventBadgeProps> = ({ event, onClick }) => {
  const isTimed = !event.allDay && event.startTime;

  let timeLabel = "";
  if (isTimed && event.startTime) {
    const startDate = new Date(event.startTime);
    if (!isNaN(startDate.getTime())) {
      timeLabel = startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  return (
    <div
      className={`w-full cursor-pointer rounded px-1 text-xs flex items-center gap-1
        ${
          event.allDay
            ? `${colorMap[event.color]} text-white hover:bg-[hsl(0,0%,30%)]`
            : "text-[#333] hover:bg-gray-100"
        }
        hover:scale-105 hover:shadow-md transition-all duration-150`}
      title={event.name}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
    >
      {isTimed && (
        <span
          className={`w-2 h-2 rounded-full ${
            colorMap[event.color]
          } flex-shrink-0`}
        />
      )}
      {isTimed && (
        <span className="text-[10px] w-12 text-left">{timeLabel}</span>
      )}
      <span className="truncate">{event.name}</span>
    </div>
  );
};

export default EventBadge;
