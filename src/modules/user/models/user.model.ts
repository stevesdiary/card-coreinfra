import { Table, Column, Model, DataType, IsUUID, PrimaryKey, Unique, Default } from 'sequelize-typescript';

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
  username?: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @Default('user')
  @Column(DataType.STRING)
  role!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  verified!: boolean;
}

export interface IUserRegistration {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: string;
  verified?: boolean;
}
