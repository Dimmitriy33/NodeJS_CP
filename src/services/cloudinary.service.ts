import config from 'config';
import { Cloudinary } from '../utils/cloudinaryConfig';
export class CloudinaryApi {
  private static cldFolder = config.get<string>('cldFolder');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async upload(file: any): Promise<IUploadFileRes> {
    const res = await Cloudinary.uploader.upload(
      file,
      {
        folder: CloudinaryApi.cldFolder,
        // upload_preset: CloudinaryApi.cldFolder,
        use_filename: true,
        phash: true,
        unique_filename: true,
        overwrite: true
      },
      (err, result) => {
        if (err) {
          throw err;
        }

        return result;
      }
    );

    return {
      url: res.url,
      publicId: res.public_id
    };
  }

  // static async uploadImg(imgBase64: string): Promise<string> {
  //   const res = await Cloudinary.uploader.upload(imgBase64, {
  //     upload_preset: CloudinaryApi.cldFolder,
  //     use_filename: true,
  //     phash: true,
  //     unique_filename: true,
  //     overwrite: true
  //   });

  //   return res;
  // }

  // static async uploadMultImgs(imgsToUpload: string[]) {
  //   const urls: string[] = [];

  //   for (const img of imgsToUpload) {
  //     const res = await CloudinaryApi.uploadImg(img);
  //     res && urls.push(res);
  //   }

  //   return urls;
  // }
}

export interface IUploadFileRes {
  publicId: string;
  url: string;
}
