import cloudinary_js_config from 'cloudinary';
import config from 'config';

const cldName = config.get<string>('cldName');
const cldApiKey = config.get<string>('cldApiKey');
const cldApiSecret = config.get<string>('cldApiSecret');

export const Cloudinary = cloudinary_js_config.v2;

Cloudinary.config({
  cloud_name: cldName,
  api_key: cldApiKey,
  api_secret: cldApiSecret
});
