import cors from 'cors'
import express from 'express'
import { handleListProducts } from './controllers/products-controller.js'
import { initDB } from './database.js'
import { logRequest } from './middlewares/logger-middleware.js'

const run = async () => {
  const app = express()
  const port = 4001

  app.use(cors())
  app.use(express.json())
  app.use(logRequest)

  const db = await initDB()

  // Products
  app.get('/products', handleListProducts(db))

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

run()
