# Research Summary Document (RSD): Daily Task Tracker v1

---
standards_version: 1.0.0
applied_standards:
  - global/principles.md
  - global/security-privacy.md
  - domains/code-architecture.md
  - phases/research.md
---

## 1. Project Overview

- **User brief:** Web-based daily task management tool with carryover from previous day, "Top 3 Must Do" prioritization, offline-first, mobile-friendly, for personal use
- **Project type(s):** Product, Design, Content
- **Research depth:** Quick scan
- **Primary research focus:** External best practices and productivity methodologies

---

## 2. Existing Context & Assets (Internal)

### 2.1 Related Requirements & Docs
- No existing PRDs/CRDs/DRDs or task files in `/tasks/` directory (greenfield project)

### 2.2 Codebase / System Context
- **Tech stack direction:** .NET/C# backend + SPA frontend (React or Blazor)
- **Deployment:** Personal use, single-user, local or self-hosted
- No existing codebase to integrate with

---

## 3. User & Business Context

- **Target user:** You (personal productivity tool)
- **User goals:**
  - Efficiently carry over incomplete tasks day-to-day
  - Focus on top 3 priorities ("Must Do Today")
  - Quick daily planning ritual
  - Works offline and on mobile
- **Success signals:** Consistent daily use, reduced mental load for tracking tasks, faster morning planning

---

## 4. External Research: Best Practices & References

### 4.1 Productivity Methodologies

Your existing workflow closely aligns with established methodologies:

| Methodology | Core Idea | Relevance to Your System |
|-------------|-----------|--------------------------|
| **MIT (Most Important Tasks)** | Identify 3 crucial tasks daily, do them first | **Direct match** - your "Top 3 Must Do" |
| **1-3-5 Rule** | 1 big, 3 medium, 5 small tasks per day | Could extend your system with tiers |
| **Eisenhower Matrix** | Categorize by urgent/important quadrants | Could inform prioritization UI |
| **GTD (Getting Things Done)** | Capture → Clarify → Organize → Reflect → Engage | Supports carryover/review workflow |
| **Eat the Frog** | Do hardest task first | Could highlight "frog" in Top 3 |

**Key insight:** Your carryover + Top 3 system is a valid, lightweight methodology. Research suggests limiting daily priorities to 3 items forces meaningful prioritization and prevents overwhelm.

### 4.2 Task App Feature Patterns

From analyzing popular apps (Todoist, Any.do, TickTick, Structured, Sunsama):

**Must-Have Features:**
- Quick task entry (minimal friction)
- Drag-and-drop reordering for prioritization
- Clear visual hierarchy (Top 3 vs. other tasks)
- Day-to-day carryover mechanism
- Checkbox completion with satisfying feedback

**Nice-to-Have Features:**
- "Plan My Day" ritual mode (Any.do pattern)
- Natural language date parsing
- Recurring tasks
- Time estimates per task
- Daily/weekly review prompts

**2025 Trend:** Less feature count, more flow support. Apps that "fit your brain" win over feature-heavy alternatives.

### 4.3 Offline-First PWA Architecture (Blazor)

For .NET/Blazor with offline support:

**Architecture Pattern:**
```
[Blazor WASM PWA] → [Service Worker] → [IndexedDB]
                                            ↓
                                    [Sync on reconnect]
```

**Key Components:**
- **Service Worker:** Cache app shell and assets for instant load
- **IndexedDB:** Store tasks locally (survives browser close)
- **Outbox Pattern:** Queue changes when offline, sync when online

**Libraries (NuGet):**
- `Reshiru.Blazor.IndexedDB.Framework` - EF-like API for IndexedDB
- `DnetIndexedDb` - Alternative IndexedDB wrapper
- For complex scenarios: SQLite compiled to WASM + IndexedDB bridge

**Sample Reference:** Microsoft's "CarChecker" sample demonstrates Blazor WASM + IndexedDB + offline sync.

### 4.4 Drag-and-Drop UX Patterns

**Visual Design:**
- Use grab-handle icons (⋮⋮) to signal draggability
- Add shadow/elevation when item is "picked up"
- Animate drop into position (~100ms)
- "Magnetic" snap effect when reordering

**Mobile Considerations:**
- Touch drag needs ~1cm grab target minimum
- Use timing delay to distinguish tap vs. drag
- Provide "Move to Top 3" button as alternative to drag
- Consider haptic feedback on grab

**Accessibility:**
- Support keyboard: Spacebar to grab, Arrow keys to move, Spacebar to drop
- Ensure screen reader compatibility

**Libraries:**
- React: `react-beautiful-dnd` (Atlassian) - excellent for sortable lists
- Blazor: Custom implementation or JS interop with SortableJS

---

## 5. Constraints, Risks, and Dependencies

### 5.1 Constraints
- **Technical:** Blazor WASM + IndexedDB is well-supported but requires JS interop for some features
- **Scope:** Personal use only simplifies auth/multi-tenancy concerns
- **Offline-first:** Adds complexity but is achievable with established patterns

### 5.2 Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-engineering for personal tool | High effort, delayed MVP | Start minimal, iterate |
| IndexedDB complexity | Dev time sink | Use established library (Reshiru/Dnet) |
| Mobile drag-drop UX issues | Frustrating on phone | Provide button alternative |

### 5.3 Assumptions
- Single user, no authentication needed
- Data stays local (no cloud sync for MVP)
- Modern browser support only (Chrome, Edge, Safari, Firefox)

---

## 6. Opportunities & Ideas

### Reuse Opportunities
- MIT/Top 3 methodology is well-documented; no need to invent new system
- Established Blazor PWA patterns and libraries exist

### Quick Wins
- Start with list view + checkbox + drag reorder (core loop)
- Carryover can be a simple "copy unchecked to today" action

### Differentiation Ideas
- "Morning Planning Mode" - guided 2-minute ritual to set Top 3
- Visual progress indicator (3/3 MITs done = celebration)
- "Yesterday's Leftovers" section during planning

### Future Extensions (out of scope for MVP)
- Recurring tasks
- Time tracking
- Weekly review summaries
- Cloud sync

---

## 7. Key Findings by Track

### 7.1 Product / Feature Findings
1. Your Top 3 + carryover system maps directly to MIT methodology - validated approach
2. Offline-first is achievable with Blazor WASM + IndexedDB + Service Worker
3. Keep MVP minimal: task list, priorities, carryover, offline support

### 7.2 Content Findings
1. Use action-oriented microcopy ("What must get done today?")
2. Celebrate completions ("All 3 MITs done!")
3. Keep UI text minimal - the app should feel fast and focused

### 7.3 Design Findings
1. Visual hierarchy is critical: Top 3 must stand out from "other tasks"
2. Drag-and-drop with button fallback for mobile
3. Single-screen daily view (no navigation complexity)

---

## 8. Recommendations for the Create Phase

### 8.1 Recommended Requirements Document(s)
- **Create next:** PRD (Product Requirements Document)
- **Suggested filename:** `prd-daily-task-tracker-v1.md`
- Follow with DRD once PRD is approved (for UI/component details)

### 8.2 Scope Recommendations

**MVP Scope (must have):**
- Single daily view with task list
- "Top 3 Must Do" section (visually distinct)
- "Other Tasks" section
- Drag-and-drop to reorder/promote tasks
- Checkbox to complete tasks
- "Start New Day" action (carries over incomplete tasks)
- Offline-first (works without internet)
- Mobile-responsive layout
- PWA installable

**Stretch / Deferred:**
- Recurring tasks
- Time estimates
- History/archive view
- Cloud sync
- Dark mode

### 8.3 Key Questions the PRD Should Answer
1. What happens to completed tasks at end of day? (Archive? Delete? Keep visible?)
2. Should there be a limit on "Other Tasks" count?
3. How explicit should the "morning planning" ritual be?
4. Should tasks have due dates, or is "today" the only timeframe?

### 8.4 Suggested Decisions to Lock In Now
- **Tech stack:** Blazor WASM PWA with IndexedDB (aligns with .NET preference, good offline support)
- **Data model:** Tasks are day-scoped; carryover creates new task entries
- **No auth:** Single-user, local storage only for MVP

---

## 9. Open Questions & Gaps

- Specific IndexedDB library performance comparison not conducted (quick scan depth)
- No user testing data on MIT methodology effectiveness (assumed valid based on your existing practice)
- Blazor component library choice (MudBlazor, Radzen, or custom) not researched

---

## 10. Sources & References

**Productivity Methodologies:**
- MIT (Most Important Tasks) - popularized by Leo Babauta / Zen Habits

**Task App Analysis:**
- [7 Best To-Do List Apps of 2026 - Zapier](https://zapier.com/blog/best-todo-list-apps/)
- [18 Best Daily Planner Apps - Plaky](https://plaky.com/blog/best-daily-planner-apps/)
- [10 Best Task Management Apps 2025 - Taskee](https://taskee.pro/blog/10-best-task-management-apps-2025/)

**Blazor PWA / Offline:**
- [Offline-First Strategy with Blazor PWAs - Medium](https://medium.com/@dgallivan23/offline-first-strategy-with-blazor-pwas-a-complete-guide-a6e27e564d0c)
- [Blazor WASM AOT & Offline-First PWA Architecture - DevelopersVoice](https://developersvoice.com/blog/dotnet/production-blazor-wasm-optimization-aot-pwa/)
- [Offline Data in Blazor with WASM, SQLite & IndexedDB - Mzansi Bytes](https://mzansibytes.com/2025/07/01/offline-data-in-blazor-with-wasm-sqlite-indexeddb/)
- [IndexedDB in Blazor - Steve Sanderson](https://blog.stevensanderson.com/2019/08/03/blazor-indexeddb/)

**Drag-and-Drop UX:**
- [Drag-and-Drop: How to Design for Ease of Use - Nielsen Norman Group](https://www.nngroup.com/articles/drag-drop/)
- [Drag-and-Drop UX Guidelines - Smart Interface Design Patterns](https://smart-interface-design-patterns.com/articles/drag-and-drop-ux/)
- [Drag & Drop UX Design Best Practices - Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-drag-and-drop)
- [Designing Drag and Drop UIs - LogRocket](https://blog.logrocket.com/ux-design/drag-and-drop-ui-examples/)

---

## Standards Compliance

### Applied Rules
- [PRIN-1] User-first: Research centered on user workflow and goals
- [PRIN-5] Incremental delivery: MVP scope clearly defined
- [PRIN-10] Simplicity: Recommended minimal viable feature set
- [R-1] Research goal stated clearly
- [R-3] Sources cited with URLs
- [R-7] Actionable recommendations provided
- [R-8] Scope and limitations documented

### Deviations
- None
