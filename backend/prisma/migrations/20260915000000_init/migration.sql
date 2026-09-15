-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "barangays" (
    "barangay_id" UUID NOT NULL,
    "barangay_code" VARCHAR(32) NOT NULL,
    "barangay_name" VARCHAR(120) NOT NULL,
    "city" VARCHAR(120) NOT NULL,
    "province" VARCHAR(120) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "barangays_pkey" PRIMARY KEY ("barangay_id")
);

-- CreateTable
CREATE TABLE "beneficiaries" (
    "beneficiary_id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "middle_name" VARCHAR(100),
    "last_name" VARCHAR(100) NOT NULL,
    "birth_date" DATE NOT NULL,
    "sex" VARCHAR(32) NOT NULL,
    "address" TEXT NOT NULL,
    "barangay_id" UUID NOT NULL,
    "contact_number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(254),
    "password_hash" VARCHAR(255),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "philsys_number" VARCHAR(32),
    "status" VARCHAR(32) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "beneficiaries_pkey" PRIMARY KEY ("beneficiary_id")
);

-- CreateTable
CREATE TABLE "otp_challenges" (
    "challenge_id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "purpose" VARCHAR(20) NOT NULL,
    "code_hash" CHAR(64) NOT NULL,
    "attempts_remaining" INTEGER NOT NULL DEFAULT 5,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "consumed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_challenges_pkey" PRIMARY KEY ("challenge_id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "session_id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "token_hash" CHAR(64) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "barangays_barangay_code_key" ON "barangays"("barangay_code");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiaries_contact_number_key" ON "beneficiaries"("contact_number");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiaries_email_key" ON "beneficiaries"("email");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiaries_philsys_number_key" ON "beneficiaries"("philsys_number");

-- CreateIndex
CREATE INDEX "beneficiaries_barangay_id_idx" ON "beneficiaries"("barangay_id");

-- CreateIndex
CREATE INDEX "otp_challenges_beneficiary_id_purpose_created_at_idx" ON "otp_challenges"("beneficiary_id", "purpose", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_token_hash_key" ON "auth_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "auth_sessions_beneficiary_id_expires_at_idx" ON "auth_sessions"("beneficiary_id", "expires_at");

-- AddForeignKey
ALTER TABLE "beneficiaries" ADD CONSTRAINT "beneficiaries_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangays"("barangay_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_challenges" ADD CONSTRAINT "otp_challenges_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("beneficiary_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("beneficiary_id") ON DELETE CASCADE ON UPDATE CASCADE;
