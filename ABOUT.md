Certainly! Here is a comprehensive `About.md` for your Timetable Generator system, covering all the requested sections:

---

# About the Timetable Generator System

## Overview

The Timetable Generator is a modern web application designed to help academic institutions efficiently schedule classes, rooms, and lecturers. It provides an intuitive interface for manual scheduling and features an intelligent auto-generation algorithm to quickly produce balanced, conflict-free timetables.

---

## 1. Design of the Proposed System

### 1.1 Input Design

- **Course Data:**  
  Users define courses with attributes such as course code, name, credits, lecturer, and duration.
- **Room Data:**  
  Users define available rooms, including name, type, and capacity.
- **Time Slots & Days:**  
  The system uses a fixed set of days (e.g., Monday–Friday) and time slots (e.g., 08:00–10:00).
- **Manual Assignment:**  
  Users can click on timetable cells to assign a course and room to a specific day and time slot.
- **Auto-Generation:**  
  Users can trigger the auto-generation algorithm to fill the timetable automatically.

### 1.2 Output Design

- **Timetable Grid:**  
  A visually appealing, interactive grid displays the schedule, with each cell representing a day/time slot.
- **Statistics Panel:**  
  Real-time statistics on room utilization, lecturer workload, and schedule health.
- **Export Options:**  
  Users can export the timetable as Excel (.xlsx), CSV, or PDF files.
- **Responsive UI:**  
  The interface is designed for clarity and usability on both desktop and mobile devices.

### 1.3 Database Design

**Note:**  
The current implementation uses in-memory data (React state). However, the following design can be used for a database-backed version:

#### Tables

- **Courses**
  - `id` (PK)
  - `name`
  - `code`
  - `credits`
  - `lecturer`
  - `duration`
- **Rooms**
  - `id` (PK)
  - `name`
  - `capacity`
  - `type`
- **Schedule**
  - `id` (PK)
  - `day`
  - `time_slot`
  - `course_id` (FK)
  - `room_id` (FK)

---

## 2. Data Dictionary

| Field         | Description                                 | Type    | Example                |
|---------------|---------------------------------------------|---------|------------------------|
| id            | Unique identifier                           | Integer | 1                      |
| name          | Name of course or room                      | String  | Computer Science 101   |
| code          | Course code                                 | String  | CS101                  |
| credits       | Number of credits                           | Integer | 3                      |
| lecturer      | Lecturer's name                             | String  | Dr. Smith              |
| duration      | Duration of class in hours                  | Float   | 2.0                    |
| capacity      | Room capacity                               | Integer | 50                     |
| type          | Room type                                   | String  | Classroom              |
| day           | Day of the week                             | String  | Monday                 |
| time_slot     | Time slot                                   | String  | 08:00-10:00            |
| course_id     | Reference to course                         | Integer | 1                      |
| room_id       | Reference to room                           | Integer | 2                      |

---

## 3. Auto-Generation Algorithm Principles & How It Works

### Principles

- **Randomized Assignment:**  
  The algorithm generates multiple random candidate schedules.
- **Fitness Evaluation:**  
  Each candidate is scored based on how evenly classes are distributed across days (and, in earlier versions, conflict minimization).
- **Selection:**  
  The best-scoring candidate is selected as the generated timetable.

### How It Works

1. **Generate Candidates:**  
   For a fixed number of iterations, create random assignments of courses to available slots and rooms.
2. **Score Each Candidate:**  
   Calculate a score based on the spread of classes across days (lower spread is better).
3. **Select the Best:**  
   The candidate with the highest score is chosen as the final schedule.

---

## 4. System Implementation & Requirements

### Requirements

- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **Modern Web Browser** (Chrome, Firefox, Edge, Safari)
- **No backend/database required** (unless extended)

### Key Libraries

- **React** (UI framework)
- **Vite** (development/build tool)
- **Tailwind CSS** (styling)
- **ExcelJS** (Excel export)
- **@react-pdf/renderer** (PDF export)
- **Lucide-react** (icons)

---

## 5. Choice of Development Environment

- **Frontend:**  
  React (with functional components and hooks) for a responsive, maintainable UI.
- **Build Tool:**  
  Vite for fast development and hot module replacement.
- **Styling:**  
  Tailwind CSS for utility-first, easily customizable styles.
- **Export:**  
  ExcelJS and @react-pdf/renderer for robust export options.

---

## 6. Implementation Architecture

- **Component-Based:**  
  The UI is split into reusable components (TimetableGrid, Header, StatisticsPanel, etc.).
- **Hooks:**  
  Custom React hooks manage data and business logic.
- **Utilities:**  
  Utility modules handle schedule generation, validation, and export.
- **State Management:**  
  React's useState and custom hooks manage all application state.

---

## 7. Testing & Evaluation

- **Manual Testing:**  
  - All UI features are tested for usability and responsiveness.
  - Export functions are tested for correct file generation.
  - Auto-generation is tested for balanced schedules.
- **Linting:**  
  ESLint is used to enforce code quality.
- **Evaluation:**  
  - The system is evaluated for ease of use, speed, and correctness of generated timetables.
  - User feedback is incorporated for UI/UX improvements.

---

## 8. User Manual

### Getting Started

1. **Install dependencies:**  
   ```bash
   npm install
   ```
2. **Start the development server:**  
   ```bash
   npm run dev
   ```
3. **Open the app:**  
   Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Using the App

- **View the Timetable:**  
  The main grid shows days and time slots. Click any cell to assign a class.
- **Assign a Class:**  
  Click a cell, select a course and room, and click "Assign."
- **Remove a Class:**  
  Click "Remove" in any assigned cell.
- **Auto-Generate:**  
  Click "Auto Generate" to fill the timetable automatically.
- **Clear All:**  
  Click "Clear All" to reset the timetable.
- **View Statistics:**  
  The panel below the timetable shows room utilization, lecturer workload, and schedule health.
- **Export:**  
  Use the "Export" button to download the timetable as Excel, CSV, or PDF.

### Tips

- The UI prevents double-booking and overlapping assignments.
- Use the auto-generation feature for quick scheduling, then fine-tune manually if needed.

---

## 9. Support & Customization

For further customization, database integration, or feature requests, please contact the development team or open an issue on the project repository.

---

**End of About.md**
