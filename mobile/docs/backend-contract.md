# Mobile/backend integration checklist

These are the mobile frontend's requirements, derived from the manuscript and latest ERD. The first beneficiary-account endpoints now live in `../../backend`; the remaining rows describe later milestones.

## Implemented account API

| Endpoint | Mobile use |
| --- | --- |
| `GET /barangays` | Loads active service areas and their database IDs. |
| `POST /auth/register` | Stores the collected beneficiary details and issues a registration OTP. |
| `POST /auth/otp/request` | Issues or resends registration/login OTPs with cooldown and expiry. |
| `POST /auth/otp/verify` | Activates registration or logs in and returns a bearer session. |
| `POST /auth/logout` | Revokes the current bearer session. |
| `GET /beneficiaries/me` | Returns the authenticated beneficiary profile. |

| Capability                      | Required behavior and fields                                                                                                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Registration and authentication | **Implemented for phone OTP.** Secure device token storage, startup restoration, protected tab navigation, and logout are connected. Password recovery and face login remain.                                                                 |
| Beneficiary profile             | Beneficiary ID, name, contact number, barangay, verification status, permitted edits, and enrolled programs.                                                                                                                                    |
| Program enrollment              | Program, submission date, status, approval progress, required documents, validation result, and assigned staff contact.                                                                                                                         |
| Schedules                       | Distribution and schedule IDs, program, date, start/end, queue number, location, status, and notification of changes. Backend assigns slots and queue numbers.                                                                                  |
| QR claim pass                   | Server-issued opaque token, distribution scope, expiry, and used/revoked status. Generate and validate tokens on the server. Never trust the mobile demo QR.                                                                                    |
| Claims                          | Authoritative validation, authorized staff action, claim status, amount, program, date, receipt reference, and duplicate blocking across devices. The mobile client displays the result.                                                        |
| Consent and biometrics          | Versioned privacy notice and consent, consent ID and timestamps, withdrawal, secure photo upload if allowed, face enrollment result, and server-side matching/liveness. The client captures a photo; it does not declare a real identity match. |
| Wallet and transactions         | Simulated balance, currency, transaction amount/type/date/status/reference, and receipts. No real financial processing is in capstone scope.                                                                                                    |
| Notifications                   | Notification ID/type/message/date/read status, SMS/push preferences, and device registration for push. No SMS provider secret belongs in the app.                                                                                               |
| Assistant and escalation        | Session/language, authorized answers about the beneficiary, service errors, assigned staff contact, and explicit submitted-ticket confirmation.                                                                                                 |

The mobile app centralizes API calls with a timeout, loading/error states, server-issued codes, persistent sessions, and protected signed-in routes. Do not embed database, SMS, or biometric-service credentials in Expo public environment variables.

Add offline schedule/pass caching only after agreeing token expiry and revocation behavior. The existing frontend makes no claim that a pass remains valid while offline.
