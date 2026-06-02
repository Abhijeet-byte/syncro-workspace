# Syncro.OS — Interactive B2B SaaS Async Workspace

Syncro.OS is a high-density, keyboard-accessible sprint tracker and issue index built using **React 19** and **Tailwind CSS v4**. Inspired by the tactile, minimalist aesthetics of `Linear` and `cofounder.co`, it optimizes product planning into a zero-latency single-page viewport.

---

## ⚡ The Overview

* **What it is:** A project workspace featuring an interactive **Kanban Board** for live sprint tracking and a high-density **Schema Index Table** for rapid data management.
* **Why it was built:** To eliminate data friction and mouse dependency for engineering teams by mapping app navigation entirely to keyboard macros.

---

## 🛠️ Architectural Problem-Solving

### 1. Stale Metrics Syncing
* **Problem:** Storing task data and metric counters in independent, isolated states creates race conditions where the layout updates but the sidebar displays stale data.
* **Solution:** **Derived State Computation.** Metrics are not stored in state. Instead, they are mathematically calculated on-the-fly directly from a single mutable task array on every frame render, ensuring absolute component synchronization.

### 2. Hard Refresh Data Loss
* **Problem:** Standard React state lives in temporary browser memory. Running a page refresh wipes out custom user tasks and resets the dashboard to default data.
* **Solution:** **LocalStorage Middleware Pipeline.** Integrated a layout initialization pattern that caches state serialization strings straight to the browser's native hard-drive partition, matching enterprise data persistence workflows.

### 3. Hotkey Text Collisions
* **Problem:** Binding the `C` key to open the task creator modal causes a fatal UX flaw: whenever a user types a word containing the letter "c" into a search bar, it
