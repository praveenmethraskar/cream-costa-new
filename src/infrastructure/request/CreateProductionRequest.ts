import { ProductionStatus } from "../models/enums/productionstatus"

export interface CreateProductionRequest {
  code: string
  name: string
  requiredProductionQty: number
  plannedProductionQty?: number
  productionStatus?: ProductionStatus
}