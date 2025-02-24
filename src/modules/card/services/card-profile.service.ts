import { customAlphabet } from 'nanoid';

import { CardProfile, CardStatus } from '../profile/card-profile.model';
// import { validatedCardData } from '../../user/types/type';
import { Op } from 'sequelize';

export const createCardProfile = async (validatedCardData: any) => {
  try {
    if (!validatedCardData.user_id) {
      console.error('Missing user_id');
      return {
        statusCode: 400,
        status: 'error',
        message: 'User ID is required',
        data: null
      };
    }

    if (!validatedCardData.card_type) {
      console.error('Missing card_type');
      return {
        statusCode: 400,
        status: 'error',
        message: 'Card type is required',
        data: null
      };
    }

    const nanoid = customAlphabet('0123456789', 16);
    const cardNumber = nanoid();
    const cvv2 = nanoid(3); 
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getUTCDate() + 4);

    const cardProfileCreationData = {
      user_id: String(validatedCardData.user_id),
      card_type: String(validatedCardData.card_type),
      card_holder_name: validatedCardData.card_holder_name, //||`${user.first_name} ${user.last_name}`,
      ...validatedCardData,
      card_number: cardNumber,
      expiry_date: expiryDate,
      cvv: cvv2,
      pin: '0000',
      status: CardStatus.PENDING
    };
    if (!cardProfileCreationData.card_holder_name) {
      throw new Error('Card holder name is required');
    }
    console.log(validatedCardData.card_holder_name, 'DATA')

    if (!validatedCardData.user_id || !validatedCardData.card_type) {
      throw new Error('Missing required card profile data');
    }

    const existingCard = await CardProfile.findOne({
      where: {
        user_id: validatedCardData.user_id,
        card_type: validatedCardData.card_type,
        // status: CardStatus.ACTIVE,
        expiry_date: {
          [Op.gt]: new Date()
        }
      },
      order: [['createdAt', 'DESC']]
    });
    
    if (existingCard) {
      return {
        statusCode: 400,
        status: 'error',
        message: 'You already have an active card of this type',
        data: null
      };
    }
    console.log("REACHING HERE")
    const cardProfile = await CardProfile.create(cardProfileCreationData);
    console.log('CARD PROFILE', cardProfile);
    const { pin: _, ...cardCreationData } = cardProfileCreationData;
    return {
      statusCode: 201,
      status: 'success',
      message: 'Card profile created',
      data: cardCreationData
    };
  } catch (error) {
    console.error('Error creating card profile:', error);
    throw error;
  }
};

export const getCardProfileById = async (id: string) => {
  try {
    const cardProfile = await CardProfile.findOne({ where: {id},
      attributes: {
        exclude: [ 'pin' ]
      }
    } );
    // console.log(cardProfile)
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
    
    if (!cardProfiles) {
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
