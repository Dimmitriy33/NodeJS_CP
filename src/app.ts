import express from "express";
import config from "config";
import Logger from "./utils/logger";
import connectDb from "./utils/connect";
import routes from "./routes";

const port = config.get<number>("port");
const app = express();

app.use(express.json());

app.listen(port, async () => {
    Logger.info(`App is running at http://localhost:${port}`);

    // Connect to mongoDB 
    await connectDb();

    // Configure routes
    routes(app);
});