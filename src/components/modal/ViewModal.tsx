import React, { useEffect, useRef } from "react";
import type { CalendarEvent } from "../../types/Event";
import ModalWrapper from "./ModalWrapper";
import { X } from "lucide-react";
import { sortEvents } from "../../utils/sortEvents";

interface ViewModalProps {
  date: Date;
  events?: CalendarEvent[];
  onClose: () => void;
  onEventClick: (event: CalendarEvent) => void;
}

const colorMap: Record<string, string> = {
  red: "bg-[hsl(0,75%,60%)]",
  blue: "bg-[hsl(200,80%,50%)]",
  green: "bg-[hsl(150,80%,30%)]",
};

const ViewModal: React.FC<ViewModalProps> = ({
  date,
  events = [],
  onClose,
  onEventClick,
}) => {
  const sortedEvents = sortEvents(events);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus the close button on open
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Focus trap inside the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <ModalWrapper isOpen={events.length > 0} onClose={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-modal-title"
        aria-describedby="view-modal-description"
        className="bg-white rounded-lg p-6 w-full max-w-sm relative max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            id="view-modal-title"
            className="text-2xl font-medium text-[#333]"
          >
            Events on {date.toLocaleDateString()}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close event list modal"
            className="text-gray-700 hover:text-gray-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p id="view-modal-description" className="sr-only">
          List of all events occurring on the selected date. You can select an
          event to view or edit details.
        </p>

        {/* Event list */}
        {sortedEvents.length === 0 ? (
          <p className="text-gray-500 text-sm" aria-live="polite">
            No events for this day.
          </p>
        ) : (
          <ul
            className="flex flex-col gap-2"
            role="list"
            aria-label="Events for the selected date"
          >
            {sortedEvents.map((event) => {
              const isTimed = !event.allDay && event.startTime;
              const timeLabel =
                isTimed && event.startTime
                  ? new Date(event.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

              return (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => onEventClick(event)}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition w-full text-left ${
                      event.allDay
                        ? `${
                            colorMap[event.color]
                          } text-white hover:brightness-90`
                        : "hover:bg-gray-100 text-[#333]"
                    }`}
                    aria-label={
                      event.allDay
                        ? `${event.name}, all day event`
                        : `${event.name} at ${timeLabel}`
                    }
                  >
                    {isTimed && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          colorMap[event.color]
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    {isTimed && (
                      <span className="text-xs" aria-hidden="true">
                        {timeLabel}
                      </span>
                    )}
                    <span className="truncate">{event.name}</span>
                    {event.allDay && (
                      <span className="ml-auto text-xs">(All Day)</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ModalWrapper>
  );
};

export default ViewModal;
