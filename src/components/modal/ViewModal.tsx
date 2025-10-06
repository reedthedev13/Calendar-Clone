import React, { useEffect } from "react";
import type { CalendarEvent } from "../../types/Event";
import ModalWrapper from "../ModalWrapper";

interface ViewModalProps {
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
  onEventClick: (event: CalendarEvent) => void;
}

const colorMap: Record<string, string> = {
  red: "bg-[hsl(0,75%,60%)]",
  blue: "bg-[hsl(200,80%,50%)]",
  green: "bg-[hsl(150,80%,30%)]",
};

const ViewModalContent: React.FC<ViewModalProps & { onClose: () => void }> = ({
  date,
  events,
  onEventClick,
  onClose,
}) => {
  const sortedEvents = [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.startTime && b.startTime)
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    return 0;
  });

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
        Events on {date.toDateString()}
      </h2>

      <div className="flex flex-col gap-2">
        {sortedEvents.map((event) => {
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
            <button
              key={event.id}
              className={`flex items-center gap-2 px-2 py-1 rounded text-sm ${
                event.allDay
                  ? `${
                      colorMap[event.color]
                    } text-white hover:brightness-90 transition`
                  : "hover:bg-gray-100 text-[#333] transition"
              }`}
              onClick={() => onEventClick(event)}
            >
              {isTimed && (
                <span
                  className={`w-2 h-2 rounded-full ${colorMap[event.color]}`}
                />
              )}
              {isTimed && <span className="text-xs">{timeLabel}</span>}
              <span className="truncate">{event.name}</span>
              {event.allDay && (
                <span className="ml-auto text-xs">(All Day)</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ViewModal: React.FC<ViewModalProps> = (props) => {
  return (
    <ModalWrapper isOpen={props.events.length > 0} onClose={props.onClose}>
      <ViewModalContent {...props} />
    </ModalWrapper>
  );
};

export default ViewModal;
