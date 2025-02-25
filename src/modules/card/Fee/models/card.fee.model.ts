import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey, 
  BelongsTo 
} from 'sequelize-typescript';
import { CardProfile } from '../../card-profile/model/card-profile.model';

export enum CardType {
  VIRTUAL = 'VIRTUAL',
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP'
}
export enum FeeType {
  ISSUANCE = 'ISSUANCE',
  MAINTENANCE = 'MAINTENANCE',
  REPLACEMENT = 'REPLACEMENT',
  TRANSACTION = 'TRANSACTION',
  OTHER = 'OTHER'
}

export enum FrequencyType {
  ONE_TIME = 'ONE_TIME',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  BIANNUALLY = 'BIANNUALLY'
}

@Table({
  tableName: 'card_fees',
  timestamps: true,
})
export class CardFee extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id?: string;

  @ForeignKey(() => CardProfile)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  card_profile_id?: string;

  @Column({
    type: DataType.ENUM(...Object.values(CardType)),
    allowNull: false
  })
  card_type?: CardType;

  @Column({
    type: DataType.ENUM(...Object.values(FeeType)),
    allowNull: false
  })
  fee_type?: FeeType;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  amount?: number;

  @Column({
    type: DataType.ENUM(...Object.values(FrequencyType)),
    allowNull: false
  })
  frequency?: FrequencyType;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  is_paid?: boolean;
  
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  is_active?: boolean;

  @Column({
    type: DataType.DATE
  })
  due_date?: Date;

  @Column({
    type: DataType.STRING,
    defaultValue: 'NGN'
  })
  currency?: Currency;

  @BelongsTo(() => CardProfile)
  card_profile?: CardProfile;
}
