import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  PrimaryKey,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { User } from '../../../user/models/user.model';

export enum CardStatus {
  PENDING = 'PENDING',
  APPROVED ='APPROVED',
  REJECTED = 'REJECTED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  DISPATCHED = 'DISPATCHED'
}

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  GBP = 'GBP'
}

export enum CardType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  VIRTUAL = 'VIRTUAL'
}

@Table({
  tableName: 'card_profiles',
  timestamps: true
})
export class CardProfile extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  id?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  user_id?: string;

  @Column({
    type: DataType.ENUM('DEBIT', 'CREDIT', 'VIRTUAL'),
    allowNull: false
  })
  card_type?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  card_holder_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  card_number?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  expiry_date?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  cvv?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  pin?: string;

  @Column({
    type: DataType.ENUM('PENDING', 'ACTIVE', 'BLOCKED'),
    defaultValue: 'PENDING'
  })
  status?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0
  })
  balance?: number;

  @Column({
    type: DataType.STRING,
    defaultValue: 'NGN'
  })
  currency?: string;

  @BelongsTo(() => User)
  user?: User;
}

