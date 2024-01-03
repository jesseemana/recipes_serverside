import { UploadResponse } from '../../types'
import cloudinary from './cloudinary'

const uploadPicture = async (picture: string): Promise<UploadResponse> => {
  const response = await cloudinary.uploader.upload(picture)
  return {
    picture_path: response.url,
    cloudinary_id: response.public_id,
  }
}

export default uploadPicture
