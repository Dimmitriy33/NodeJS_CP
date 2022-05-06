import 'dotenv/config';

export default {
  port: process.env.PORT, // if use .env
  dbUri: '', // mongo Uri
  env: 'development', // production or development
  saltWorkFactor: 10, // how many rounds should you salt the password
  accessTokenTtl: '1m',
  refreshTokenTtl: '1y',
  publicJWTKey: `-----BEGIN RSA PUBLIC KEY-----
    Your public key
-----END RSA PUBLIC KEY-----
`,
  privateJWTKey: `-----BEGIN RSA PRIVATE KEY-----
    Your private key
-----END RSA PRIVATE KEY-----
`,
  cldName: 'yourCldName',
  cldApiKey: 'apiKey',
  cldApiSecret: 'apiSecret',
  cldFolder: 'yourFolderName'
};
