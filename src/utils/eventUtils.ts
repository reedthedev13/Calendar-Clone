import type { CalendarEvent } from "../types/Event";

export const colorMap: Record<CalendarEvent["color"], string> = {
  red: "hsl(0,75%,60%)",
  blue: "hsl(200,80%,50%)",
  green: "hsl(150,80%,30%)",
};
