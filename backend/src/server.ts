import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import { connectToDatabase } from "./db";

const PORT = process.env.PORT || 3001;

import { DatabaseConnectionError } from "./utils/errors/database-connection-error";

const start = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new DatabaseConnectionError();
    }

    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server");
    console.error(err);
    process.exit(1);
  }
};

start();
