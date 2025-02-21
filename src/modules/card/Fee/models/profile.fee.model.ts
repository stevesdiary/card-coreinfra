import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey, 
  BelongsTo 
} from 'sequelize-typescript';
import { CardProfile } from '../../profile/card-profile.model';

export enum FeeType {
  ISSUANCE = 'ISSUANCE',
  ANNUAL = 'ANNUAL',
  REPLACEMENT = 'REPLACEMENT',
  TRANSACTION = 'TRANSACTION'
}

@Table({
  tableName: 'card_profile_fees',
  timestamps: true
})
export class CardProfileFee extends Model {
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
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  is_paid?: boolean;

  @Column({
    type: DataType.DATE
  })
  due_date?: Date;

  @BelongsTo(() => CardProfile)
  card_profile?: CardProfile;
}
