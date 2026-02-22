// src/infrastructure/utils/container.ts
import { createContainer, asClass, InjectionMode, AwilixContainer } from "awilix"
import { AppApiService } from "../services/api"
import { AppUserRepository } from "../repositories/user"
import { AppProductRepository } from "../repositories/inventory"
import { AppLogger } from "../services/logger"
import { AppConfig } from "./config"
import { MongoManager } from "./mongo"
import { AppEnvService } from "../services/env"
import { AppOrderRepository } from "../repositories/order"
import { AppCryptoService } from "../services/crypto"
let globalContainer: AwilixContainer | null = null

export const loadContainer = () => {
  if (globalContainer) return globalContainer

  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  })

  container.register({
    // services
    envService: asClass(AppEnvService).singleton(),
    config: asClass(AppConfig).singleton(),
    mongo: asClass(MongoManager).singleton(),
    apiService: asClass(AppApiService).scoped(),
    logger: asClass(AppLogger).singleton(),
    cryptoService: asClass(AppCryptoService).scoped(),
    // repositories
    userRepository: asClass(AppUserRepository).scoped(),
    productRepository: asClass(AppProductRepository).scoped(),
    orderRepository: asClass(AppOrderRepository).scoped(),
  })

  globalContainer = container
  return container
}

export const container = loadContainer()
