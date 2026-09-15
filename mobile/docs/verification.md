# Frontend verification

Verified locally on September 14, 2026:

- `npm run typecheck`: pass. TypeScript includes source files only, excluding generated bundles.
- `npm run export:web`: pass.
- `npm run export:android`: pass. This produces a Hermes bundle, not an installed APK or a native-device test.
- Account creation now opens first and validates personal information, birth date, sex, home address, barangay, city, mobile number, and the demo OTP across four steps. Entered registration data remains in memory for the preview session.
- Registration validation accepts Unicode letters and common Filipino name/address punctuation while rejecting numeric or punctuation-only identity and location values. Error messages update with EN/BS changes and are exposed to assistive technology as labeled, assertive alerts.
- Browser layout checks: 390 × 844 and 320 × 680. Checked English and Bisaya Home/help layouts. Compact Home adapts its header to preserve the full beneficiary name and touch targets.
- Interactive browser checks: blank phone number rejected, valid number opens OTP, invalid OTP rejected, demo OTP opens consent, consent can be skipped, Home opens QR pass, preview claim records once and updates the simulated wallet, receipt shows the selected transaction, and the assistant returns the matching sample schedule in both languages.
- Claim-status regression check: Help reports no completed claim before the simulation, then reports the sample ₱1,500 credit after the simulation. English and Bisaya free-text status queries both reflect the current session.
- Brand icon provenance: original Figma reference and SVG rasterization are embedded in `assets/icon.png`; asset scan passes.

No Android emulator, adb, or connected phone was available. Front-camera permission/capture/retake, native safe areas, keyboard resize, system Back, OS font scaling, and performance still need a physical Android check. The app is a demo frontend, so real OTP, SMS, push delivery, account recovery, biometric matching/liveness, staff escalation, and server-side claim validation were not tested.
