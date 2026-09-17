# Frontend verification

Verified locally on September 17, 2026:

- `npm run typecheck`: pass. TypeScript includes source files only, excluding generated bundles.
- `npm run export:web`: pass.
- `npm run export:android`: pass. This produces a Hermes bundle, not an installed APK or a native-device test.
- Account creation validates personal information, birth date, sex, home address, barangay, city, mobile number, and the generated development OTP across four steps before storing the authenticated session.
- Registration validation accepts Unicode letters and common Filipino name/address punctuation while rejecting numeric or punctuation-only identity and location values. Error messages update with EN/BS changes and are exposed to assistive technology as labeled, assertive alerts.
- Browser layout checks: 390 × 844 and 320 × 680. Checked English and Bisaya Home/help layouts. Compact Home adapts its header to preserve the full beneficiary name and touch targets.
- Authenticated API check: the seeded beneficiary returns one approved 4Ps enrollment and the assigned October 2, 2026 schedule with queue 47; logout revokes the test session.
- QR issuance check: two successive passes are unique, use the `GAI1` format, expire with the assigned slot, and leave one active plus one revoked hash in PostgreSQL.
- Live Metro check: the web page and latest JavaScript bundle both return HTTP 200. Home, Schedule, Enrollment status, and the schedule assistant answer now read the authenticated overview; accounts without staff-assigned records receive empty states.
- Claim-status regression check: Help reports no completed claim before the simulation, then reports the sample ₱1,500 credit after the simulation. English and Bisaya free-text status queries both reflect the current session.
- Brand icon provenance: original Figma reference and SVG rasterization are embedded in `assets/icon.png`; asset scan passes.

No Android emulator, adb, or connected phone was available. Front-camera permission/capture/retake, native safe areas, keyboard resize, system Back, OS font scaling, and performance still need a physical Android check. SMS delivery, push delivery, account recovery, biometric matching/liveness, staff escalation, QR scanning, and server-side claim validation were not tested.
