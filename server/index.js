import * as dotenv from 'dotenv';
import express from 'express';
import sequelize from './config/database.js';
import cors from 'cors';
import path from 'path';
import { router } from './routes/index.js';
import { fileURLToPath } from 'url';
import errorMiddleware from './middleware/ErrorHandlingMiddleware.js';
import Offer from './models/offer.js';
import Review from './models/review.js';
import User from './models/user.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5050;

const app = express();
const loadedModels = [User, Offer, Review];

app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.resolve(__dirname, 'static')));
app.use('/', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log('Database connection has been established successfully.');
    console.log(`Loaded models: ${loadedModels.map((model) => model.name).join(', ')}`);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

start();
