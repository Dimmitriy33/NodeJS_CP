import 'dotenv/config';

export default {
    port: process.env.PORT,
    dbUri: process.env.MONGO_URL,
    env: process.env.NODE_ENV, // prod or dev
    saltWorkFactor: 10, // how many rounds should you salt the password
};