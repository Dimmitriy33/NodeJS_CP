import config from 'config';
import express from 'express';
import deserializeUser from './middleware/deserializeUser';
import routes from './routes';
import connectDb from './utils/connect';
import Logger from './utils/logger';

const port = config.get<number>('port');
const app = express();

app.use(express.json());
app.use(deserializeUser);

app.listen(port, async () => {
  Logger.info(`App is running at http://localhost:${port}`);

  // Connect to mongoDB
  await connectDb();

  // Configure routes
  routes(app);
});
