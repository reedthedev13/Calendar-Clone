import React from "react";
import Calendar from "./components/calendar/Calendar";
import { EventsProvider } from "./contexts/EventsContext";

const App: React.FC = () => {
  return (
    <EventsProvider>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <Calendar />
      </div>
    </EventsProvider>
  );
};

export default App;
