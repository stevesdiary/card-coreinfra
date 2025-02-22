import { customAlphabet } from 'nanoid';

import { CardProfile, CardStatus } from '../profile/card-profile.model';
import { validatedCardData } from '../../user/types/type';
import { Op } from 'sequelize';

export const createCardProfile = async (validatedCardData: any) => {
  try {
    const nanoid = customAlphabet('0123456789', 16);
    const cardNumber = nanoid();
    const cvv2 = nanoid(3); 
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 4);

    let cardProfileCreationData = {
      ...validatedCardData,
      card_number: cardNumber,
      expiry_date: expiryDate,
      cvv: cvv2
    };

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
      order: [['createdAt', 'DESC']]  // Get the most recent card
    });
    
    if (existingCard) {
      return {
        statusCode: 400,
        status: 'error',
        message: 'You already have an active card of this type',
        data: null
      };
    }
    const cardProfile = await CardProfile.create(cardProfileCreationData);
    const { pin: _, ...cardCreationData } = cardProfileCreationData;
    return {
      statusCode: 201,
      status: 'success',
      message: 'Card profile created',
      data: cardCreationData
    };
  } catch (error) {
    console.error('Error creating card profile:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to create card profile',
      data: null
    };
  }
};

export const getCardProfileById = async (id: string) => {
  try {
    const cardProfile = await CardProfile.findOne({
      where: { id }
    });
    
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
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to retrieve card profile',
      data: null
    };
  }
};
export const getCardProfiles = async (limit: number, page: number) => {
  try {
    // let {limit, page} = ;
    // limit = limit ? parseInt(limit) : 10;
    // page = page ? parseInt(page) : 1;
    const offset = (page - 1) * limit;
    const cardProfiles = await CardProfile.findAndCountAll({
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
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to retrieve card profiles',
      data: null
    };
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
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to delete card profile',
      data: null
    };
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
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to update card profile',
      data: null
    };
  }
};
