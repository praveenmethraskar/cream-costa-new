import { container } from "./container"
import { MongoManager } from "./mongo"

export async function connectDB(): Promise<void> {
  const mongo = container.resolve<MongoManager>("mongo")
  await mongo.connect()  // already guards against double-connect internally
}