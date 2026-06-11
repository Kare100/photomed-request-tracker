# PhotoMed Request Tracker

A simple web app for submitting and managing requests (bugs, feature requests, feedback, partnerships, etc.) — built for the PhotoMed software engineering attachment assessment.

## Live Demo
> _Add your deployed URL here once hosted (e.g. via Cloudflare Pages / Netlify / Vercel)._

## What it does

- Submit a request through a form (name, email, product/company, type, priority, message)
- New requests appear instantly at the top of the list
- Each request has a status (`New`, `In Review`, `Resolved`, `Rejected`) that can be changed directly from its card
- Filter requests by **status** and **type**, and **search** by name, email, message, or company
- Data persists across page refreshes using `localStorage`

## Tech stack

- **React + Vite**
- Plain CSS (no UI library) — Google Fonts (Space Grotesk + Inter)

## How to run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── App.jsx                  # top-level state (requests, filters)
├── main.jsx                 # React entry point
├── components/
│   ├── RequestForm.jsx      # form + validation
│   ├── RequestFilters.jsx   # status/type/search controls
│   ├── RequestList.jsx      # list + empty states
│   └── RequestCard.jsx      # single request card
├── data/
│   └── options.js           # PhotoMed product list, types, priorities, statuses
├── utils/
│   ├── storage.js           # localStorage data layer
│   └── validation.js        # form validation + date formatting
└── styles/
    └── index.css             # global styles
```

## Design decisions

- **Why localStorage and not a database?** The brief explicitly says localStorage is acceptable for the basic version, and a database is an "optional improvement." I've worked with MongoDB before and considered it, but that would mean setting up and hosting a backend (Express + MongoDB Atlas), which felt like more moving parts than this assessment needed — and more places for a deployment to break right before the deadline.

  Instead, `utils/storage.js` exposes a small set of functions (`getRequests`, `addRequest`, `updateRequestStatus`) that the rest of the app calls. To swap in MongoDB later, I'd rewrite the insides of these functions to call an API (and make them `async`) — the components wouldn't need to change much beyond `await`ing them.

- **Component breakdown.** I split the UI into `RequestForm`, `RequestFilters`, `RequestList`, and `RequestCard` so each piece has one job and is easy to follow. `App.jsx` owns the shared state (the list of requests and the active filters) and passes data down / handlers down as props.

- **One filter requirement → I added two filters + search.** Status and type filters, plus free-text search across name/email/message/company.

- **PhotoMed branding.** Since PhotoMed is an AI-powered traditional medicine platform, I picked a sage-green/herbal accent color and a small leaf icon, and used PhotoMed's actual product areas as placeholder options in the "Product/Company" dropdown (update these once the real list is shared).

- **Form validation.** All fields are required, with inline error messages. Email is checked against a basic pattern.

## What I completed

- ✅ Form with all required fields and validation
- ✅ Requests appear in the list immediately on submit
- ✅ Status can be changed per request (New / In Review / Resolved / Rejected)
- ✅ Filter by status, filter by type, and search by text — all three work
- ✅ Data persists via localStorage across refreshes
- ✅ Empty states for "no requests yet" and "no results match your filters"
- ✅ Responsive layout (form stacks above the list on smaller screens)

## What I didn't get to / would improve with more time

- A real backend with MongoDB, so requests are shared across devices/users instead of being stuck in one browser
- Authentication, so only admins can change statuses
- Edit/delete requests after submission
- CSV export of requests
- Automated tests for validation and filtering logic
- "Sort by" options (e.g. newest/oldest, priority)

## A note on AI tools

I used AI assistance to help structure the project into components, debug a few issues, and review my README for clarity. The logic, structure, and final implementation are my own — I made sure I understood every part before including it.
