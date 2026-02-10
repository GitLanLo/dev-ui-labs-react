import cors from 'cors';
import express from 'express';
import sequelize from './config/database.js';
import Offer from './models/offer.js';
import Review from './models/review.js';
import User from './models/user.js';
import router from './routes/index.js';

const app = express();
const port = Number(process.env.PORT ?? 5000);
const loadedModels = [User, Offer, Review];

app.use(cors());
app.use(express.json());

app.use('/', router);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log('Database connection has been established successfully.');
    console.log(`Loaded models: ${loadedModels.map((model) => model.name).join(', ')}`);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

start();
