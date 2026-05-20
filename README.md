# Finance Tracker

A personal finance dashboard built with React and Vite. Connects to the [Finance Tracker API](https://github.com/Jsteinhauer7/finance-tracker-api) to track income and expenses.

**Live Demo:** https://finance-tracker-sigma-three.vercel.app/

## Features

- Animated bento grid dashboard — all data on one page, no tabs
- Financial health score displayed as a circular gauge SVG
- Income consumption bar showing what percentage of income is spent
- Spending breakdown pie chart by category (Recharts)
- Animated number counters on load
- Add and delete transactions inline
- Glassmorphism cards with animated gradient background
- Fully responsive

## Tech Stack

- React 18 + Vite
- Recharts for data visualization
- CSS glassmorphism (backdrop-filter blur)
- Deployed on Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npx vite
```

### 3. Open in browser

```
http://localhost:5173
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx      # Main component — all UI and API logic
│   └── App.css      # Glassmorphism styles, bento grid, animations
├── index.html
└── vite.config.js
```

## Backend

The API is built with FastAPI and deployed on Render.

- Repo: https://github.com/Jsteinhauer7/finance-tracker-api
- Live API: https://finance-tracker-api-qsu8.onrender.com
