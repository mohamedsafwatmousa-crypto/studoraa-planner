# Studora – Smart Study Planner

> A beautifully designed, AI-powered study planner that helps students organise subjects, track focus time, monitor progress, and stay motivated — all in one dashboard.

---

## live site : https://studora-planner.netlify.app/

## Overview

**Studora** is a front-end web application (pure HTML, CSS & JavaScript — no backend required) that gamifies the study experience. Students set a daily study goal, add their subjects, plan their day, enter a distraction-free Focus Mode, and review detailed analytics — all saved locally in the browser with `localStorage`.

---

## Project Structure

```
final project study planner/
│
├── index.html                  ← Landing page (entry point)
│
├── dash-board/
│   ├── welcome.html            ← Onboarding / Profile setup
│   ├── add_task_pro.html       ← Main Dashboard (Home)
│   ├── focus.html              ← Pomodoro Focus Timer
│   ├── subjects.html           ← Subjects Manager
│   └── insights.html           ← Analytics & Insights
│
├── css/
│   ├── master.css              ← Landing page styles
│   ├── welcome.css             ← Onboarding page styles
│   ├── add_task_pro.css        ← Dashboard styles
│   ├── fouus-style.css         ← Focus Mode styles
│   ├── subjects.css            ← Subjects page styles
│   ├── insights.css            ← Insights page styles
│   ├── model.css               ← Sidebar & shared layout styles
│   ├── all.min.css             ← Font Awesome icons (bundled)
│   └── sweetalert2.min.css     ← SweetAlert2 notification styles
│
├── js/
│   ├── welcome.js              ← Onboarding logic & localStorage save
│   ├── add_task_pro.js         ← Dashboard: today's plan, XP, level
│   ├── focus.js                ← Pomodoro timer logic
│   ├── subjects.js             ← Subjects CRUD operations
│   ├── insights.js             ← Charts & analytics logic
│   ├── moudel.js               ← AI Chatbot (Groq API integration)
│   ├── main.js                 ← Landing page scroll animations
│   ├── chart.js                ← Chart.js library (full)
│   ├── chart.umd.min.js        ← Chart.js library (minified)
│   └── sweetalert2.all.min.js  ← SweetAlert2 notifications
│
├── imgs/
│   ├── bg-cloud-moon.jpeg      ← Background image
│   ├── bg-moon.jpeg            ← Background image
│   ├── undraw_new-years-resolutions_jzwq.svg
│   └── wave.svg
│
├── sound/
│   └── dragon-studio-bell-ring-390294.mp3  ← Session-end bell sound
│
└── webfonts/                   ← Font Awesome WOFF2 icon fonts
    ├── fa-brands-400.woff2
    ├── fa-regular-400.woff2
    ├── fa-solid-900.woff2
    └── fa-v4compatibility.woff2
```

---

## Pages & Features

### 1. `index.html` — Landing Page

The public-facing homepage for Studora. Contains:

- **Navbar** with links to Features, How It Works, and a "Start Now" CTA.
- **Hero Section** — animated dashboard preview card showing today's plan, subject progress bars, and XP earned.
- **Features Grid** — 6 feature cards: Subject Manager, Focus Mode, Insights & Analytics, XP & Levels, Daily Planner, Smart Alerts.
- **How It Works** — 4-step guide (Create Profile → Plan Day → Focus Mode → Track Growth).
- **CTA Section** — call to action to get started.
- **Scroll Reveal Animations** powered by `main.js` using `IntersectionObserver`.

---

### 2. `dash-board/welcome.html` — Onboarding & Profile

The first page a user sees after clicking "Start Now". It guides them through setup:

- Enter their **name** and **daily study goal** (hours/day).
- Add **subjects** as coloured tags.
- On submit, data is saved to `localStorage` under the key `name_data_subj`.
- If data already exists, the page shows the **profile dashboard** instead (name, goal, subject count, subject tags).
- An **Edit** button lets the user update their profile at any time.
- A **Start** button navigates to the main dashboard.

---

### 3. `dash-board/add_task_pro.html` — Main Dashboard (Home)

The central hub of the app after onboarding:

- **Today's Plan** — select a subject from their list and allocate hours; subjects are added to today's plan.
- **Total Study Time Circle** — an SVG animated progress ring showing total hours planned for the day.
- **Subjects Progress** — progress bars for each subject showing studied vs. target hours.
- **XP & Level** — gamification panel showing the student's current experience points and level badge.
- **Start Focus Mode** button — navigates to the Focus timer with today's subjects pre-loaded.
- **AI Chatbot** (floating robot button) — opens the AI study plan generator (see Chatbot section).

---

### 4. `dash-board/focus.html` — Focus Mode (Pomodoro Timer)

A distraction-free study timer:

- **Subject Selector** — populated from `todayPlan` in `localStorage`.
- **25-minute Pomodoro timer** — circular countdown with colour-coded conic gradient (blue = study, green = break).
- **Controls**: Start, Pause/Resume, End Session.
- **Music & Ambient sounds** — toggle buttons for background music and ambient audio.
- **Bell sound** — plays when a session ends (`dragon-studio-bell-ring-390294.mp3`).
- XP is earned for every completed session and saved to `localStorage`.

---

### 5. `dash-board/subjects.html` — Subjects Manager

Full CRUD interface for managing subjects:

- **Add Subject Form** — enter a subject name and target hours.
- **Subjects List** — displays all subjects with progress bars (studied hours / target hours).
- **Delete** individual subjects with a confirmation dialog (SweetAlert2).
- **Empty State** — friendly message when no subjects exist yet.
- **AI Chatbot** (floating button) — same AI plan generator available here.

---

### 6. `dash-board/insights.html` — Analytics & Insights

Detailed analytics dashboard:

- **Warning Card** — highlights subjects the student is behind on.
- **Great Job Card** — highlights subjects where the student is on track.
- **Suggestion Card** — AI-style recommendation on study patterns.
- **Bar Chart** — built with Chart.js, visualises study hours per subject over the week.
- **Summary Panel** — total study hours, average hours/day, and completed tasks count.
- **AI Chatbot** (floating button) — same AI plan generator.

---

## AI Chatbot (Study Plan Generator)

Available on every dashboard page as a floating **robot button** (bottom-right corner). Powered by the **Groq API** (using a fast LLM model), it's a 4-step wizard:

- **If the name, number of hours, and subjects exist in local storage, they are loaded automatically.**

| Step | What it collects                  |
| ---- | --------------------------------- |
| 1    | Student's name                    |
| 2    | Total available study hours       |
| 3    | List of subjects to study         |
| 4    | Hour distribution across subjects |

After collecting input, it calls the Groq API and generates a personalised, formatted study plan. The result can be **copied** with one click.

> **Note:** The Groq API key is embedded in `js/moudel.js`. For production use, this should be moved to a backend proxy.

---

## Data Storage

All user data is stored client-side using **`localStorage`**. No server or database is required.

| Key              | Contents                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `name_data_subj` | User profile: name, daily hours goal, subjects array (name, target, time studied, colour) |
| `todayPlan`      | Today's planned subjects and allocated hours                                              |
| `xp`             | Total XP points earned                                                                    |
| `level`          | Current student level                                                                     |

Data persists between browser sessions automatically. Clicking **Log Out** in the sidebar clears the stored data and redirects to the landing page.

---

## Design & Styling

- **Fonts:** `Sora` (primary) and `Poppins` (secondary) via Google Fonts.
- **Icons:** Font Awesome 6 (bundled locally in `css/all.min.css` + `webfonts/`).
- **Color Palette:** Dark background (`#111827`), purple accent (`#7C3AED`), blue accent (`#3B82F6`), with gradient highlights.
- **Animations:** CSS transitions, scroll-reveal via `IntersectionObserver`, and SVG conic-gradient timer animation.
- **Notifications:** SweetAlert2 for confirmation dialogs and alerts.
- **Charts:** Chart.js (UMD build) for the bar chart in Insights.

---

## How to Run

No installation or build step needed. Just open the project in a browser:

```bash
# Option 1 — Open directly
Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

# Option 2 — Use a local server (recommended to avoid CORS issues with audio)
 serve "final project study planner"
# in vs code __ live server


---

## Navigation Flow

```

index.html (Landing)
└──► welcome.html (Onboarding / Profile)
└──► add_task_pro.html (Main Dashboard)
├──► focus.html (Focus Timer)
├──► subjects.html (Subjects Manager)
├──► insights.html (Analytics)
└──► welcome.html (Profile / Edit)

```

---

## Technologies Used

| Technology                | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| HTML5                     | Page structure                                |
| CSS3                      | Styling, animations, responsive layout        |
| Vanilla JavaScript (ES6+) | All app logic, localStorage, DOM manipulation |
| Chart.js                  | Bar charts in Insights page                   |
| SweetAlert2               | Styled alert/confirm dialogs                  |
| Font Awesome 6            | Icons throughout the app                      |
| Google Fonts              | Typography (Sora, Poppins)                    |
| Groq API                  | AI study plan generation in the chatbot       |
| localStorage              | Client-side data persistence                  |

---

## Browser Support

Works in all modern browsers that support:

- `localStorage`
- CSS `conic-gradient`
- `IntersectionObserver`
-  JavaScript

> Recommended: **Google Chrome** or **Microsoft Edge** for best experience.

---
```
