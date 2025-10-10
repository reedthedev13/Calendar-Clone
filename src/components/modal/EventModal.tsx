import React, { useEffect, useState } from "react";
import { CalendarEvent } from "../../types/Event";
import { useEvents } from "../../contexts/EventsContext";
import { format } from "date-fns";
import ModalWrapper from "../ModalWrapper";
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
> = ({ event, selectedDate, onClose }) => {
  const { addEvent, updateEvent, deleteEvent } = useEvents();

  const [name, setName] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState<Date>(selectedDate);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [color, setColor] = useState<"red" | "blue" | "green">("red");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (event) {
      setName(event.name);
      setAllDay(event.allDay);
      setDate(new Date(event.date));
      setStartTime(event.startTime ? new Date(event.startTime) : undefined);
      setEndTime(event.endTime ? new Date(event.endTime) : undefined);
      setColor(event.color);
      setError("");
    } else {
      setName("");
      setAllDay(false);
      setDate(selectedDate);
      setStartTime(undefined);
      setEndTime(undefined);
      setColor("red");
      setError("");
    }
  }, [event, selectedDate]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError("Event name is required.");
      return false;
    }
    if (!allDay && (!startTime || !endTime)) {
      setError("Start and end time are required for timed events.");
      return false;
    }
    if (!allDay && startTime && endTime && startTime > endTime) {
      setError("Start time must be before end time.");
      return false;
    }
    setError("");
    return true;
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
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id);
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Add/Edit Event Title */}
        <h2 className="text-2xl font-medium text-[#333]">
          {event ? "Edit Event" : "Add Event"}
        </h2>

        {/* Date */}
        <p className="text-base text-[#555]">
          {format(selectedDate, "MM/dd/yy")}
        </p>

        {/* X Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="text-gray-700 hover:text-gray-300 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Event Name */}
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event name"
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${
              error && !name.trim()
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-indigo-400"
            }`}
          />
          {error && !name.trim() && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>

        {/* All Day */}
        <div className="flex items-center gap-2 text-sm text-[#555]">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="accent-[hsl(200,80%,50%)]"
          />
          <label>All Day?</label>
        </div>

        {/* Time Inputs */}
        {!allDay && (
          <div className="flex gap-4">
            <div className="flex flex-col w-1/2">
              <label className="text-xs text-[#555] mb-1">Start Time</label>
              <input
                type="time"
                value={startTime ? format(startTime, "HH:mm") : ""}
                onChange={(e) =>
                  setStartTime(combineDateAndTime(date, e.target.value))
                }
                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-xs text-[#555] mb-1">End Time</label>
              <input
                type="time"
                value={endTime ? format(endTime, "HH:mm") : ""}
                onChange={(e) =>
                  setEndTime(combineDateAndTime(date, e.target.value))
                }
                className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        )}

        {/* Color selection */}
        <div className="flex flex-col mt-2">
          <span className="text-xs text-[#555] mb-2">Color</span>
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
                  aria-label={`Select ${c} color`}
                  type="button"
                  className={`w-7 h-7 rounded-md cursor-pointer transition-all duration-200 ${
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
        </div>

        {/* Add/Save Button */}
        <div className="flex justify-center mt-6">
          {event && (
            <button
              type="button"
              onClick={handleDelete}
              className="border border-[hsl(0,75%,60%)] bg-[hsl(0,75%,95%)] text-[hsl(0,75%,10%)] px-3 py-1 rounded hover:bg-[hsl(0,75%,90%)] transition mr-3"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="border border-[hsl(150,80%,30%)] bg-[hsl(150,80%,95%)] text-[hsl(150,80%,10%)] px-6 py-2 rounded hover:bg-[hsl(150,80%,90%)] transition w-11/12 max-w-[380px]"
          >
            {event ? "Save" : "Add"}
          </button>
        </div>
      </div>
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
