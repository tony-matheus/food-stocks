import CubeIcon from '@heroicons/react/20/solid/CubeIcon'
import { cn } from '@lib/utils'

export interface LoadingView {
  animated?: boolean
  className?: string
}

export const LoadingView = ({ animated = false, className }: LoadingView) => {
  return (
    <div
      className={cn([
        'min-h-screen flex items-center justify-center',
        animated && 'animate-ping',
        className,
      ])}
    >
      <CubeIcon className='size-8' />
    </div>
  )
}

export default LoadingView
