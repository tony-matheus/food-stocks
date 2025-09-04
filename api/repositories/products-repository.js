export const createProduct = async (db, { id, name, price, timestamp }) => {
  await db.run(
    'INSERT INTO products (id, name, price, timestamp) VALUES (?, ?, ?, ?, ?)',
    [id, name, price, timestamp]
  )
}

export const getProductById = async (db, id) => {
  const row = await db.get(
    `
    SELECT products.*
    FROM products
    WHERE products.id = ?
    `,
    [id]
  )

  if (!row) {
    return
  }

  return mapFromDatabase(row)
}

export const listProducts = async (db, { panelId, sort }) => {
  const conditions = []
  const params = []
  let orderByClause = ''

  // if (panelId) {
  //   conditions.push('products.panelId = ?')
  //   params.push(panelId)
  // }

  if (sort) {
    if (['price_asc', 'price_desc'].includes(sort)) {
      const direction = sort === 'timestamp_asc' ? 'ASC' : 'DESC'
      orderByClause = `ORDER BY products.price ${direction}`
    }
  }

  const query = `
    SELECT
      products.*
    FROM products
    ${conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''}
    GROUP BY products.id
    ${orderByClause}
  `

  const rows = await db.all(query, params)
  return rows.map(mapFromDatabase)
}

export const updateProduct = async (
  db,
  { id, name, price, timestamp, panelId }
) => {
  const result = await db.run(
    'UPDATE products SET name = ?, price = ?, timestamp = ?, panelId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [name, price, timestamp, panelId, id]
  )

  return result.changes > 0
}

export const deleteProductById = async (db, id) => {
  const result = await db.run('DELETE FROM products WHERE id = ?', [id])
  return result.changes > 0
}

const mapFromDatabase = (row) => {
  return {
    ...row,
    images: row.images
      ? row.images.split(',').map((filename) => `/images/${filename}`)
      : [],
  }
}
