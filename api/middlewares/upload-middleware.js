import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v7 as uuidv7 } from 'uuid'

export const uploadDirPath = path.join(import.meta.dirname, '../', 'uploads')

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync(uploadDirPath)) {
      fs.mkdirSync(uploadDirPath)
    }
    cb(null, uploadDirPath)
  },
  filename: (_, file, cb) => {
    const uniqueName = `${uuidv7()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

export const upload = multer({ storage })
