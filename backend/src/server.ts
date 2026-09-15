import { app } from "./app.ts";
import { config } from "./config.ts";
import { prisma } from "./db.ts";

const server = app.listen(config.port, "0.0.0.0", () => {
  console.info(`Garantiy-Aid API listening on http://localhost:${config.port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
