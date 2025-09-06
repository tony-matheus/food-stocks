import { Button } from '@design-system/components/ui/button'
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  Bars2Icon,
  PlusIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline'
import { recordSale, sortByPriceDesc } from '@lib/pricing-rules'
import { cn } from '@lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../design-system/components/ui/table'
import { DrinkSim } from '../../types'
import HistoryDialog from './components/dialogs/history-dialog'
import HeaderControls from './components/header-controls'
import { usePanelContext } from './context/panel-context'

const STYLES_BY_STATUS = {
  rising: {
    text: 'text-green-500',
    icon: ArrowTrendingUpIcon,
  },
  falling: {
    text: 'text-red-500',
    icon: ArrowTrendingDownIcon,
  },
  stable: {
    text: 'text-black',
    icon: Bars2Icon,
  },
}

const MotionTableBody = motion.create(TableBody)
const MotionTableRow = motion.create(TableRow)

export default function PanelShowPage() {
  const [{ products }, { setProducts }] = usePanelContext()

  const [selectedHistory, setSelectedHistory] = useState<
    DrinkSim['history'] | null
  >(null)

  // Record a sale for a given product id (adds to history and decrements inventory)
  const handleRecordSale = (product: DrinkSim) => {
    setProducts((prev) =>
      sortByPriceDesc(
        recordSale({
          list: prev,
          id: product.id,
          qty: 1,
          price: product.current_price,
        })
      )
    )
  }

  return (
    <>
      <div className='flex h-[100vh] w-full flex-col gap-4 bg-background p-8'>
        <HeaderControls />
        <div className='flex w-full flex-col gap-4'>
          <Table>
            <TableHeader>
              <TableRow className='border-primary-foreground bg-blue-100'>
                <TableHead className='w-7/12 bg-red-100'>Produto</TableHead>
                <TableHead className='w-3/12 bg-red-100'>Price</TableHead>
                <TableHead className='w-2/12 bg-red-100' />
              </TableRow>
            </TableHeader>

            <MotionTableBody
              layout
              transition={{
                duration: 0.5,
                ease: 'easeInOut',
                staggerChildren: 0.05,
              }}
            >
              <AnimatePresence mode='popLayout'>
                {products.map((product) => {
                  const IconComponent = STYLES_BY_STATUS[product.status].icon
                  return (
                    <MotionTableRow
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.4,
                        ease: 'easeInOut',
                        layout: { duration: 0.3 },
                      }}
                      className='border-b border-gray-200'
                    >
                      <TableCell className='w-7/12 font-medium'>
                        <p className='text-xl'>{product.name}</p>
                        <p className='text-sm'>{product.stock_name}</p>
                      </TableCell>

                      <TableCell
                        className={cn(
                          'w-3/12',
                          STYLES_BY_STATUS[product.status].text
                        )}
                      >
                        <div className='flex items-center gap-2'>
                          ${product.current_price.toFixed(2)}
                          <IconComponent
                            className={cn(
                              STYLES_BY_STATUS[product.status].text,
                              'size-5'
                            )}
                          />
                        </div>
                        <p className='text-xs text-black'>
                          {product.original_price.toFixed(2)}
                        </p>
                      </TableCell>

                      <TableCell className='w-1/6'>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='icon'
                            onClick={() => setSelectedHistory(product.history)}
                            className='mr-2'
                          >
                            <PresentationChartLineIcon className='size-4' />
                          </Button>
                          <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleRecordSale(product)}
                            className='mr-2'
                          >
                            <PlusIcon className='size-4' />
                          </Button>
                          {product.count ?? 0}
                        </div>
                      </TableCell>
                    </MotionTableRow>
                  )
                })}
              </AnimatePresence>
            </MotionTableBody>
          </Table>
        </div>
      </div>
      <HistoryDialog
        open={!!selectedHistory}
        onOpenChange={(value) => {
          if (!value) {
            setSelectedHistory(null)
          }
        }}
        history={selectedHistory ?? []}
      />
    </>
  )
}
