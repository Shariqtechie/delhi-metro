<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Bebas+Neue&size=72&pause=12000&color=5BC0FF&center=true&vCenter=true&width=600&height=90&lines=DELHI+METRO;ROUTE+FINDER" alt="Delhi Metro Route Finder"/>

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-click%20here-blue?style=for-the-badge)](https://shariqtechie.github.io/delhi-metro/)
[![GitHub Stars](https://img.shields.io/github/stars/shariqtechie/delhi-metro?style=for-the-badge)](https://github.com/shariqtechie/delhi-metro/stargazers)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**The fastest way to plan your Delhi Metro journey — live routes, gate info, nearby stations and more.**

</div>

---

## ✨ Features

- 🔍 **Live Route Search** — Scrapes real-time data from delhimetrorail.info via a Cloudflare Worker
- 🛤️ **Multiple Route Options** — Shows all possible routes as tabs so you can pick the best one
- 🚉 **262 Stations, 11 Lines** — Complete network including Red, Yellow, Blue, Green, Violet, Pink, Magenta, Airport Express, Aqua, Grey and Rapid Metro
- 🗺️ **Visual Route Map** — Full route diagram with colour-coded line segments and interchange markers
- 🚪 **Gate Info** — Entry/exit gate details for every station on your route
- 💰 **Fare & Time** — Exact fare and travel time per route, plus first and last train timings
- 📍 **Nearest Stations (GPS)** — Finds the closest metro stations to your location with real road distances via OSRM routing
- 🚶 **Walk / Drive Tabs** — Switch between walking and driving time to nearby stations
- ⭐ **Save Routes** — Star your favourite routes and they stay saved across sessions (up to 10)
- 🕐 **Recent Searches** — Last 5 routes remembered automatically
- 🔗 **Shareable Links** — Every search updates the URL so you can share exact routes
- 🔎 **Fuzzy Search** — Finds stations even with typos or partial names
- 📱 **PWA** — Installable on Android and iOS, works offline for the UI
- ⚡ **3-Hour Cache** — Route results cached locally so repeated searches are instant

---

## 🏗️ Architecture

```
User (GitHub Pages)
    │
    │  fetch()
    ▼
Cloudflare Worker
    │
    │  fetch() + HTML scrape
    ▼
delhimetrorail.info
    │
    │  returns parsed JSON
    ▼
{ routes: [ { fare, time, firstTrain,
              lastTrain, stations[],
              segments[], gates[] } ] }
    │
    ▼
Full-screen Route View
  ├── Route tabs (if multiple options)
  ├── Stats bar (fare · time · first/last train)
  ├── Visual route map + gate list
  └── Share · Save · Google Maps buttons
```

**Nearby Stations flow:**
```
GPS coords (instant)
    → Overpass API → nearest stations by coords
    → OSRM parallel routing (Promise.all × 7)
    → Walk & Drive tabs with real road distance + time
```

---

## 🗂️ File Structure

```
delhi-metro/
├── index.html        # Main UI — search form, stats, nearby popup
├── style.css         # All styles — dark theme, animations, responsive
├── script.js         # All JS logic — routing, search, GPS, cache, PWA
├── stations.js       # 262 station objects (name, line, slug)
├── worker.js         # Cloudflare Worker — private, not included
├── manifest.json     # PWA manifest
├── sw.js             # Service worker — offline caching
├── favicon.png       # Browser tab icon
├── icon-192.png      # PWA icon (Android)
└── icon-512.png      # PWA icon (splash / iOS)
```

---

## 🚀 Setup & Deployment

### 1. Fork & deploy to GitHub Pages

```bash
git clone https://github.com/yourusername/delhi-metro
cd delhi-metro
git add .
git commit -m "initial deploy"
git push origin main
```

Then go to **Settings → Pages → Source: main branch**.  
Your site goes live at `https://yourusername.github.io/delhi-metro/`

### 2. Update paths in manifest.json and sw.js

Make sure `start_url` and `scope` match your repo name:

```json
"start_url": "/delhi-metro/",
"scope": "/delhi-metro/"
```

### 3. Backend / Cloudflare Worker

The live route data is powered by a private Cloudflare Worker that scrapes delhimetrorail.info. To keep the worker healthy and prevent quota abuse, **the worker URL is not public**.

If you want to self-host or need API access for your own project, feel free to reach out:

📬 **[Open an issue](https://github.com/shariqtechie/delhi-metro/issues)** or contact me directly via GitHub.

---

## 🧠 How It Works

### Route Scraping (Cloudflare Worker)

The worker fetches the route page from `delhimetrorail.info`, parses the raw HTML and extracts all route options, fare, travel time, first/last trains, station lists, interchange segments and gate info — then returns clean JSON to the frontend.

### Fuzzy Search

Two-stage scoring for station name matching:

| Match type | Score |
|---|---|
| Exact match | 4 |
| Starts with query | 3 |
| Includes query | 2 |
| Word / char sequence | 1 |

### GPS Nearby Stations

1. `navigator.geolocation` gets your coordinates
2. Overpass API finds the nearest metro stations
3. OSRM routing fires 7 parallel requests for real road distances
4. Results sorted by distance, shown with walk/drive time
5. Both modes prefetch in background — tab switching is instant

### Caching Strategy

| Data | Strategy | TTL |
|---|---|---|
| Route results | localStorage | 3 hours |
| Saved routes | localStorage | No expiry |
| Recent searches | localStorage | Last 5, deduplicated |
| Static assets | Service worker cache-first | Until `v2` cache bumped |
| Worker requests | Network-first | Always live |

---

## 📱 PWA Installation

**Android (Chrome):** Open the site → tap the install banner or Menu → *Add to Home Screen*

**iOS (Safari):** Open the site → tap Share → *Add to Home Screen*

Once installed, the app works offline for the UI. Route searches still require internet.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Fonts | Bebas Neue + DM Sans (Google Fonts) |
| Backend | Cloudflare Worker (free tier) |
| Data source | delhimetrorail.info (scraped) |
| Routing | OSRM — routing.openstreetmap.de |
| Station coords | OpenStreetMap Overpass API |
| Hosting | GitHub Pages |
| PWA | Web App Manifest + Service Worker |

---

## 🔮 Roadmap

- [ ] Hardcoded station coordinates — removes Overpass dependency, instant nearby results
- [ ] Last mile directions to station gate
- [ ] Journey planner with departure time input
- [ ] Fare calculator for groups
- [ ] Accessibility info per station

---

## 🤝 Contributing

PRs are welcome! Found a missing station, a broken route, or want to add a feature:

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit and push
4. Open a pull request

---

## ⚠️ Disclaimer

All route data, fares, timings and gate information shown in this app is sourced directly from [delhimetrorail.info](https://delhimetrorail.info) — the official Delhi Metro route information website. This app is just a cleaner interface on top of it.

This project is not affiliated with DMRC. For the most accurate and up-to-date information always check the official source directly.

---

## 📄 License

MIT — do whatever you want, just don't blame me if the metro's late.

---

<div align="center">
Made with ☕ and a lot of <code>console.log</code> by <a href="https://github.com/shariqtechie">@shariqtechie</a>
</div>
