import { Table, Column, Model, DataType, IsUUID, PrimaryKey, Unique, Default, HasOne } from 'sequelize-typescript';
import { CardProfile } from '../../card/profile/card-profile.model';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
@Table({
  tableName: 'users',
  timestamps: true
})
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  email!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  username!: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false
  })
  role!: UserRole;

  @Default(false)
  @Column(DataType.BOOLEAN)
  verified!: boolean;

  @HasOne(() => CardProfile)
  card_profile!: CardProfile;
}

export interface IUserRegistration {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: string;
  verified?: boolean;
}
