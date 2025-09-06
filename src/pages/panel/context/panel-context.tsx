import { sortByPriceDesc } from '@lib/pricing-rules'
import { createContext, useContext, useState } from 'react'
import { drinks } from '../../../data'
import { DrinkSim } from '../../../types'

interface PanelStateContextType {
  products: DrinkSim[]
}

interface PanelContextProviderType {
  setProducts: React.Dispatch<React.SetStateAction<DrinkSim[]>>
}

const PanelStateContext = createContext<PanelStateContextType>({
  products: [],
})
const PanelActionContext = createContext<PanelContextProviderType>({
  setProducts: () => {},
})

const usePanelContext = (): [
  PanelStateContextType,
  PanelContextProviderType,
] => {
  const state = useContext(PanelStateContext)
  const actions = useContext(PanelActionContext)

  if (!state || !actions) {
    throw new Error(
      'usePanelContext must be used within a PanelContextProvider'
    )
  }
  return [state, actions]
}

const PanelProvider = ({ children }: { children: React.ReactNode }) => {
  console.log(drinks)
  const [products, setProducts] = useState<DrinkSim[]>(
    sortByPriceDesc(drinks.slice(0, 4))
  )

  return (
    <PanelStateContext.Provider value={{ products }}>
      <PanelActionContext.Provider value={{ setProducts }}>
        {children}
      </PanelActionContext.Provider>
    </PanelStateContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { PanelProvider, usePanelContext }
