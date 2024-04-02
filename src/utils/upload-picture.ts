import cloudinary from './cloudinary';

interface UploadResponse {
  picture_path: string
  cloudinary_id: string
}

export const uploadPicture = async (picture: string): Promise<UploadResponse> => {
  const response = await cloudinary.uploader.upload(picture);
  return {
    picture_path: response.url,
    cloudinary_id: response.public_id,
  }
}
