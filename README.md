# Velora

Velora is a premium-style live news dashboard that pulls stories from multiple global feeds and presents them in a sleek glass interface.

## Stack

- `frontend/`: React + Vite
- `backend/`: Express + RSS aggregation

## What it does

- Aggregates live stories from multiple news sources
- Normalizes articles into one consistent feed
- Supports keyword, category, and source filtering
- Shows featured highlights and curated category sections
- Refreshes live data on demand
- Uses feed caching so the app stays responsive

## Sources connected

- BBC World
- BBC Business
- TechCrunch
- The Verge
- ESPN
- The Guardian
- New York Times

## Run locally

```bash
cd "/Users/manas/Code/FULLSTACK/Projects /NewsAggregator/backend"
npm install
npm run dev
```

```bash
cd "/Users/manas/Code/FULLSTACK/Projects /NewsAggregator/frontend"
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:8080`

## Optional

To start both from the project root:

```bash
cd "/Users/manas/Code/FULLSTACK/Projects /NewsAggregator"
npm run dev
```
