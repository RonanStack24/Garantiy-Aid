# Garantiy-Aid backend

This is the first real-data API for the beneficiary mobile app. It implements barangay lookup, account registration, OTP verification, OTP login, logout, and the signed-in beneficiary profile. Data is stored in PostgreSQL through Prisma.

## Run locally

1. Install the packages and start Prisma's local PostgreSQL server:

```powershell
npm install
npm run db:local
```

2. Copy `.env.example` to `.env`. Put the PostgreSQL URL printed by `db:local` in `DATABASE_URL` and replace `AUTH_PEPPER` with a long random value.
3. Apply the included migration, seed the starter service area, and start the API:

```powershell
npm run db:deploy
npm run db:seed
npm run dev
```

The API listens at `http://localhost:3000`. `GET /health` confirms that PostgreSQL is connected.

During development, OTP codes are printed in the backend terminal and returned as `developmentOtp` in the response. Production never returns or logs the code; an SMS provider must be connected before production use.

## Implemented endpoints

- `GET /health`
- `GET /barangays`
- `POST /auth/register`
- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/logout`
- `GET /beneficiaries/me`

Protected endpoints use `Authorization: Bearer <accessToken>`. Access tokens are random, stored only as hashes, expire after seven days, and are revoked by logout.
