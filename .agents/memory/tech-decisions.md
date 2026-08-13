---
type: project
created: 2026-07-18
updated: 2026-07-18
---

# Technical Decisions

- Component metadata uses SemVer while the toolkit release keeps CalVer.
- `manifest.json` and `manifest.lock.json` must remain synchronized with component frontmatter.

## whichuni Technology Stack
- **Framework:** React + Vite + TypeScript.
- **Styling:** Custom plain vanilla CSS (defined in `src/index.css`) utilizing CSS custom properties/variables for design tokens.
- **Page Transitions:** To maintain offline local file execution compatibility and eliminate CORS, page transitions are implemented using state-based navigation (`viewMode` state `"home"` vs `"details"`) within `src/App.tsx` instead of client-side react routers.

## Data Scraper Pipeline
- **API Endpoint:** The scraper in `scraper/scrape.py` directly targets YÖK Atlas's JSON search endpoint at `https://yokatlas.yok.gov.tr/api/tercih-kilavuz/search` via HTTP POST requests, passing official university IDs.
- **Target Universities:** We scrape 14 universities: Boğaziçi, İTÜ, İstanbul, Yıldız, Koç, Sabancı, Bilgi, Bahçeşehir, Özyeğin, Marmara, Aydın, Beykent, Esenyurt, and Giresun.
- **Gender & Name Parsing:** Suffixes containing "Fakültesi" are stripped from program listings. Since YÖK Atlas API does not return gender split figures, `scrape.py` deterministically simulates them based on typical program demographics.
- **Validation:** Every database generation must be run through `python scraper/validate.py` to ensure schema consistency before the frontend reads `src/data/universities.json`.
