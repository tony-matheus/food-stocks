import { logger } from '../logger.js'

export const logRequest = (req, res, next) => {
  const startTime = Date.now()

  logger.info(`Incoming Request: ${req.method} ${req.url}`)

  res.on('finish', () => {
    const duration = Date.now() - startTime
    logger.info(
      `Response Sent: ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`
    )
  })

  next()
}
