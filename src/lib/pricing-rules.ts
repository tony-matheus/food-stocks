// pricing-helpers.ts
// In-memory dynamic pricing helpers (no endpoints).

import { DrinkSim, PricingParams, SaleEvent, Status } from '../types'

export const DEFAULT_PARAMS: Required<PricingParams> = {
  alpha: 0.15,
  beta: 0.25,
  capUp: 0.08,
  capDown: 0.05,
  hysteresisPct: 0.01,
  saleWindowMin: 0.1,
}

// ---------- utilities

const clamp = (x: number, lo: number, hi: number) =>
  Math.min(Math.max(x, lo), hi)
const roundToCents = (x: number) => Math.round(x * 100) / 100
const roundToQuarter = (x: number) => Math.ceil(x * 4) / 4
const now = () => Date.now()

export function relativePtBR(minutesAgo: number): string {
  if (minutesAgo <= 0) return 'agora'
  if (minutesAgo === 1) return '1 minuto atrás'
  return `${minutesAgo} minutos atrás`
}

// ---------- demand / inventory / pricing

function computeVelocityPerHour(
  history: SaleEvent[],
  windowMin: number,
  tNow = now()
): number {
  const windowMs = windowMin * 60 * 1000
  const start = tNow - windowMs
  let units = 0
  console.log({ history })
  for (const ev of history) {
    if (ev.ts >= start && ev.ts <= tNow) units += ev.qty
  }
  // units-in-window -> per-hour
  return (units / Math.max(windowMin, 1e-9)) * 60
}

function computeDemand(vEma: number, vBaseline: number): number {
  const eps = 1e-9
  return clamp(
    (vEma - Math.max(vBaseline, 1)) / Math.max(vBaseline, eps),
    -2,
    2
  )
}

function computeInventoryPressure(onHand: number, target: number): number {
  if (target <= 0) return 0
  const R = onHand / target
  return clamp(1 - R, 0, 1)
}

function nextPriceFor(
  it: DrinkSim,
  params: Required<PricingParams>,
  tNow = now()
): { price: number; D: number; I: number; F: number } {
  // demand & inventory
  const v = computeVelocityPerHour(it.history, params.saleWindowMin, tNow)
  const D = computeDemand(v, it.vBaseline)
  const I = computeInventoryPressure(it.inventoryOnHand, it.inventoryTarget)

  // price factor (no station capacity in this PoC)
  let F = 1 + params.alpha * D + params.beta * I
  F = clamp(F, 1 - params.capDown, 1 + params.capUp)

  // build price around cost & margins. We derive cost from original price & base margin at init.
  const base = it.cost * (1 + it.baseMargin)
  const raw = base * F
  const minPrice = it.cost * (1 + it.minMargin)
  const maxPrice = it.cost * (1 + it.maxMargin)
  let bounded = clamp(raw, minPrice, maxPrice)

  // hysteresis
  const ref = it.lastPriceApplied ?? it.current_price
  const change = Math.abs(bounded - ref) / Math.max(ref, 1e-9)
  if (change < params.hysteresisPct) bounded = ref

  // rounding
  const rounded =
    it.rounding === 'quarter' ? roundToQuarter(bounded) : roundToCents(bounded)

  return { price: roundToCents(rounded), D, I, F }
}

function statusFromChange(
  prev: number,
  next: number,
  usingDelta: boolean = false
): Status {
  if (usingDelta) {
    const delta = (next - prev) / Math.max(prev, 1e-9)

    if (delta > 0.003) return 'rising'
    if (delta < -0.003) return 'falling'
    return 'stable'
  }

  if (next > prev) return 'rising'
  if (next < prev) return 'falling'
  return 'stable'
}

// ---------- public API

// Hardcoded baselines / inventory / margins per id (tweak as needed)
const DEFAULT_ITEM_RULES: Record<
  string,
  {
    vBaseline: number
    inventoryTarget: number
    margins: [number, number, number]
    rounding: 'quarter' | 'cent'
  }
> = {
  Mojito: {
    vBaseline: 16,
    inventoryTarget: 120,
    margins: [0.75, 0.65, 0.85],
    rounding: 'quarter',
  },
  Caipirinha: {
    vBaseline: 12,
    inventoryTarget: 100,
    margins: [0.75, 0.65, 0.85],
    rounding: 'quarter',
  },
  'Half Pint': {
    vBaseline: 10,
    inventoryTarget: 160,
    margins: [0.6, 0.5, 0.7],
    rounding: 'quarter',
  },
  Brahma: {
    vBaseline: 14,
    inventoryTarget: 220,
    margins: [0.65, 0.55, 0.75],
    rounding: 'quarter',
  },
  Amstel: {
    vBaseline: 12,
    inventoryTarget: 220,
    margins: [0.65, 0.55, 0.75],
    rounding: 'quarter',
  },
  'Stella Artois': {
    vBaseline: 10,
    inventoryTarget: 180,
    margins: [0.65, 0.55, 0.75],
    rounding: 'quarter',
  },
  Heineken: {
    vBaseline: 12,
    inventoryTarget: 180,
    margins: [0.7, 0.6, 0.8],
    rounding: 'quarter',
  },
  Corona: {
    vBaseline: 11,
    inventoryTarget: 160,
    margins: [0.7, 0.6, 0.8],
    rounding: 'quarter',
  },
  Budweiser: {
    vBaseline: 13,
    inventoryTarget: 200,
    margins: [0.65, 0.55, 0.75],
    rounding: 'quarter',
  },
}

export function initSim(
  drinks: Array<Omit<DrinkSim, keyof DrinkSim>> & any
): DrinkSim[] {
  const t = now()
  return drinks.map((d: any) => {
    const rules = DEFAULT_ITEM_RULES[d.name] ?? {
      vBaseline: 10,
      inventoryTarget: 150,
      margins: [0.65, 0.55, 0.75] as [number, number, number],
      rounding: 'quarter' as const,
    }
    const [baseMargin, minMargin, maxMargin] = rules.margins
    // derive cost from original price and base margin (PoC assumption)
    const cost = d.original_price / (1 + baseMargin)

    const seed: DrinkSim = {
      ...d,
      history: [],
      baseMargin,
      minMargin,
      maxMargin,
      rounding: rules.rounding,
      vBaseline: rules.vBaseline,
      inventoryOnHand: rules.inventoryTarget,
      inventoryTarget: rules.inventoryTarget,
      cost,
      lastPriceTs: t,
      lastPriceApplied: d.current_price,
      timestamp: d.timestamp ?? 'agora',
      status: d.status ?? 'stable',
    }
    return seed
  })
}

export function recordSale({
  list,
  id,
  qty = 1,
  ts = now(),
  price = null,
}: {
  list: DrinkSim[]
  id: string
  qty?: number
  ts?: number
  price?: number | null
}): DrinkSim[] {
  return list.map((p) => {
    if (p.id !== id) return p
    const history = [...p.history, { ts, qty, price }]
    // decrease inventory immediately for PoC
    const inventoryOnHand = Math.max(0, p.inventoryOnHand - qty)
    return {
      ...p,
      history,
      count: (p.count ?? 0) + qty,
      inventoryOnHand,
    }
  })
}
export function repriceFromHistory(
  list: DrinkSim[],
  params: PricingParams = {},
  tNow = now()
): DrinkSim[] {
  const conf = { ...DEFAULT_PARAMS, ...params }

  return list.map((p) => {
    const originalPrice = p.original_price
    const { price, D, I, F } = nextPriceFor(p, conf, tNow)
    const status = statusFromChange(originalPrice, price)
    const lastChangeTs = status === 'stable' ? p.lastPriceTs : tNow
    const minutesAgo = Math.max(0, Math.floor((tNow - lastChangeTs) / 60000))
    const timestamp = relativePtBR(minutesAgo)

    console.log({ originalPrice, nextPrice: price, product: p })
    return {
      ...p,
      current_price: price,
      status,
      lastPriceTs: lastChangeTs,
      lastPriceApplied: price,
      timestamp,
      metrics: { D, I, F },
    }
  })
}

export function sortByPriceDesc(list: DrinkSim[]): DrinkSim[] {
  return [...list].sort((a, b) => b.current_price - a.current_price)
}
