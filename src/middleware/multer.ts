import multer, { FileFilterCallback } from 'multer'
import path from 'path'

const upload = multer({
  storage: multer.diskStorage({
    filename: (_, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      let ext = path.extname(file.originalname)
      cb(null, `IMG${Date.now}${ext}`)
    }
  }),

  fileFilter: (_, file: Express.Multer.File, cb: FileFilterCallback) => {
    let ext = path.extname(file.originalname)
    if (
      ext !== '.jpg' && 
      ext !== '.png' && 
      ext !== '.jpeg'
    ) {
      cb(new Error('Choose a supported file type.'))
      return 
    }
    cb(null, true)
  }
})  

export default upload
