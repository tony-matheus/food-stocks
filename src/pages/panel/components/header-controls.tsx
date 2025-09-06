import { Button } from '@design-system/components/ui/button'
import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import { useTimer } from '@hooks/use-timer'
import { formatSecondsToTime } from '@lib/daytime'
import { repriceFromHistory, sortByPriceDesc } from '@lib/pricing-rules'
import { useState } from 'react'
import { usePanelContext } from '../context/panel-context'

export default function HeaderControls() {
  const [, { setProducts }] = usePanelContext()
  const [paused, setPaused] = useState(true)

  const updateProductsPrices = () => {
    setProducts((prev) => sortByPriceDesc(repriceFromHistory(prev)))
  }

  const { timeToTrigger } = useTimer({
    triggerEvery: 10000,
    paused,
    onTrigger: updateProductsPrices,
  })

  return (
    <div className='flex items-center justify-between gap-2'>
      <div className='text-2xl'>
        Próxima atualização: {formatSecondsToTime(timeToTrigger)}
      </div>

      <Button
        variant='ghost'
        size='icon'
        onClick={() => setPaused((prev) => !prev)}
      >
        {paused ? (
          <PlayCircleIcon className='size-8' />
        ) : (
          <PauseCircleIcon className='size-8' />
        )}
      </Button>
    </div>
  )
}
