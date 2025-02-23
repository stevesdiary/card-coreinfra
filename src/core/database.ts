import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize-typescript';
import { User } from '../modules/user/models/user.model';
import { CardProfile } from '../modules/card/profile/card-profile.model';
import { CardFee } from '../modules/card/Fee/models/card.fee.model';
import { CardRequest } from '../modules/card/Request/models/card-request.model';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'your_database',
  logging: true,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false, // More secure for production
  //     // ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
  //   }
  // },

  models: [User, CardProfile, CardFee, CardRequest],
});

export default sequelize;
