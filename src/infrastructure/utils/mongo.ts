import mongoose from "mongoose";
import { Config } from "./config";
import { Logger } from "../services/logger";

let mongoManagerInstance: MongoManager | null = null;

export class MongoManager {
  constructor(
    private readonly config: Config,
    private readonly logger: Logger
  ) {
    this.connect();

    // Graceful shutdown (only on Node runtime, not Edge)
    if (typeof process !== "undefined" && process.on) {
      process.on("SIGINT", () => this.close());
    }
  }

  /** Start mongo connection */
  private connect(): void {
    if (mongoose.connection.readyState !== 0) {
      return; // Already connecting or connected
    }

    const { db, connectionUri } = this.config;

    mongoose.connect(connectionUri, { dbName: db });

    mongoose.connection.on("connected", () => {
      this.logger.info(`MongoDB connected: ${db}`);
    });

    mongoose.connection.on("error", (err) => {
      this.logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      this.logger.warn("MongoDB disconnected");
    });
  }

  /** Gracefully close */
  close(): void {
    if (mongoose.connection.readyState === 1) {
      this.logger.info("Closing MongoDB connection…");
      mongoose.connection.close();
    }
  }
}

/**
 * Singleton accessor
 */
export function getMongoManager(config: Config, logger: Logger): MongoManager {
  if (!mongoManagerInstance) {
    mongoManagerInstance = new MongoManager(config, logger);
  }
  return mongoManagerInstance;
}
