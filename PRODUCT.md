# GarantiyAid

<!-- impeccable:product-schema 1 -->

## Platform

android

## Stack

React Native with Expo, as specified by the capstone manuscript. The mobile app uses TypeScript and Expo Router. Backend integration remains an open team task.

## Users

Social welfare beneficiaries in selected Cebu City barangays. Ronan is responsible for mobile development. Staff, facilitators, and administrators use the team's web application.

## Product Purpose

Help beneficiaries register, view an assigned distribution schedule and queue number, present a QR claim pass, and view claim records and updates.

## Operating Context

The manuscript proposes one REST backend shared by the mobile and web apps. The supplied ERD defines beneficiaries, schedules, QR tokens, claims, notifications, enrollment, documents, consent, wallet accounts, and transactions. Real authentication, scheduling, token issuance, and claim validation belong to the backend.

## Capabilities and Constraints

The initial mobile deliverable is an interactive frontend with synthetic data. Account creation collects personal identity, birth date, sex, home address, barangay, city, and mobile number in memory before OTP verification. OTP, account recovery, address or identity record checking, facial matching/liveness, claim approval, support escalation, and notifications are not connected to services. Face capture is optional and requires opt-in; captures are not uploaded. The wallet is a simulation only. No real funds, government database connection, or live payment integration is in scope.

## Brand Commitments

The user's Figma mobile screens are the visual authority: https://www.figma.com/design/tZEG9H4ZRsP86KvhBjtd3X/Garantiy-Aid?node-id=0-1. Preserve their blue and green identity, pale background, shield logo, compact forms, claiming card, and Home/Wallet/Help/Profile navigation. Reproduce the screen content inside the device frame; the Figma phone housing and canvas annotations are not application chrome. No replacement visual identity is requested.

## Evidence on Hand

User-supplied manuscript: C:/Users/Ronan/Downloads/GarantiyAid-Capstone30-Manuscript1.pdf. User-supplied ERD: C:/Users/Ronan/Downloads/ERD.jpg. Publicly viewable Figma includes 30 mobile frames covering the primary flow, recovery, enrollment, privacy, chat scenarios, and exception states. Precise Figma fonts and downloadable logo assets are unavailable to the anonymous inspector; Inter and a small recreated vector mark are implementation assumptions.

## Accessibility & Inclusion

English/Bisaya selection, readable text, phone-sized layouts, keyboard-safe forms, system Back support, and at least 48 dp touch targets. Phone is the initial supported layout; tablets are not a release target yet.
