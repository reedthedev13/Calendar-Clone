import React, { createContext, useContext } from "react";
import type { CalendarEvent } from "../types/Event";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface EventsContextType {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>("events", []);

  const addEvent = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(
      events.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((evt) => evt.id !== id));
  };

  return (
    <EventsContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) throw new Error("useEvents must be used within EventsProvider");
  return context;
};
