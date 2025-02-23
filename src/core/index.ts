import express from 'express';

import sequelize from './database';
import router from '../router';
const server = express();
const port = process.env.LOCAL_PORT || 3000;

server.use(express.json());

server.get("/home", (req, res) => {
  res.json({ message: "Hello, World! of tech." });
});

server.use('/api/v1', router);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default startServer;
