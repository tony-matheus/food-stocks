import { Button } from '@design-system/components/ui/button'
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  Bars2Icon,
  PlusIcon,
} from '@heroicons/react/24/solid'
import { useTimer } from '@hooks/use-timer'
import { cn, formatSecondsToTime } from '@lib/utils'
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

interface Drink {
  id: string
  name: string
  stock_name: string
  original_price: number
  count: number
  current_price: number
  timestamp: string
  status: 'rising' | 'falling' | 'stable'
}

const drinks: Drink[] = [
  {
    id: 'Mojito',
    name: 'Mojito',
    stock_name: 'MOJO',
    original_price: 22.5,
    count: 0,
    current_price: 23.54,
    timestamp: '14 minutos atrás',
    status: 'rising',
  },
  {
    id: 'Caipirinha',
    name: 'Caipirinha',
    stock_name: 'CAIP',
    original_price: 24.0,
    count: 0,
    current_price: 26.8,
    timestamp: '23 minutos atrás',
    status: 'rising',
  },
  {
    id: 'Half Pint',
    name: 'Half Pint',
    stock_name: 'HALF',
    original_price: 26.5,
    count: 0,
    current_price: 25.0,
    timestamp: '31 minutos atrás',
    status: 'falling',
  },
  {
    id: 'Brahma',
    name: 'Brahma',
    stock_name: 'BRHM',
    original_price: 24.8,
    count: 0,
    current_price: 25.0,
    timestamp: '45 minutos atrás',
    status: 'stable',
  },
  {
    id: 'Amstel',
    name: 'Amstel',
    stock_name: 'AMST',
    original_price: 25.5,
    count: 0,
    current_price: 25.0,
    timestamp: '67 minutos atrás',
    status: 'falling',
  },
  {
    id: 'Stella Artois',
    name: 'Stella Artois',
    stock_name: 'STLA',
    original_price: 26.0,
    count: 0,
    current_price: 25.0,
    timestamp: '78 minutos atrás',
    status: 'falling',
  },
  {
    id: 'Heineken',
    name: 'Heineken',
    stock_name: 'HEIN',
    original_price: 28.5,
    count: 0,
    current_price: 30.2,
    timestamp: '82 minutos atrás',
    status: 'rising',
  },
  {
    id: 'Corona',
    name: 'Corona',
    stock_name: 'CORO',
    original_price: 29.0,
    count: 0,
    current_price: 31.8,
    timestamp: '89 minutos atrás',
    status: 'rising',
  },
  {
    id: 'Budweiser',
    name: 'Budweiser',
    stock_name: 'BUDW',
    original_price: 23.8,
    count: 0,
    current_price: 22.5,
    timestamp: '90 minutos atrás',
    status: 'falling',
  },
]

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

const sortProducts = (products: Drink[], sortOrder: 'asc' | 'desc') => {
  return products.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.current_price - b.current_price
    }
    return b.current_price - a.current_price
  })
}

const MotionTableBody = motion(TableBody)
const MotionTableRow = motion(TableRow)

export default function PanelShowPage() {
  const [products, setProducts] = useState<Drink[]>(
    sortProducts(drinks, 'desc')
  )

  const updateProductsPrices = (time?: number) => {
    console.log('updateProductsPrices', time)
    const newProducts = [...products]
    newProducts.forEach((product) => {
      product.current_price = Math.random() * 100
    })
    setProducts(sortProducts(newProducts, 'desc'))
  }

  const { timeToTrigger } = useTimer({
    triggerEvery: 60000,
    paused: false,
    onTrigger: updateProductsPrices,
  })

  const handleIncrement = (index: number) => {
    console.log('increment', index)
    const newProducts = [...products]
    newProducts[index].count++

    setProducts(sortProducts(newProducts, 'desc'))
  }

  return (
    <div className='flex h-[100vh] w-full flex-col gap-4 bg-background p-8'>
      <div className='text-2xl'>
        Próxima atualização: {formatSecondsToTime(timeToTrigger)}
      </div>
      <div className='flex w-full flex-col gap-4'>
        <Table>
          <TableHeader>
            <TableRow className='border-primary-foreground bg-blue-100'>
              <TableHead className='w-6/12 bg-red-100'>Produto</TableHead>
              <TableHead className='w-2/12 bg-red-100'>Time</TableHead>
              <TableHead className='w-2/12 bg-red-100'>Price</TableHead>
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
              {products.map((product, index) => {
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
                    <TableCell className='w-1/2 font-medium'>
                      <p className='text-xl'>{product.name}</p>
                      <p className='text-sm'>{product.stock_name}</p>
                    </TableCell>

                    <TableCell className='w-3/12'>
                      {product.timestamp}
                    </TableCell>
                    <TableCell
                      className={cn(
                        STYLES_BY_STATUS[product.status].text,
                        'w-1/6'
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
                    </TableCell>
                    <TableCell className='w-1/24'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleIncrement(index)}
                        className='mr-2'
                      >
                        <PlusIcon className='size-4' />
                      </Button>
                      {product.count ?? 0}
                    </TableCell>
                  </MotionTableRow>
                )
              })}
            </AnimatePresence>
          </MotionTableBody>
        </Table>
      </div>
    </div>
  )
}
