import { useNavigate } from 'react-router-dom'
import { NotFoundPageView } from './not-found-page-view'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoHomeClick = () => navigate('/')

  return <NotFoundPageView onGoHomeClick={handleGoHomeClick} />
}

export default NotFoundPage
