# GarantiyAid

GarantiyAid is a capstone prototype for beneficiary registration, phone OTP authentication, distribution scheduling, QR-based claiming, and simulated aid records.

## Projects

- [`mobile/`](mobile/README.md) — React Native and Expo beneficiary app based on the supplied Figma design.
- [`backend/`](backend/README.md) — Express, Prisma, and PostgreSQL REST API.

Registration, generated OTP verification, persistent sessions, authenticated profile loading, and logout use the backend database. Scheduling, claims, biometrics, notifications, and the wallet are currently frontend demonstrations and will be connected in later milestones.

## Local development

Start the database and API:

```powershell
cd backend
npm install
npm run db:local
npm run db:deploy
npm run db:seed
npm run dev
```

Then start the browser preview in another terminal:

```powershell
cd mobile
npm install
npm run web -- --port 8765
```

Open `http://127.0.0.1:8765`.
