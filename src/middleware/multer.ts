import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import { Request, } from 'express'

const upload = multer({
  storage: multer.diskStorage({
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      let ext = path.extname(file.originalname)
      cb(null, 'IMG' + Date.now() + ext)
    }
  }),

  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    let ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported'))
      return 
    }
    cb(null, true)
  }
})  

export default upload
