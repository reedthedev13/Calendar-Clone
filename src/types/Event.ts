export type EventColor = "red" | "blue" | "green";

export interface CalendarEvent {
  id: string; // unique identifier (uuid or timestamp string)
  name: string;
  allDay: boolean;
  startTime?: string; // "HH:MM"
  endTime?: string; // "HH:MM"
  date: string; // ISO string "YYYY-MM-DD"
  color: EventColor;
}
