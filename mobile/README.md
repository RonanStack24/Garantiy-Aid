# GarantiyAid mobile

React Native + Expo beneficiary frontend built from Ronan's Figma mobile designs.

## Run on your phone

From PowerShell:

```powershell
cd C:\Users\Ronan\Documents\Garantiy-Aid\mobile
npm install
npm start
```

Open Expo Go on Android and scan the terminal's QR code. Your computer and phone should be on the same Wi-Fi. If Expo Go asks for an SDK update, update it before opening this SDK 57 project. Use `npm run web` for a browser preview.

Start the API in `../backend` before registering or logging in. Copy `.env.example` to `.env`; use `http://127.0.0.1:3000` for the browser, `http://10.0.2.2:3000` for the Android Studio emulator, or this computer's LAN address for Expo Go on a physical phone. The local backend displays each generated development OTP on the verification screen because SMS is not connected yet.

Skip optional face enrollment or choose demo capture. Camera access is requested only after the consent screen and the Enable camera button. Photos are not uploaded, and demo capture does not perform face matching or liveness checks.

## Implemented frontend

- English/Bisaya four-step account creation backed by PostgreSQL, including active-barangay validation, generated OTP verification, phone login, authenticated profile identity, and server-side logout.
- Optional biometric consent, front-camera photo capture, retake, demo enrollment success, and consent withdrawal.
- Home appointment card, schedule details, queue number, demo QR pass, identity verification preview, claim confirmation, and duplicate-attempt handling within the preview session.
- Simulated wallet, receipt modal, transaction history, and selected receipts. Preview claiming updates the simulated balance once per session.
- Notifications with read state and detail views, profile editing, notification preference controls, enrollment progress, missing-document file selection, and recovery screens.
- Sample assistant conversations for schedule, current demo claim status, documents, face scan failure, and enrollment; staff-support preview.
- Schedule update, expired QR, and claim-review states.

Registration and authentication use the local backend database. Schedule, transaction, enrollment, notification, biometric, and claim records remain synthetic. Session tokens are encrypted with Expo SecureStore on Android and iOS, while the browser preview uses local storage. On startup the app validates the saved session through `/beneficiaries/me`; expired sessions return to Welcome and signed-out users cannot open the tab routes.

## Figma reference

[Garantiy-Aid design](https://www.figma.com/design/tZEG9H4ZRsP86KvhBjtd3X/Garantiy-Aid?node-id=0-1)

The original canvas contains phone housing and flow annotations. The implementation recreates the actual app content inside those phones. It preserves the pale backgrounds, blue action buttons, green success states, compact forms, claiming card, and Home/Wallet/Help/Profile navigation. Touch targets and small text were enlarged for use on a real device. The supplied QR image was replaced with a scannable **invalid demo token**. Inter and a recreated shield icon approximate the anonymously viewable design; replace the mark with the original exported Figma asset for exact brand fidelity.

## Project structure

```text
app/                 Expo Router screens and navigation
src/components.tsx   Shared controls and layout
src/theme.ts         Figma-derived colors and typography
src/state.tsx        In-memory preview state and synthetic records
src/screens/         Entry flow, main tabs, detail screens, and help
docs/backend-contract.md  Integration work for the backend team
```

## Verification

```powershell
npm run typecheck
npm run export:web
npm run export:android
```

Android bundle export checks compilation, not device behavior. Test camera permissions, system Back, keyboard, larger text, and safe areas on a real phone before presenting the capstone.
