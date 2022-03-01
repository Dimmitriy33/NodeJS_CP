import 'dotenv/config';

export default {
    port: process.env.PORT,
    dbUri: process.env.MONGO_URL,
    env: process.env.NODE_ENV // prod or dev
};