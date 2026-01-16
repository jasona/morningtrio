# Product Requirements Document: Daily Task Tracker v1

---
standards_version: 1.0.0
applied_standards:
  - global/principles.md
  - global/security-privacy.md
  - global/terminology.md
  - domains/code-architecture.md
  - phases/create-prd.md
research_reference: tasks/rsd-daily-task-tracker-v1.md
---

## 1. Overview

**Daily Task Tracker** is a personal, offline-first web application for daily task management. It implements the MIT (Most Important Tasks) methodology, helping the user focus on their top 3 priorities each day while managing carryover of incomplete tasks.

The app features a guided "Morning Planning" ritual that prompts the user to review yesterday's incomplete tasks and intentionally select today's Top 3 priorities.

### Key Characteristics
- **Personal use only** (single user, no authentication)
- **Offline-first** (works without internet, data stored locally)
- **Mobile-friendly** (responsive, touch-optimized)
- **PWA installable** (can be added to home screen)
- **Warm, friendly visual design** (subtle colors, rounded corners, gentle animations)

---

## 2. Problem Statement

**Current pain points:**
- Mental overhead of remembering what didn't get done yesterday
- Difficulty focusing when faced with a long, undifferentiated task list
- No structured way to identify the 3 most important things each day
- Existing task apps are either too complex or don't support this specific workflow

**User need:** A simple, focused tool that enforces the "Top 3 priorities + carryover" workflow without unnecessary features.

---

## 3. Goals

| Goal | Success Indicator |
|------|-------------------|
| G1: Reduce morning planning friction | User completes Morning Planning in under 2 minutes |
| G2: Enforce Top 3 focus | User cannot add more than 3 tasks to "Must Do Today" |
| G3: Prevent task loss | Incomplete tasks automatically surface for review next day |
| G4: Work anywhere | App functions fully offline; syncs to local storage |
| G5: Quick capture | Adding a new task takes under 5 seconds |

---

## 4. Non-Goals (Out of Scope for v1)

- **NG1:** Multi-user support or authentication
- **NG2:** Cloud sync or backup
- **NG3:** Due dates, deadlines, or calendar integration
- **NG4:** Time tracking or time estimates
- **NG5:** Recurring/repeating tasks
- **NG6:** Categories, tags, or projects
- **NG7:** Notifications or reminders
- **NG8:** Dark mode (future enhancement)
- **NG9:** Data export/import

---

## 5. User Stories

### US1: Morning Planning Ritual
> As a user starting my day, I want a guided flow that shows me yesterday's incomplete tasks and helps me choose today's Top 3, so that I start each day with clear priorities.

**Acceptance Criteria:**
- When I open the app and it's a new day, Morning Planning automatically starts
- I see yesterday's incomplete tasks and can promote them to today or dismiss them
- I'm guided to select up to 3 tasks as my "Must Do Today"
- I can add new tasks during planning
- Planning completes with a confirmation showing my Top 3

### US2: Quick Task Capture
> As a user with a new task in mind, I want to quickly add it to my list without interrupting my flow, so that I don't forget it.

**Acceptance Criteria:**
- Single input field always visible for adding tasks
- Press Enter or tap button to add
- New tasks go to "Other Tasks" by default
- Can optionally add directly to Top 3 if there's room

### US3: Prioritize Tasks
> As a user reviewing my list, I want to drag tasks to reorder them or promote them to my Top 3, so that I can adjust priorities as the day progresses.

**Acceptance Criteria:**
- Drag and drop to reorder within a section
- Drag from "Other Tasks" to "Top 3" (if room available)
- Drag from "Top 3" to "Other Tasks" to demote
- On mobile: provide "Move to Top 3" / "Move to Other" buttons as alternative

### US4: Complete Tasks
> As a user who finished a task, I want to mark it complete with satisfying feedback, so that I feel a sense of progress.

**Acceptance Criteria:**
- Tap/click checkbox to mark complete
- Completed tasks show strikethrough but remain visible
- Gentle animation on completion (checkmark, subtle color change)
- Completing all 3 Top 3 tasks triggers a celebration moment

### US5: Clear Completed Tasks
> As a user at the end of my day, I want to clear completed tasks from view, so that my list stays clean.

**Acceptance Criteria:**
- "Clear Completed" action available (button or swipe)
- Completed tasks are removed from view (not recoverable in v1)
- Action requires confirmation if more than 1 task being cleared

### US6: Offline Usage
> As a user without internet, I want the app to work fully offline, so that I can manage tasks anywhere.

**Acceptance Criteria:**
- App loads instantly from cache when offline
- All features work without network connection
- Data persists in browser storage (survives refresh/close)
- No error messages when offline

### US7: Mobile Installation
> As a mobile user, I want to install the app to my home screen, so that it feels like a native app.

**Acceptance Criteria:**
- PWA manifest configured correctly
- "Add to Home Screen" prompt available
- App opens in standalone mode (no browser chrome)
- Appropriate icons for various device sizes

---

## 6. Functional Requirements

### Task Management

| ID | Requirement | Priority | Traces To |
|----|-------------|----------|-----------|
| FR-1 | The system shall display tasks in two sections: "Must Do Today" (Top 3) and "Other Tasks" | Must Have | US1, US3, G2 |
| FR-2 | The "Must Do Today" section shall enforce a maximum of 3 tasks | Must Have | G2 |
| FR-3 | The system shall allow users to add a new task via a text input field | Must Have | US2, G5 |
| FR-4 | New tasks shall be added to "Other Tasks" by default | Must Have | US2 |
| FR-5 | The system shall allow users to mark tasks as complete via checkbox | Must Have | US4 |
| FR-6 | Completed tasks shall display with strikethrough styling and remain visible until cleared | Must Have | US4, US5 |
| FR-7 | The system shall provide a "Clear Completed" action to remove all completed tasks | Must Have | US5 |
| FR-8 | "Clear Completed" shall require confirmation when clearing more than 1 task | Should Have | US5 |
| FR-9 | The system shall allow users to delete an incomplete task | Must Have | - |
| FR-10 | Task deletion shall require confirmation | Should Have | - |

### Drag and Drop / Reordering

| ID | Requirement | Priority | Traces To |
|----|-------------|----------|-----------|
| FR-11 | Users shall be able to drag and drop tasks to reorder within a section | Must Have | US3 |
| FR-12 | Users shall be able to drag tasks from "Other Tasks" to "Must Do Today" (if fewer than 3 tasks present) | Must Have | US3, G2 |
| FR-13 | Users shall be able to drag tasks from "Must Do Today" to "Other Tasks" | Must Have | US3 |
| FR-14 | Drag interactions shall display visual feedback: grab handle icon, elevation shadow during drag, snap animation on drop | Must Have | US3 |
| FR-15 | On touch devices, the system shall provide "Move to Top 3" and "Move to Other" buttons as alternatives to drag | Must Have | US3 |
| FR-16 | The system shall prevent dropping a 4th task into "Must Do Today" and display a message: "Top 3 is full. Remove a task first." | Must Have | G2 |

### Morning Planning Ritual

| ID | Requirement | Priority | Traces To |
|----|-------------|----------|-----------|
| FR-17 | When the app is opened on a new calendar day, the Morning Planning flow shall start automatically | Must Have | US1, G1 |
| FR-18 | Morning Planning shall display all incomplete tasks from the previous day with the prompt: "These didn't get done yesterday. What's carrying over?" | Must Have | US1, G3 |
| FR-19 | For each carryover task, the user shall be able to: Keep (carry to today), Dismiss (remove), or Edit (modify text) | Must Have | US1 |
| FR-20 | After carryover review, the system shall prompt: "What are your Top 3 Must-Dos for today?" | Must Have | US1, G2 |
| FR-21 | Users shall be able to select up to 3 tasks from carried-over tasks or add new tasks as their Top 3 | Must Have | US1 |
| FR-22 | Users shall be able to add tasks to "Other Tasks" during Morning Planning | Should Have | US1 |
| FR-23 | Morning Planning shall conclude with a confirmation screen showing the selected Top 3 and a motivational message | Should Have | US1 |
| FR-24 | Users shall be able to skip Morning Planning and go directly to the daily view | Should Have | US1 |
| FR-25 | If all previous day's tasks were completed, Morning Planning shall skip the carryover step and go directly to Top 3 selection | Should Have | US1, G1 |

### Completion Celebration

| ID | Requirement | Priority | Traces To |
|----|-------------|----------|-----------|
| FR-26 | When all 3 "Must Do Today" tasks are marked complete, the system shall display a celebration animation and message (e.g., "All 3 done! Great work!") | Should Have | US4 |
| FR-27 | Individual task completion shall show a subtle checkmark animation | Should Have | US4 |

### Data Persistence (Offline-First)

| ID | Requirement | Priority | Traces To |
|----|-------------|----------|-----------|
| FR-28 | All task data shall be stored in browser IndexedDB | Must Have | US6, G4 |
| FR-29 | The app shall function fully without network connectivity | Must Have | US6, G4 |
| FR-30 | The app shell (HTML, CSS, JS) shall be cached via Service Worker for instant offline loading | Must Have | US6 |
| FR-31 | Data shall persist across browser sessions (survives close/reopen) | Must Have | US6 |
| FR-32 | The system shall store: task text, completion status, section (Top 3 vs Other), order position, creation date | Must Have | - |

### PWA / Installation

| ID | Requirement | Priority | Traces To |
|----|-------------|----------|-----------|
| FR-33 | The app shall include a valid PWA manifest with name, icons, and display mode | Must Have | US7 |
| FR-34 | The app shall be installable on supported browsers (Chrome, Edge, Safari) | Must Have | US7 |
| FR-35 | When installed, the app shall open in standalone mode without browser UI | Must Have | US7 |

---

## 7. User Interface Requirements

### Layout

| ID | Requirement | Priority |
|----|-------------|----------|
| UI-1 | The app shall use a single-screen daily view layout (no navigation between pages) | Must Have |
| UI-2 | The layout shall be responsive: single column on mobile, comfortable reading width on desktop | Must Have |
| UI-3 | The task input field shall be positioned at the top of the screen, always visible | Must Have |
| UI-4 | "Must Do Today" section shall appear above "Other Tasks" section | Must Have |
| UI-5 | Each section shall have a clear header label | Must Have |

### Visual Design

| ID | Requirement | Priority |
|----|-------------|----------|
| UI-6 | Visual style shall be warm and friendly: soft/muted color palette, rounded corners (8-12px radius), gentle shadows | Must Have |
| UI-7 | Typography shall be readable: minimum 16px body text, clear hierarchy | Must Have |
| UI-8 | "Must Do Today" section shall be visually prominent (e.g., subtle background color, larger task text, or card styling) | Must Have |
| UI-9 | Completed tasks shall show: muted text color, strikethrough, filled checkbox | Must Have |
| UI-10 | Interactive elements shall have visible hover/focus states | Must Have |
| UI-11 | Animations shall be subtle and quick (100-200ms) to feel responsive without being distracting | Should Have |

### Task Item Design

| ID | Requirement | Priority |
|----|-------------|----------|
| UI-12 | Each task item shall display: checkbox, task text, drag handle, and actions menu (delete) | Must Have |
| UI-13 | Drag handle shall use a recognizable icon (e.g., ⋮⋮ or ≡) | Must Have |
| UI-14 | On mobile, task items shall have sufficient touch targets (minimum 44px height) | Must Have |
| UI-15 | On mobile, swipe gestures should NOT be used for critical actions (use explicit buttons) | Should Have |

### Morning Planning UI

| ID | Requirement | Priority |
|----|-------------|----------|
| UI-16 | Morning Planning shall use a modal or full-screen overlay flow | Must Have |
| UI-17 | Progress indicator shall show current step in the planning flow | Should Have |
| UI-18 | Carryover tasks shall be displayed as a selectable list with Keep/Dismiss options | Must Have |
| UI-19 | The flow shall feel welcoming with friendly copy (e.g., "Good morning! Let's plan your day.") | Should Have |

---

## 8. Technical Considerations

### Technology Stack (from RSD)
- **Frontend:** Blazor WebAssembly (WASM) as PWA
- **Local Storage:** IndexedDB via `Reshiru.Blazor.IndexedDB.Framework` or `DnetIndexedDb`
- **Offline:** Service Worker for app shell caching
- **Drag-and-Drop:** SortableJS via JS interop, or custom Blazor implementation

### Data Model (Suggested)

```
Task {
  Id: GUID
  Text: string
  IsCompleted: boolean
  Section: enum (MustDo, Other)
  OrderIndex: int
  CreatedDate: Date
  CompletedDate: Date?
}

AppState {
  CurrentDate: Date
  LastPlanningDate: Date?
  Tasks: Task[]
}
```

### Performance Considerations
- App shell should load in under 1 second on repeat visits (cached)
- IndexedDB operations should be async and non-blocking
- Blazor WASM initial load may be slow; consider loading indicator

### Browser Support
- Chrome 80+
- Edge 80+
- Safari 14+
- Firefox 75+
- Mobile: iOS Safari, Chrome for Android

---

## 9. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Morning Planning completion time | < 2 minutes | (Future) In-app timing |
| Daily active usage | 5+ days/week | (Future) Local analytics |
| Top 3 completion rate | > 60% of days | (Future) Local tracking |
| App load time (cached) | < 1 second | Lighthouse audit |
| Lighthouse PWA score | > 90 | Lighthouse audit |

*Note: For v1 personal use, formal analytics are not required. Metrics can be evaluated subjectively.*

---

## 10. Example User Journey

### Morning Planning Flow

1. **User opens app at 8:00 AM** (new day)
2. **Morning Planning modal appears:**
   - "Good morning! Let's plan your day."
3. **Carryover Step:**
   - Shows 2 incomplete tasks from yesterday:
     - "Review Q4 budget proposal" → User taps **Keep**
     - "Call dentist for appointment" → User taps **Keep**
   - User adds new task: "Prepare slides for team meeting"
4. **Top 3 Selection:**
   - "What are your Top 3 Must-Dos for today?"
   - User selects:
     1. "Review Q4 budget proposal"
     2. "Prepare slides for team meeting"
     3. (User adds new) "Send invoice to client"
   - "Call dentist" goes to Other Tasks
5. **Confirmation:**
   - "You're all set! Here's your focus for today:"
   - Shows Top 3 with checkboxes
   - "Let's do this!" button closes modal

### During the Day

6. **User completes "Send invoice to client"**
   - Taps checkbox → checkmark animation, strikethrough appears
7. **User thinks of new task**
   - Types "Buy milk" in input field, presses Enter
   - Task appears in "Other Tasks"
8. **User reprioritizes**
   - Drags "Call dentist" up to Top 3, replacing completed "Send invoice"
9. **User completes all Top 3**
   - Celebration animation: "All 3 done! Great work!"

### End of Day

10. **User clears completed tasks**
    - Taps "Clear Completed" → Confirmation → 3 tasks removed
11. **Remaining tasks** (Buy milk, any incomplete) will appear in tomorrow's carryover

---

## 11. Open Questions

| # | Question | Impact | Owner |
|---|----------|--------|-------|
| OQ1 | Should there be a way to view task history/archive in future versions? | Affects data retention strategy | Product |
| OQ2 | Should "Other Tasks" have a soft limit with a warning (e.g., "You have 10+ tasks - consider trimming")? | Affects UX complexity | Product |
| OQ3 | What specific celebration animation/message for completing all Top 3? | Affects design work | Design |
| OQ4 | Should the app detect and prevent accidental data clearing (e.g., require typing "CLEAR")? | Affects safety vs. simplicity | Product |

---

## 12. Assumptions

| # | Assumption | Risk if Wrong |
|---|------------|---------------|
| A1 | User has a modern browser with IndexedDB support | App won't persist data on older browsers |
| A2 | Single user only; no need for data sync between devices | User may want cross-device access later |
| A3 | "Today" is based on device local time | Could cause issues if user travels across time zones |
| A4 | Blazor WASM performance is acceptable for this use case | May need to switch to lighter framework if slow |
| A5 | User prefers simplicity over features (no dates, categories, etc.) | May request features after using v1 |

---

## 13. Design Considerations

### Recommended Design References
- **Todoist** - Clean task entry and completion
- **Any.do** - "Plan My Day" ritual inspiration
- **Structured** - Visual warmth and timeline clarity
- **Things 3** - Subtle animations and premium feel

### Color Palette Direction (Warm/Friendly)
- Background: Soft warm white or cream (#FAFAF8 or similar)
- Primary accent: Warm color (coral, amber, or soft blue)
- Completed tasks: Muted gray
- Top 3 section: Subtle warm highlight

### Animation Principles
- Quick and subtle (100-200ms)
- Purposeful (confirms actions, guides attention)
- Not distracting or playful to the point of annoyance

---

## Standards Compliance

### Applied Rules
- [PRIN-1] User-first: All features designed around user's existing workflow
- [PRIN-5] Incremental delivery: MVP scope clearly bounded
- [PRIN-10] Simplicity: No dates, categories, or complex features
- [PRD-1] Standard sections included
- [PRD-2] Requirements numbered (FR-1, UI-1, etc.)
- [PRD-3] Requirements are specific and testable
- [PRD-5] Research reference included (RSD)
- [PRD-6] Open questions documented
- [PRD-7] Assumptions listed
- [CODE-4] Async patterns required for IndexedDB operations

### Deviations
- None

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1 | 2026-01-05 | AI Assistant | Initial PRD |
