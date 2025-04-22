import { Table, Column, Model, DataType, IsUUID, PrimaryKey, Unique, Default, HasOne, HasMany } from 'sequelize-typescript';
import { CardProfile } from '../../card/card-profile/model/card-profile.model';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true
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
  first_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  last_name!: string;

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
    allowNull: false,
    defaultValue: UserRole.USER
  })
  role!: UserRole;

  @Default(false)
  @Column(DataType.BOOLEAN)
  verified!: boolean;

  @HasMany(() => CardProfile)
  card_profiles?: CardProfile[];
}

export interface IUserRegistration {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  role?: string;
  verified?: boolean;
}
