import React, { useState, useEffect } from "react";
import { useEvents } from "../../contexts/EventsContext";
import type { CalendarEvent } from "../../types/Event";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import EventModal from "../modal/EventModal";
import ViewModal from "../modal/ViewModal";
import { useCalendar } from "../../hooks/useCalendar";
import { addDays, subDays } from "date-fns";

const Calendar: React.FC = () => {
  const { events, addEvent, updateEvent } = useEvents();
  const { currentMonth, monthDays, prevMonth, nextMonth, thisMonth } =
    useCalendar();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewEvents, setViewEvents] = useState<CalendarEvent[]>([]);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  // Keyboard navigation for the calendar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedDate) return;
      let newDate: Date | null = null;

      switch (e.key) {
        case "ArrowRight":
          newDate = addDays(focusedDate, 1);
          break;
        case "ArrowLeft":
          newDate = subDays(focusedDate, 1);
          break;
        case "ArrowUp":
          newDate = subDays(focusedDate, 7);
          break;
        case "ArrowDown":
          newDate = addDays(focusedDate, 7);
          break;
        case "Enter":
          e.preventDefault();
          openEditModal(focusedDate);
          break;
      }

      if (newDate) {
        e.preventDefault();
        setFocusedDate(newDate);
        const el = document.querySelector<HTMLDivElement>(
          `[data-date='${newDate.toISOString()}']`
        );
        el?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedDate]);

  const openEditModal = (date: Date, event?: CalendarEvent) => {
    setSelectedDate(date);
    setSelectedEvent(event ?? null);
    setIsEditModalOpen(true);
    setFocusedDate(date);
  };

  const openViewModal = (data: Date | CalendarEvent[]) => {
    let selectedEvents: CalendarEvent[] = [];

    if (data instanceof Date) {
      selectedEvents = events.filter(
        (e) => new Date(e.date).toDateString() === data.toDateString()
      );
      setSelectedDate(data);
      setFocusedDate(data);
    } else if (Array.isArray(data)) {
      selectedEvents = data;
      if (data.length > 0) {
        const firstDate = new Date(data[0].date);
        setSelectedDate(firstDate);
        setFocusedDate(firstDate);
      }
    }

    setViewEvents(selectedEvents);
    setIsViewModalOpen(true);
  };

  const handleViewModalEventClick = (event: CalendarEvent) => {
    openEditModal(new Date(event.date), event);
  };

  return (
    <div className="max-w-[1500px] mx-auto min-h-[80vh] flex flex-col">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onToday={thisMonth}
      />

      <CalendarGrid
        currentMonth={currentMonth}
        monthDays={monthDays}
        events={events}
        openEditModal={openEditModal}
        openViewModal={openViewModal}
        focusedDate={focusedDate}
        setFocusedDate={setFocusedDate}
      />

      {isViewModalOpen && selectedDate && (
        <ViewModal
          date={selectedDate}
          events={events.filter(
            (e) =>
              new Date(e.date).toDateString() === selectedDate.toDateString()
          )}
          onEventClick={handleViewModalEventClick}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {isEditModalOpen && selectedDate && (
        <EventModal
          isOpen
          selectedDate={selectedDate}
          event={selectedEvent ?? undefined}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(savedEvent) => {
            if (selectedEvent) updateEvent(savedEvent);
            else addEvent(savedEvent);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
