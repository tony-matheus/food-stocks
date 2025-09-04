import { listProducts } from '../repositories/products-repository.js'

export const handleListProducts = (db) => async (req, res) => {
  const { panelId, sort } = req.query

  try {
    const products = await listProducts(db, { panelId, sort })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
