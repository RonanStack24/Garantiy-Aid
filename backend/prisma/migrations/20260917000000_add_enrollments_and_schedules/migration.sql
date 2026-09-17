-- CreateTable
CREATE TABLE "programs" (
    "program_id" UUID NOT NULL,
    "program_name" VARCHAR(160) NOT NULL,
    "program_code" VARCHAR(32) NOT NULL,
    "program_type" VARCHAR(80) NOT NULL,
    "description" TEXT,
    "grant_amount" DECIMAL(12,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "enrollment_id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "enrollment_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(32) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "distributions" (
    "distribution_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "distribution_date" DATE NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "status" VARCHAR(32) NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "distributions_pkey" PRIMARY KEY ("distribution_id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "schedule_id" UUID NOT NULL,
    "distribution_id" UUID NOT NULL,
    "beneficiary_id" UUID NOT NULL,
    "slot_start" TIMESTAMPTZ(6) NOT NULL,
    "slot_end" TIMESTAMPTZ(6) NOT NULL,
    "queue_number" INTEGER NOT NULL,
    "status" VARCHAR(32) NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programs_program_code_key" ON "programs"("program_code");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_beneficiary_id_program_id_key" ON "enrollments"("beneficiary_id", "program_id");

-- CreateIndex
CREATE INDEX "enrollments_program_id_status_idx" ON "enrollments"("program_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "distributions_program_id_distribution_date_location_key" ON "distributions"("program_id", "distribution_date", "location");

-- CreateIndex
CREATE INDEX "distributions_distribution_date_status_idx" ON "distributions"("distribution_date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_distribution_id_beneficiary_id_key" ON "schedules"("distribution_id", "beneficiary_id");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_distribution_id_queue_number_key" ON "schedules"("distribution_id", "queue_number");

-- CreateIndex
CREATE INDEX "schedules_beneficiary_id_slot_start_idx" ON "schedules"("beneficiary_id", "slot_start");

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("beneficiary_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distributions" ADD CONSTRAINT "distributions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("program_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_distribution_id_fkey" FOREIGN KEY ("distribution_id") REFERENCES "distributions"("distribution_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("beneficiary_id") ON DELETE CASCADE ON UPDATE CASCADE;
