-- CreateTable
CREATE TABLE "qr_tokens" (
    "qr_token_id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "distribution_id" UUID NOT NULL,
    "token_hash" CHAR(64) NOT NULL,
    "qr_status" VARCHAR(32) NOT NULL DEFAULT 'active',
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_tokens_pkey" PRIMARY KEY ("qr_token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "qr_tokens_token_hash_key" ON "qr_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "qr_tokens_beneficiary_id_distribution_id_qr_status_idx" ON "qr_tokens"("beneficiary_id", "distribution_id", "qr_status");

-- AddForeignKey
ALTER TABLE "qr_tokens" ADD CONSTRAINT "qr_tokens_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("beneficiary_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_tokens" ADD CONSTRAINT "qr_tokens_distribution_id_fkey" FOREIGN KEY ("distribution_id") REFERENCES "distributions"("distribution_id") ON DELETE CASCADE ON UPDATE CASCADE;
