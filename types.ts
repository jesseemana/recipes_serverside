export type HttpCode = 400 | 401 | 403 | 404 | 409 | 500

export type Database = {
  connect: () => void
  disconnect: () => void
}

export type CloudinaryResponse = {
  picture_path: string
  cloudinary_id: string
}
