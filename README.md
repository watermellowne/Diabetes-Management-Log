# Insulin Management Log

A simple React app for tracking glucose readings and insulin doses. It includes a daily log, safety alerts, and a lightweight analytics view with charts and summary cards.

## Key Features

- Add, edit, and delete glucose and insulin entries
- Automatic safety alerts: Low (< 70 mg/dL) and High (> 180 mg/dL)
- Analytics page with glucose trends and average dose by insulin type
- Export log tables and analytics charts to PDF

## Tech Stack

- React + Vite
- Tailwind CSS + shadcn UI components
- React Hook Form + Zod validation
- Recharts for charts
- html-to-image + jsPDF for exports
- Wouter for routing