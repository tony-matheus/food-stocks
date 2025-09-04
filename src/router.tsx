import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoadingView } from './design-system/components/loading-view'

const NotFoundPage = lazy(() => import('./pages/not-found/not-found-page'))
const PanelPage = lazy(() => import('./pages/panel/panel-page'))
const PanelShowPage = lazy(() => import('./pages/panel/panel-show-page'))

export const Router = () => {
  return (
    <Suspense fallback={<LoadingView animated />}>
      <Routes>
        <Route path='/' element={<PanelPage />} />
        <Route path='/panel/:panel_id' element={<PanelShowPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
