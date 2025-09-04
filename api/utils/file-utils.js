import fs from 'fs/promises'

export const deleteFiles = async (filePaths) => {
  await Promise.all(
    filePaths.map(async (filePath) => {
      try {
        await fs.access(filePath)
        await fs.unlink(filePath)
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err)
      }
    })
  )
}
