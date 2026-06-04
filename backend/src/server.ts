import "dotenv/config";
import { app } from "./app.js";
import { closeDatabasePool } from "./db/client.js";

const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await closeDatabasePool();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
