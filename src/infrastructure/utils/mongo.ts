import mongoose from "mongoose"
import { Config } from "./config"
import { Logger } from "../services/logger"

export class MongoManager {
  private readonly config: Config
  private readonly logger: Logger

  constructor({
    config,
    logger,
  }: {
    config: Config
    logger: Logger
  }) {
    this.config = config
    this.logger = logger

    this.connect()

    if (typeof process !== "undefined" && process.on) {
      process.on("SIGINT", () => this.close())
    }
  }

  private connect(): void {
    if (mongoose.connection.readyState !== 0) {
      return
    }

    const { db, connectionUri } = this.config

    mongoose.connect(connectionUri, { dbName: db })

    mongoose.connection.on("connected", () => {
      this.logger.info(`MongoDB connected: ${db}`)
    })

    mongoose.connection.on("error", (err) => {
      this.logger.error(`MongoDB connection error: ${err}`)
    })

    mongoose.connection.on("disconnected", () => {
      this.logger.warn("MongoDB disconnected")
    })
  }

  close(): void {
    if (mongoose.connection.readyState === 1) {
      this.logger.info("Closing MongoDB connection…")
      mongoose.connection.close()
    }
  }
}