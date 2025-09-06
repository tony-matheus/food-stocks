import { Button } from '@design-system/components/ui/button'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@design-system/components/ui/chart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@design-system/components/ui/dialog'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { DrinkSim } from '../../../../types'

const chartConfig = {
  desktop: {
    label: 'History',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export default function HistoryDialog({
  history,
  open,
  onOpenChange,
}: {
  history: DrinkSim['history']
  open: boolean
  onOpenChange: (value: boolean) => void
}) {
  // Format the history data for the chart
  const chartData = history
    .filter((entry) => entry.price !== null && entry.price !== undefined)
    .map((entry) => ({
      ts: new Date(entry.ts).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      price: entry.price!,
      timestamp: entry.ts,
    }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Price History</DialogTitle>
          <DialogDescription>Historical price data over time</DialogDescription>
        </DialogHeader>
        <div className='h-96 w-full'>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={[{ ts: chartData[0].ts, price: 0 }, ...chartData]}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='ts'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                  interval='preserveStartEnd'
                />
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className='rounded-lg border bg-background p-2 shadow-md'>
                          <p className='text-sm font-medium'>Time: {label}</p>
                          <p className='text-sm'>
                            Price: ${data.price.toFixed(2)}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  dataKey='price'
                  type='natural'
                  stroke='var(--color-desktop)'
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    stroke: 'var(--color-desktop)',
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className='flex h-full items-center justify-center text-muted-foreground'>
              <p>No price history data available</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
