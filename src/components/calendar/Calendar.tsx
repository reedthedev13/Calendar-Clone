import React, { useState } from "react";
import { JSX } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday,
  format,
} from "date-fns";
import DayCell from "./DayCell";
import EventModal from "../modal/EventModal";
import ViewModal from "../modal/ViewModal";
import { useEvents } from "../../contexts/EventsContext";
import type { CalendarEvent } from "../../types/Event";

const Calendar: React.FC = () => {
  const { events, addEvent, updateEvent } = useEvents();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDayForOverflow, setSelectedDayForOverflow] =
    useState<Date | null>(null);

  // Navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const thisMonth = () => setCurrentMonth(new Date());

  // Handlers
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleAddClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.date));
    setIsModalOpen(true);
  };

  const handleViewModalEventClick = (event: CalendarEvent) => {
    setIsViewModalOpen(false); // close view modal first

    setTimeout(() => {
      setSelectedEvent(event);
      setSelectedDate(new Date(event.date));
      setIsModalOpen(true);
    }, 150);
  };

  const handleOverflowClick = (date: Date) => {
    setSelectedDayForOverflow(date);
    setIsViewModalOpen(true);
  };

  // Calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const rows: JSX.Element[] = [];
  let days: JSX.Element[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const outOfMonth = !isSameMonth(day, monthStart);
      const today = isToday(day);

      const dayEvents = events.filter(
        (e) => new Date(e.date).toDateString() === cloneDay.toDateString()
      );

      days.push(
        <DayCell
          key={day.toString()}
          date={cloneDay}
          isToday={today}
          isOutOfMonth={outOfMonth}
          events={dayEvents}
          onClick={handleDayClick}
          onAddClick={handleAddClick}
          onEventClick={handleEventClick}
          onOverflowClick={handleOverflowClick}
        />
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="max-w-[1500px] mx-auto h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-[#dadce0]">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={thisMonth}
            className="px-2 sm:px-3 py-1 text-sm border border-[#dadce0] rounded hover:bg-[#f1f3f4] transition"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="px-2 sm:px-3 py-1 text-sm border border-[#dadce0] rounded hover:bg-[#f1f3f4] transition"
          >
            &lt;
          </button>
          <button
            onClick={nextMonth}
            className="px-2 sm:px-3 py-1 text-sm border border-[#dadce0] rounded hover:bg-[#f1f3f4] transition"
          >
            &gt;
          </button>
          <h2 className="ml-2 text-lg sm:text-xl font-semibold text-[#333]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-[10px] sm:text-xs md:text-sm text-[#777] font-medium py-1 sm:py-2 border-b border-[#dadce0]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="flex-1 overflow-y-auto">{rows}</div>

      {/* Event Modal */}
      {isModalOpen && selectedDate && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          event={selectedEvent ?? undefined}
          onSave={(savedEvent: CalendarEvent) => {
            if (selectedEvent) updateEvent(savedEvent);
            else addEvent(savedEvent);
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Overflow Modal */}
      {isViewModalOpen && selectedDayForOverflow && (
        <ViewModal
          date={selectedDayForOverflow}
          events={events.filter(
            (e) =>
              new Date(e.date).toDateString() ===
              selectedDayForOverflow.toDateString()
          )}
          onEventClick={handleViewModalEventClick}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
