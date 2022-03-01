import config from "config";
import mongoose from "mongoose";
import Logger from "./logger";

export default async function connectDb() {
    const dbUri = config.get<string>("dbUri");

    try {
        await mongoose.connect(dbUri);
        Logger.info(`App connected to mongoDB`);
    } catch(err) {
        Logger.error(`Could not connect to mongoDB! ${err}`);
        process.exit(1);
    }
}