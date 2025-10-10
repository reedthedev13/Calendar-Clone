import React from "react";
import type { CalendarEvent } from "../../types/Event";
import ModalWrapper from "../ModalWrapper";
import { X } from "lucide-react";

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
    <div className="bg-white rounded-lg p-6 w-full max-w-sm relative max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-medium text-[#333]">
          Events on {date.toLocaleDateString()}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="text-gray-700 hover:text-gray-500 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Event List */}
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
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
                event.allDay
                  ? `${colorMap[event.color]} text-white hover:brightness-90`
                  : "hover:bg-gray-100 text-[#333]"
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
