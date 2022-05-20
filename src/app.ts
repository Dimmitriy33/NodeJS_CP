import config from 'config';
import express from 'express';
import cors from 'cors';
import deserializeUser from './middleware/deserializeUser';
import resMappper from './middleware/resMapper';
import routes from './routes';
import connectDb from './utils/connect';
import Logger from './utils/logger';

const port = config.get<number>('port');
const app = express();

app.use(cors());
app.use(express.json());
app.use(deserializeUser);
app.use(resMappper);

app.listen(port, async () => {
  Logger.info(`App is running at http://localhost:${port}`);

  // Connect to mongoDB
  await connectDb();

  // Configure routes
  routes(app);
});
