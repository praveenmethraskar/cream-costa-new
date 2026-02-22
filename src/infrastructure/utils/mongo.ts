import mongoose from "mongoose";
import { Config } from "./config";
import { Logger } from "../services/logger";

let mongoManagerInstance: MongoManager | null = null;

export class MongoManager {
  private isConnected = false;

  constructor(
    private readonly config: Config,
    private readonly logger: Logger
  ) {}

  /** Connect manually (NOT in constructor) */
  async connect(): Promise<void> {
    if (this.isConnected || mongoose.connection.readyState !== 0) {
      return;
    }

    const { db, connectionUri } = this.config;

    await mongoose.connect(connectionUri, { dbName: db });

    this.isConnected = true;

    this.logger.info(`MongoDB connected: ${db}`);
  }

  /** Gracefully close */
  async close(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
      this.logger.info("Closing MongoDB connection…");
      await mongoose.connection.close();
      this.isConnected = false;
    }
  }
}

/** Singleton accessor */
export function getMongoManager(
  config: Config,
  logger: Logger
): MongoManager {
  if (!mongoManagerInstance) {
    mongoManagerInstance = new MongoManager(config, logger);
  }
  return mongoManagerInstance;
}