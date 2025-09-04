import { logger } from '../logger.js'
import { deleteFiles } from '../utils/file-utils.js'

export const cleanUploadedFilesOnFailure = (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : [])
  if (!files.length) {
    next()
    return
  }

  const originalEnd = res.end

  res.end = async (...args) => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      try {
        const filePaths = files.map((file) => file.path)
        await deleteFiles(filePaths)
        logger.info('Deleted uploaded files due to non-2XX response')
      } catch (err) {
        logger.error('Error deleting files:', err)
      }
    }

    originalEnd.apply(res, args)
  }

  next()
}
