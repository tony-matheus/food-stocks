export type Status = 'rising' | 'falling' | 'stable'

export interface SaleEvent {
  ts: number
  qty: number
  price?: number | null
}

export interface DrinkSim {
  id: string
  name: string
  stock_name: string
  original_price: number
  count: number
  current_price: number
  timestamp: string
  status: Status

  // simulation extras
  history: SaleEvent[]
  // pricing config (hardcoded here for PoC)
  baseMargin: number
  minMargin: number
  maxMargin: number
  rounding: 'quarter' | 'cent'
  vBaseline: number // expected units/hour
  inventoryOnHand: number // current servings on hand
  inventoryTarget: number // desired on hand

  // internals
  cost: number // derived from original_price and baseMargin (PoC)
  lastPriceTs: number // when price last changed
  lastPriceApplied?: number
}

export interface PricingParams {
  alpha?: number // demand weight
  beta?: number // inventory weight
  capUp?: number // per-update up cap
  capDown?: number // per-update down cap
  hysteresisPct?: number
  saleWindowMin?: number // rolling minutes to compute recent velocity
}
