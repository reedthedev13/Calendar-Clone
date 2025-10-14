import React, { useEffect, useState, useRef } from "react";
import { CalendarEvent } from "../../types/Event";
import { useEvents } from "../../contexts/EventsContext";
import { format } from "date-fns";
import ModalWrapper from "./ModalWrapper";
import { X } from "lucide-react";

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  event?: CalendarEvent;
  onSave: (savedEvent: CalendarEvent) => void;
}

function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

const EventModalContent: React.FC<
  Omit<EventModalProps, "isOpen"> & { onClose: () => void }
> = ({ event, selectedDate, onClose, onSave }) => {
  const { addEvent, updateEvent, deleteEvent } = useEvents();

  const [name, setName] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState<Date>(selectedDate);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [color, setColor] = useState<"red" | "blue" | "green">("red");

  const [nameError, setNameError] = useState("");
  const [timeError, setTimeError] = useState("");

  // Accessibility: focus on first input when modal opens
  const firstInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (event) {
      setName(event.name);
      setAllDay(event.allDay);
      setDate(new Date(event.date));
      setStartTime(event.startTime ? new Date(event.startTime) : undefined);
      setEndTime(event.endTime ? new Date(event.endTime) : undefined);
      setColor(event.color);
    } else {
      setName("");
      setAllDay(false);
      setDate(selectedDate);
      setStartTime(undefined);
      setEndTime(undefined);
      setColor("red");
    }
    setNameError("");
    setTimeError("");
  }, [event, selectedDate]);

  const validateForm = (): boolean => {
    let valid = true;
    setNameError("");
    setTimeError("");

    if (!name.trim()) {
      setNameError("Event name is required.");
      valid = false;
    }

    if (!allDay) {
      if (!startTime || !endTime) {
        setTimeError("Start and end time are required for timed events.");
        valid = false;
      } else if (startTime.getTime() >= endTime.getTime()) {
        setTimeError("Start time must be before end time.");
        valid = false;
      }
    }

    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const newEvent: CalendarEvent = {
      id: event?.id || crypto.randomUUID(),
      name,
      date: date.toISOString(),
      allDay,
      startTime: allDay ? undefined : startTime?.toISOString(),
      endTime: allDay ? undefined : endTime?.toISOString(),
      color,
    };
    event ? updateEvent(newEvent) : addEvent(newEvent);
    onSave(newEvent);
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id);
      onClose();
    }
  };

  // Allow Enter key to submit form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      aria-describedby="event-modal-description"
      className="bg-white rounded-lg p-6 w-full max-w-sm relative overflow-y-auto max-h-[80vh]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 id="event-modal-title" className="text-2xl font-medium text-[#333]">
          {event ? "Edit Event" : "Add Event"}
        </h2>
        <p
          id="event-modal-description"
          className="text-base text-[#555]"
          aria-label={`Selected date: ${format(selectedDate, "MMMM dd, yyyy")}`}
        >
          {format(selectedDate, "MM/dd/yy")}
        </p>
        <button
          onClick={onClose}
          aria-label="Close event modal"
          className="text-gray-700 hover:text-gray-300 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Event Name */}
        <div>
          <label
            htmlFor="event-name"
            className="text-xs text-[#777] mb-1 block"
          >
            Name
          </label>
          <input
            id="event-name"
            ref={firstInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            placeholder="Event name"
            aria-required="true"
            aria-invalid={!!nameError}
            aria-describedby={nameError ? "name-error" : undefined}
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${
              nameError
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-indigo-400"
            }`}
          />
          {nameError && (
            <p id="name-error" className="text-red-500 text-xs mt-1">
              {nameError}
            </p>
          )}
        </div>

        {/* All Day */}
        <div className="flex items-center gap-2 text-sm text-[#555]">
          <input
            id="all-day"
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="accent-[hsl(200,80%,50%)]"
          />
          <label htmlFor="all-day">All Day?</label>
        </div>

        {/* Time Inputs */}
        {!allDay && (
          <fieldset aria-describedby={timeError ? "time-error" : undefined}>
            <legend className="sr-only">Event time range</legend>
            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label
                  htmlFor="start-time"
                  className="text-xs text-[#555] mb-1"
                >
                  Start Time
                </label>
                <input
                  id="start-time"
                  type="time"
                  value={startTime ? format(startTime, "HH:mm") : ""}
                  onChange={(e) =>
                    setStartTime(combineDateAndTime(date, e.target.value))
                  }
                  aria-invalid={!!timeError}
                  className={`w-full border p-2 rounded focus:ring-2 ${
                    timeError
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-indigo-400"
                  }`}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label htmlFor="end-time" className="text-xs text-[#555] mb-1">
                  End Time
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={endTime ? format(endTime, "HH:mm") : ""}
                  onChange={(e) =>
                    setEndTime(combineDateAndTime(date, e.target.value))
                  }
                  aria-invalid={!!timeError}
                  className={`w-full border p-2 rounded focus:ring-2 ${
                    timeError
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-indigo-400"
                  }`}
                />
              </div>
            </div>
            {timeError && (
              <p id="time-error" className="text-red-500 text-xs mt-1">
                {timeError}
              </p>
            )}
          </fieldset>
        )}

        {/* Color selection */}
        <fieldset>
          <legend className="text-xs text-[#555] mb-2">Color</legend>
          <div className="flex gap-2">
            {(["red", "blue", "green"] as const).map((c) => {
              const isSelected = color === c;
              const bgColor =
                c === "red"
                  ? "hsl(0,75%,60%)"
                  : c === "blue"
                  ? "hsl(200,80%,50%)"
                  : "hsl(150,80%,30%)";
              return (
                <button
                  key={c}
                  aria-pressed={isSelected}
                  aria-label={`Select ${c} color`}
                  type="button"
                  className={`w-6 h-6 rounded-md cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "scale-110 shadow-lg"
                      : "filter blur-[1px] opacity-50 hover:blur-0 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: bgColor, border: "none" }}
                  onClick={() => setColor(c)}
                />
              );
            })}
          </div>
        </fieldset>

        {/* Buttons */}
        <div className="flex justify-center mt-6 gap-3">
          <button
            type="submit"
            aria-label={event ? "Save event changes" : "Add new event"}
            className="flex-1 border border-[hsl(150,80%,30%)] bg-[hsl(150,80%,95%)] text-[hsl(150,80%,10%)] px-6 py-2 rounded hover:bg-[hsl(150,80%,90%)] transition"
          >
            {event ? "Edit" : "Add"}
          </button>
          {event && (
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete this event"
              className="flex-1 border border-[hsl(0,75%,60%)] bg-[hsl(0,75%,95%)] text-[hsl(0,75%,10%)] px-6 py-2 rounded hover:bg-[hsl(0,75%,90%)] transition"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const EventModal: React.FC<EventModalProps> = (props) => {
  return (
    <ModalWrapper isOpen={props.isOpen} onClose={props.onClose}>
      <EventModalContent {...props} />
    </ModalWrapper>
  );
};

export default EventModal;
