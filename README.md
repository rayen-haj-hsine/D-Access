# D-Access

Mobile + backend project for discovering accessibility-friendly places.

## Tech Stack
- Frontend: React Native (Expo)
- Backend: NestJS + MongoDB (Mongoose)
- Maps/Data: OSM tiles + backend-side Overpass ingestion/cache

## Project Structure
- `front-end/` → Mobile app
- `back-end/` → API server
- `.github/workflows/ci.yml` → CI pipeline
- `SPRINT_1_IMPLEMENTATION_REPORT.md` → Sprint 1 summary

## Prerequisites
- Node.js 20+
- npm 10+
- MongoDB running locally or remotely

## Environment Setup
1. Backend env:
   - Copy `back-end/.env.example` to `back-end/.env`
   - Fill required values (Mongo URI, JWT/email/social keys if used)
2. Frontend env:
   - Copy `front-end/.env.example` to `front-end/.env`
   - Set API base URL to backend host

## Install Dependencies
```bash
cd back-end && npm install
cd ../front-end && npm install
```

## Run in Development
### Backend
```bash
cd back-end
npm run start:dev
```
- API base: `http://localhost:3000`
- Health: `GET /health`
- Swagger: `http://localhost:3000/api-docs`

### Frontend
```bash
cd front-end
npm start
```
Then run on emulator/device via Expo.

## Useful Commands
### Backend
```bash
npm run build
npm run typecheck
npm run lint
npm run seed:places
```

### Frontend
```bash
npm run typecheck
npm run lint
npm run build
```

## Sprint 1 Status
Sprint 1 implementation details are documented in:
- `SPRINT_1_IMPLEMENTATION_REPORT.md`

## Notes
- Overpass API is used only from backend (not mobile directly).
- Nearby places are served from MongoDB cache with geospatial indexing.
- OSM attribution is displayed in the mobile map screen.
