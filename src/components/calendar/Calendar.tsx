import React, { useState } from "react";
import { useEvents } from "../../contexts/EventsContext";
import type { CalendarEvent } from "../../types/Event";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import EventModal from "../modal/EventModal";
import ViewModal from "../modal/ViewModal";
import { useCalendar } from "../../hooks/useCalendar";

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

  const openEditModal = (date: Date, event?: CalendarEvent) => {
    setSelectedDate(date);
    setSelectedEvent(event ?? null);
    setIsEditModalOpen(true);
  };

  const openViewModal = (data: Date | CalendarEvent[]) => {
    let selectedEvents: CalendarEvent[] = [];

    if (data instanceof Date) {
      selectedEvents = events.filter(
        (e) => new Date(e.date).toDateString() === data.toDateString()
      );
      setSelectedDate(data);
    } else if (Array.isArray(data)) {
      selectedEvents = data;
      if (data.length > 0) setSelectedDate(new Date(data[0].date));
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
