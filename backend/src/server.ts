import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./database/client.js";

const server = app.listen(env.PORT, () => 
    console.log(`Company Portal API listening on :${env.PORT}`)
);

async function shutdown() { 
    server.close(); 
    await pool.end(); 
    process.exit(0); 
}

process.on("SIGINT", shutdown); 
process.on("SIGTERM", shutdown);
