# React Calendar App

A fully responsive calendar app built with React, TypeScript, and TailwindCSS.
Features include adding, editing, and deleting events, all-day and timed events, overflow handling, and smooth animations for modals and event badges.

## Features

- Add, edit, and delete calendar events.
- All-day and timed events support.
- Event colors (red, blue, green) with easy selection.
- Responsive calendar grid with proper alignment.
- Event overflow handling with "+More" button.
- Smooth animations for event badges, modals, and hover effects.
- Keyboard accessibility:
  - Enter to save
  - Escape to close modals

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/react-calendar-app.git
cd react-calendar-app
```

2. Install Dependencies:
   npm install
   or
   yarn install

3. Start the development server:
   npm run dev
   or
   yarn dev

---

## **5. Usage**

```markdown
## Usage

- Click on any day cell to add a new event.
- Click on an existing event to edit it.
- Hover over a day cell to reveal the "+" button for quick event creation.
- If a day has more than 4 events, click "+More" to view all events in a modal.
- Use keyboard shortcuts:
  - `Enter` to save an event
  - `Escape` to close a modal
```

## Notes

- Events are stored in the browser's LocalStorage for persistence.
- Modal open/close animations use Framer Motion for smooth transitions.
- Currently supports three event colors, but this can be extended easily.
