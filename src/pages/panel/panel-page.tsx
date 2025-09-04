import { Button } from '@design-system/components/ui/button'
import { Link } from 'react-router-dom'

export default function PanelPage() {
  return (
    <div className='flex h-[100vh] w-full items-center justify-center bg-amber-200 p-4'>
      <Link to='/panel/1'>
        <Button onClick={(e) => e.preventDefault}>Crie Painel</Button>
      </Link>
    </div>
  )
}
