import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey, 
  BelongsTo 
} from 'sequelize-typescript';
import { User } from '../../../user/models/user.model'; // Adjust import path as needed
import { CardType } from '../../profile/card-profile.model'; // Adjust import path as needed

export enum CardRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING'
}

@Table({
  tableName: 'card_requests',
  timestamps: true
})
export class CardRequest extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  user_id?: string;

  @Column({
    type: DataType.ENUM(...Object.values(CardType)),
    allowNull: false
  })
  requested_card_type?: CardType;

  @Column({
    type: DataType.ENUM(...Object.values(CardRequestStatus)),
    allowNull: false,
    defaultValue: CardRequestStatus.PENDING
  })
  status?: CardRequestStatus;

  @Column({
    type: DataType.TEXT
  })
  additional_notes?: string;

  @BelongsTo(() => User)
  user?: User;
}
