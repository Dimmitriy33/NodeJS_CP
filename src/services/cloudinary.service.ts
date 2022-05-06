import config from 'config';
import { Cloudinary } from '../utils/cloudinaryConfig';

export class CloudinaryApi {
  private static cldFolder = config.get<string>('cldFolder');

  static async uploadImg(imgBase64: string): Promise<string> {
    const res = await Cloudinary.uploader.upload(imgBase64, {
      upload_preset: CloudinaryApi.cldFolder,
      use_filename: true,
      phash: true,
      unique_filename: true,
      overwrite: true
    });
    return res;
  }

  static async uploadMultImgs(imgsToUpload: string[]) {
    const urls: string[] = [];

    for (const img of imgsToUpload) {
      const res = await CloudinaryApi.uploadImg(img);
      res && urls.push(res);
    }

    return urls;
  }
}
