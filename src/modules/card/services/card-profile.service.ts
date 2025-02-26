import { customAlphabet } from 'nanoid';
// import {sequelize} from '../../../core/database'
import { CardProfile, CardStatus, Currency } from '../card-profile/model/card-profile.model';
import { CardType } from '../card-profile/model/card-profile.model';
import { CreationAttributes, Op } from 'sequelize';
import sequelize from 'sequelize/types/sequelize';


export const createCardProfile = async (user_id: string, validatedCardData: CreationAttributes<CardProfile>) => {
  try {
    if (!validatedCardData.user_id || !validatedCardData.card_type || !validatedCardData.card_holder_name) {
      return {
        statusCode: 400,
        status: 'error',
        message: 'User ID, card type, and card holder name are required',
        data: null,
      };
    }

    const nanoid = customAlphabet('0123456789');
    const cardNumber = nanoid(16);
    const cvv2 = nanoid(3);

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 4); // 4 years from now

    const cardProfileCreationData = {
      user_id: user_id || validatedCardData.user_id,
      card_type: validatedCardData.card_type,
      card_holder_name: validatedCardData.card_holder_name,
      card_number: cardNumber,
      expiry_date: expiryDate,
      cvv: cvv2,
      pin: validatedCardData.pin || '0000',
      status: CardStatus.PENDING,
      balance: validatedCardData.balance || 0.00,
      currency: validatedCardData.currency || 'NGN',
    };

    const existingCard = await CardProfile.findOne({
      where: {
        user_id: user_id,
        card_type: validatedCardData.card_type,
        expiry_date: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });

    if (existingCard) {
      return {
        statusCode: 400,
        status: 'error',
        message: 'You already have an active card of this type',
        data: null,
      };
    }

  
  
    const cardProfile = CardProfile.build(cardProfileCreationData);
    await cardProfile.save();
    
    
    const { pin, ...safeCardData } = cardProfile.get({ plain: true });

    return {
      statusCode: 201,
      status: 'success',
      message: 'Card profile created',
      data: safeCardData,
    };
  } catch (error) {
    console.error('Error creating card profile:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: error || 'Failed to create card profile',
      data: null,
    };
  }
};

export const getCardProfileById = async (id: string) => {
  try {
    const cardProfile = await CardProfile.findOne({ where: {id},
      attributes: {
        exclude: [ 'pin' ]
      }
    } );

    if (!cardProfile) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Card profile not found',
        data: null
      };
    }

    return {
      statusCode: 200,
      status: 'success',
      message: 'Card profile retrieved',
      data: cardProfile
    };
  } catch (error) {
    console.error('Error retrieving card profile:', error);
    throw error;
  }
};
export const getCardProfiles = async (limit: number, page: number) => {
  try {
    // let {limit, page} = ;
    // limit = limit ? parseInt(limit) : 10;
    // page = page ? parseInt(page) : 1;
    // const offset = (page - 1) * limit;
    const cardProfiles = await CardProfile.findAll({
      attributes:{ 
        exclude: ['pin'],
        include: ['currency']
      }
    });
    // const { pin: _, ...cardProfileData } = cardProfiles;
    
    if (!cardProfiles || cardProfiles.length < 1) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Card profile not found',
        data: null
      };
    }

    return {
      statusCode: 200,
      status: 'success',
      message: 'Card profiles retrieved',
      data: cardProfiles
    };
  } catch (error) {
    console.error('Error retrieving card profiles:', error);
    throw error;
  }
};

export const deleteCardProfile = async (id: string) => {
  try {
    const deleteCard = await CardProfile.destroy({
      where: { id }
    });

    if (deleteCard === 0) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Card profile not found',
        data: null
      };
    }

    return {
      statusCode: 200,
      status: 'success',
      message: 'Card profile deleted',
      data: deleteCard
    };
  } catch (error) {
    console.error('Error deleting card profile:', error);
    throw error;
  }
}

export const updateCardProfile = async (id: string, data: any) => {
  try {
    const [updated] = await CardProfile.update(data, {
      where: { id: id },
    });

    if (updated === 0) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Card profile not found',
        data: null
      };
    }
    const { pin: _, ...cardUpdateData } = data;

    return {
      statusCode: 200,
      status: 'success',
      message: 'Card profile updated',
      data: cardUpdateData
    };
  } catch (error) {
    console.error('Error updating card profile:', error);
    throw error;
  }
};
