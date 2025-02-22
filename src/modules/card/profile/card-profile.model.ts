import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey, 
  BelongsTo,
  BeforeCreate,
  BeforeUpdate,
  Validate
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { User } from '../../user/models/user.model';
import { CardPinEncryptionService } from '../services/card-encryption.service';

export enum CardType {
  VIRTUAL = 'VIRTUAL',
  PHYSICAL = 'PHYSICAL',
  PREPAID = 'PREPAID'
}

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP'
}

export enum Branch_Blacklist {
  HEAD_OFFICE = 'Head Office',
  BRANCH_OFFICE = 'Branch Office'
}
export enum CardStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING'
}

@Table({
  tableName: 'card_profiles',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'card_type', 'status', 'expiry_date']
    }
  ]
})
export class CardProfile extends Model {
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
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  card_number?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  card_holder_name?: string;

  @Column({
    type: DataType.ENUM(...Object.values(CardType)),
    allowNull: false,
    defaultValue: CardType.VIRTUAL
  })
  card_type?: CardType;

  @Column({
    type: DataType.ENUM(...Object.values(CardStatus)),
    allowNull: false,
    defaultValue: CardStatus.PENDING
  })
  status?: CardStatus;

  @Column({
    type: DataType.DATE
  })
  expiry_date?: Date;

  @Column({
    type: DataType.STRING
  })
  cvv?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: '0000',
    validate: {
      is: {
        args: /^\d{4}$/,
        msg: "PIN must be exactly 4 digits long"
      },
      len: {
        args: [4, 4],
        msg: "PIN must be 4 characters long"
      }
    }
  })
  pin?: string;
  
  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0.00
  })
  balance?: number;

  @BeforeCreate
  @BeforeUpdate
  static encryptPin(instance: CardProfile) {
    if (instance.pin) {
      instance.pin = CardPinEncryptionService.encrypt(instance.pin);
    }
  }

  verifyPin(inputPin: string): boolean {
    if (!this.pin) {
      return false;
    }
    const decryptedPin = CardPinEncryptionService.decrypt(this.pin);
    return inputPin === decryptedPin;
  }
  @BelongsTo(() => User)
  user?: User;
}

@Table({
  tableName: 'cards'
})
export class CardModel extends Model {
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
    type: DataType.STRING,
    allowNull: false
  })
  card_number?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  card_holder_name?: string;

  @Column({
    type: DataType.ENUM(...Object.values(CardType)),
    allowNull: false,
    defaultValue: CardType.VIRTUAL
  })
  card_type?: CardType;

  @Column({
    type: DataType.ENUM(...Object.values(CardStatus)),
    allowNull: false,
    defaultValue: CardStatus.PENDING
  })
  status?: CardStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  expiry_date?: Date;

  @Column({
    type: DataType.STRING
  })
  cvv?: string;

  @Column({
    type: DataType.ENUM(...Object.values(Currency)),
    allowNull: false,
    defaultValue: Currency.NGN
  })
  currency?: Currency;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0.00
  })
  balance?: number;

  @Column({
    type: DataType.ENUM(...Object.values(Branch_Blacklist)),
    defaultValue: Branch_Blacklist.HEAD_OFFICE
  })
  branch_lacklist?: string;

  @BelongsTo(() => CardProfile)
  card_profile?: CardProfile;

  @BeforeCreate
  @BeforeUpdate
  static async validateUniqueActiveCard(instance: CardProfile) {
    const existingCard = await CardProfile.findOne({
      where: {
        user_id: instance.user_id,
        card_type: instance.card_type,
        status: CardStatus.ACTIVE,
        expiry_date: {
          [Op.gt]: new Date()
        }
      }
    });

    if (existingCard) {
      throw new Error('You already have an active card of this type');
    }
  }
}

