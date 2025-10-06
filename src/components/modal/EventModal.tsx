import React, { useEffect, useState } from "react";
import { CalendarEvent } from "../../types/Event";
import { useEvents } from "../../contexts/EventsContext";
import { format, isValid } from "date-fns";
import ModalWrapper from "../ModalWrapper";

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
  }, [event, selectedDate]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    if (!allDay && (!startTime || !endTime)) {
      alert("Start and end time are required");
      return;
    }
    if (!allDay && startTime && endTime && startTime > endTime) {
      alert("Start time must be before end time");
      return;
    }

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

  // Enter key to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [name, allDay, startTime, endTime, date, color]);

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-full">
      <h2 className="text-lg font-semibold mb-4">
        {event
          ? "Edit Event"
          : `Add Event for ${format(selectedDate, "MMM d, yyyy")}`}
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event name"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div className="flex items-center gap-2">
          <label>
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
            />{" "}
            All Day
          </label>
        </div>

        {!allDay && (
          <>
            <input
              type="time"
              value={startTime ? format(startTime, "HH:mm") : ""}
              onChange={(e) =>
                setStartTime(combineDateAndTime(date, e.target.value))
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="time"
              value={endTime ? format(endTime, "HH:mm") : ""}
              onChange={(e) =>
                setEndTime(combineDateAndTime(date, e.target.value))
              }
              className="w-full border p-2 rounded"
            />
          </>
        )}

        <div className="flex gap-2 mt-2">
          {(["red", "blue", "green"] as const).map((c) => (
            <button
              key={c}
              type="button"
              className={`w-6 h-6 rounded cursor-pointer border-2 transition ${
                color === c ? "border-black" : "border-transparent"
              }`}
              style={{
                backgroundColor:
                  c === "red"
                    ? "hsl(0,75%,60%)"
                    : c === "blue"
                    ? "hsl(200,80%,50%)"
                    : "hsl(150,80%,30%)",
              }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {event && (
            <button
              type="button"
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
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
