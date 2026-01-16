# Tasks: MorningTrio

---
standards_version: 1.0.0
applied_standards:
  - global/principles.md
  - phases/generate-tasks.md
source_document: tasks/prd-daily-task-tracker-v2.md
product_name: MorningTrio
domain: morningtrio.com
---

## Relevant Files

- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration with warm color palette
- `next.config.js` - Next.js configuration for static export and PWA
- `morningtrio/src/lib/db.ts` - Dexie.js database setup and schema with tasks table
- `morningtrio/src/lib/utils.ts` - Utility functions (cn, generateId, formatDate, getTodayString, isNewDay)
- `morningtrio/src/lib/utils.test.ts` - Unit tests for utility functions (8 tests)
- `morningtrio/src/hooks/useTasks.ts` - Task CRUD operations hook with Dexie integration
- `morningtrio/src/hooks/useTasks.test.ts` - Unit tests for database operations (6 tests)
- `morningtrio/src/hooks/useAppState.ts` - App state management (current date, planning state)
- `morningtrio/jest.config.js` - Jest configuration with TypeScript and ESM support
- `morningtrio/jest.setup.js` - Jest setup with testing-library and fake-indexeddb
- `morningtrio/src/types/task.ts` - TypeScript interfaces for Task and AppState
- `morningtrio/src/components/ui/button.tsx` - shadcn/ui Button component (customized with rounded-xl)
- `morningtrio/src/components/ui/checkbox.tsx` - shadcn/ui Checkbox component (customized size-5)
- `morningtrio/src/components/ui/input.tsx` - shadcn/ui Input component
- `morningtrio/src/components/ui/dialog.tsx` - shadcn/ui Dialog component
- `morningtrio/src/components/ui/alert-dialog.tsx` - shadcn/ui AlertDialog for confirmations
- `morningtrio/src/components/TaskItem.tsx` - Individual task item with checkbox, drag handle, delete
- `morningtrio/src/components/TaskItem.test.tsx` - Unit tests for TaskItem (7 tests)
- `morningtrio/src/components/TaskList.tsx` - Task list with "Must Do Today" and "Other Tasks" sections
- `morningtrio/src/components/TaskInput.tsx` - Quick task capture input with Enter submit
- `morningtrio/src/components/TaskInput.test.tsx` - Unit tests for TaskInput (7 tests)
- `morningtrio/src/app/layout.tsx` - Root layout with responsive container and PWA metadata
- `morningtrio/src/app/page.tsx` - Main daily view with task management UI
- `morningtrio/src/components/SortableTaskItem.tsx` - Draggable task item wrapper with @dnd-kit
- `morningtrio/src/components/DroppableSection.tsx` - Droppable section container for drag-and-drop
- `morningtrio/src/components/MorningPlanning.tsx` - Full-screen morning planning flow with 3 steps
- `morningtrio/src/components/CarryoverStep.tsx` - Carryover review with Keep/Dismiss/Edit actions
- `morningtrio/src/components/TopThreeSelection.tsx` - Top 3 selection with add new task option
- `morningtrio/src/components/PlanningConfirmation.tsx` - Confirmation step with motivational message
- `src/components/CelebrationModal.tsx` - Celebration animation modal
- `src/components/CelebrationModal.test.tsx` - Unit tests for CelebrationModal
- `src/app/page.tsx` - Main app page (Next.js App Router)
- `src/app/layout.tsx` - Root layout with providers
- `src/styles/globals.css` - Tailwind imports and custom styles
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker (or Workbox generated)
- `public/icons/` - PWA icons (192x192, 512x512)

### Notes

- Unit tests should be placed alongside the code files they test (e.g., `TaskItem.tsx` and `TaskItem.test.tsx`).
- Use `npm test` or `npx jest [path]` to run tests.
- shadcn/ui components are copy-pasted into `src/components/ui/` and customized as needed.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch: `git checkout -b feature/morningtrio`

- [x] 1.0 Project Setup & Configuration (FR-28, FR-33)
  - [x] 1.1 Initialize Next.js project with TypeScript: `npx create-next-app@latest --typescript --tailwind --app`
  - [x] 1.2 Install core dependencies: `npm install dexie @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities uuid`
  - [x] 1.3 Install dev dependencies: `npm install -D @types/uuid jest @testing-library/react @testing-library/jest-dom`
  - [x] 1.4 Initialize shadcn/ui: `npx shadcn-ui@latest init` with warm color theme
  - [x] 1.5 Configure `tailwind.config.js` with warm color palette (#FAFAF8 background, coral/amber accents)
  - [x] 1.6 Update `src/styles/globals.css` with base styles and CSS variables for warm theme
  - [x] 1.7 Configure `next.config.js` for static export (`output: 'export'`)
  - [x] 1.8 Create `src/types/task.ts` with Task and AppState TypeScript interfaces
  - [x] 1.9 Verify project builds without errors: `npm run build`

- [x] 2.0 Database & Data Layer (FR-28, FR-31, FR-32)
  - [x] 2.1 Create `src/lib/db.ts` with Dexie.js database class and schema for tasks table
  - [x] 2.2 Define indexed fields: id (primary), section, orderIndex, createdDate
  - [x] 2.3 Create `src/lib/utils.ts` with helper functions: generateId(), isNewDay(), formatDate()
  - [x] 2.4 Write unit tests for `src/lib/utils.ts` - test date comparison and UUID generation
  - [x] 2.5 Create `src/hooks/useTasks.ts` with CRUD operations: addTask, updateTask, deleteTask, toggleComplete, reorderTasks, moveToSection
  - [x] 2.6 Create `src/hooks/useAppState.ts` to manage currentDate, lastPlanningDate, check if planning needed
  - [x] 2.7 Write unit tests for useTasks hook - test add, update, delete, toggle operations
  - [x] 2.8 Verify data persists across browser refresh

- [x] 3.0 Core UI Components & Layout (UI-1 through UI-15, FR-1)
  - [x] 3.1 Add shadcn/ui components: `npx shadcn-ui@latest add button checkbox input dialog alert-dialog`
  - [x] 3.2 Customize shadcn components with warm color palette and rounded corners (8-12px)
  - [x] 3.3 Create `src/app/layout.tsx` with responsive container (max-width for desktop, full-width mobile)
  - [x] 3.4 Create `src/app/page.tsx` with main daily view layout structure
  - [x] 3.5 Create `src/components/TaskInput.tsx` - input field at top, Enter to submit (FR-3)
  - [x] 3.6 Create `src/components/TaskItem.tsx` - checkbox, text, drag handle, delete button (UI-12, UI-13)
  - [x] 3.7 Style TaskItem with 44px min height for touch targets (UI-14)
  - [x] 3.8 Add completed state styling: strikethrough, muted color, filled checkbox (UI-9)
  - [x] 3.9 Create `src/components/TaskList.tsx` - container with "Must Do Today" and "Other Tasks" sections (FR-1, UI-4, UI-5)
  - [x] 3.10 Style "Must Do Today" section with prominent card/background styling (UI-8)
  - [x] 3.11 Add hover/focus states to all interactive elements (UI-10)
  - [x] 3.12 Write unit tests for TaskInput - test submission, clearing input
  - [x] 3.13 Write unit tests for TaskItem - test checkbox toggle, delete action
  - [x] 3.14 Verify responsive layout on mobile and desktop viewports

- [x] 4.0 Task Management Features (FR-1 through FR-10)
  - [x] 4.1 Implement add task to "Other Tasks" by default (FR-4)
  - [x] 4.2 Implement optional add to "Must Do Today" if fewer than 3 tasks (FR-2)
  - [x] 4.3 Implement task completion toggle with checkbox (FR-5)
  - [x] 4.4 Implement task deletion with confirmation dialog (FR-9, FR-10)
  - [x] 4.5 Implement "Clear Completed" button (FR-7)
  - [x] 4.6 Add confirmation dialog for Clear Completed when >1 task (FR-8)
  - [x] 4.7 Display "Top 3 is full" message when attempting to add 4th task to Must Do (FR-16)
  - [x] 4.8 Add mobile-specific "Move to Top 3" / "Move to Other" buttons on TaskItem (FR-15)
  - [x] 4.9 Write integration tests for task CRUD operations
  - [x] 4.10 Verify all task management features work correctly

- [x] 5.0 Drag-and-Drop & Reordering (FR-11 through FR-16)
  - [x] 5.1 Install and configure @dnd-kit: wrap app with DndContext provider
  - [x] 5.2 Make TaskList sections droppable with useDroppable
  - [x] 5.3 Make TaskItem draggable with useDraggable
  - [x] 5.4 Implement reorder within section (FR-11)
  - [x] 5.5 Implement drag from "Other Tasks" to "Must Do Today" with max-3 validation (FR-12, FR-16)
  - [x] 5.6 Implement drag from "Must Do Today" to "Other Tasks" (FR-13)
  - [x] 5.7 Add visual feedback: grab cursor, elevation shadow during drag, snap animation (FR-14)
  - [x] 5.8 Persist new order to IndexedDB after drop
  - [x] 5.9 Test drag-and-drop on touch devices
  - [x] 5.10 Write tests for reorder logic and section validation

- [x] 6.0 Morning Planning Ritual (FR-17 through FR-25)
  - [x] 6.1 Create `src/components/MorningPlanning.tsx` - full-screen modal container (UI-16)
  - [x] 6.2 Implement new day detection: compare lastPlanningDate to current date (FR-17)
  - [x] 6.3 Create `src/components/CarryoverStep.tsx` - display yesterday's incomplete tasks (FR-18)
  - [x] 6.4 Add Keep/Dismiss/Edit actions for each carryover task (FR-19)
  - [x] 6.5 Create `src/components/TopThreeSelection.tsx` - select up to 3 tasks (FR-20, FR-21)
  - [x] 6.6 Allow adding new tasks during Top 3 selection
  - [x] 6.7 Allow adding tasks to "Other Tasks" during planning (FR-22)
  - [x] 6.8 Create `src/components/PlanningConfirmation.tsx` - show selected Top 3 with motivational message (FR-23)
  - [x] 6.9 Add progress indicator showing current step (UI-17)
  - [x] 6.10 Add friendly welcome copy: "Good morning! Let's plan your day." (UI-19)
  - [x] 6.11 Implement "Skip Planning" button to go directly to daily view (FR-24)
  - [x] 6.12 Skip carryover step if all previous tasks completed (FR-25)
  - [x] 6.13 Update lastPlanningDate after completing planning
  - [x] 6.14 Write unit tests for MorningPlanning flow logic
  - [x] 6.15 Write tests for carryover detection and task filtering

- [ ] 7.0 Completion Celebration & Animations (FR-26, FR-27, UI-11)
  - [ ] 7.1 Add subtle checkmark animation on individual task completion (FR-27)
  - [ ] 7.2 Create `src/components/CelebrationModal.tsx` for all-3-complete celebration (FR-26)
  - [ ] 7.3 Implement celebration trigger when all 3 "Must Do Today" tasks completed
  - [ ] 7.4 Add celebration message: "All 3 done! Great work!"
  - [ ] 7.5 Add confetti or subtle animation effect
  - [ ] 7.6 Ensure animations are 100-200ms for responsiveness (UI-11)
  - [ ] 7.7 Write tests for celebration trigger logic

- [ ] 8.0 PWA & Offline Support (FR-29, FR-30, FR-33 through FR-35)
  - [ ] 8.1 Create `public/manifest.json` with app name, icons, display: standalone, theme colors (FR-33)
  - [ ] 8.2 Generate PWA icons (192x192, 512x512) and place in `public/icons/`
  - [ ] 8.3 Install next-pwa or workbox: `npm install next-pwa`
  - [ ] 8.4 Configure next-pwa in `next.config.js` for service worker generation (FR-30)
  - [ ] 8.5 Configure caching strategy: cache-first for app shell, network-first for dynamic content
  - [ ] 8.6 Add manifest link and theme-color meta tags to `src/app/layout.tsx`
  - [ ] 8.7 Test offline functionality: disable network and verify app works (FR-29)
  - [ ] 8.8 Test PWA installation on Chrome, Edge, and mobile browsers (FR-34)
  - [ ] 8.9 Verify standalone mode opens without browser chrome (FR-35)
  - [ ] 8.10 Run Lighthouse PWA audit and achieve >90 score

- [ ] 9.0 Testing & Quality Assurance (TASKS-4)
  - [ ] 9.1 Configure Jest with React Testing Library
  - [ ] 9.2 Run all unit tests and fix any failures
  - [ ] 9.3 Perform manual testing of complete user journey (Morning Planning → Task Management → Clear)
  - [ ] 9.4 Test on mobile viewport sizes (375px, 414px widths)
  - [ ] 9.5 Test touch interactions: tap, drag on mobile
  - [ ] 9.6 Verify data persistence: add tasks, close browser, reopen
  - [ ] 9.7 Test cross-browser: Chrome, Edge, Safari, Firefox
  - [ ] 9.8 Run Lighthouse audit for performance, accessibility, PWA
  - [ ] 9.9 Fix any accessibility issues (keyboard navigation, screen reader)

- [ ] 10.0 Final Review & Documentation (TASKS-4)
  - [ ] 10.1 Review all code for consistency and best practices
  - [ ] 10.2 Remove any console.logs or debug code
  - [ ] 10.3 Create README.md with project overview, setup instructions, and usage
  - [ ] 10.4 Document build and deployment steps
  - [ ] 10.5 Final build and verify no errors: `npm run build`
  - [ ] 10.6 Commit all changes with descriptive message
  - [ ] 10.7 Push feature branch and create pull request
