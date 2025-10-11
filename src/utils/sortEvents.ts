import type { CalendarEvent } from "../types/Event";

// Sort events: all-day first, then timed by startTime
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    if (a.startTime && b.startTime) {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }
    return 0;
  });
}
