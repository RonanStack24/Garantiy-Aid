import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

await prisma.barangay.upsert({
  where: { barangayCode: "CEBU-PUNTA-PRINCESA" },
  update: { barangayName: "Punta Princesa", city: "Cebu City", province: "Cebu", isActive: true },
  create: {
    barangayCode: "CEBU-PUNTA-PRINCESA",
    barangayName: "Punta Princesa",
    city: "Cebu City",
    province: "Cebu",
  },
});

await prisma.$disconnect();
console.info("Seeded the starter barangay.");
