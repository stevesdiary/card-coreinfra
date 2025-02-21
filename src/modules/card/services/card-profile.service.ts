import { CardProfile } from '../profile/card-profile.model';
import { customAlphabet } from 'nanoid';

export const createCardProfile = async (data: any) => {
  try {
    // Generate card number
    const nanoid = customAlphabet('0123456789', 16);
    const cardNumber = nanoid();

    const cardProfile = await CardProfile.create({
      ...data,
      card_number: cardNumber,
      // Add other default or generated fields
    });

    return {
      statusCode: 201,
      status: 'success',
      message: 'Card profile created',
      data: cardProfile
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
    const cardProfile = await CardProfile.findByPk(id);
    
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
    const cardProfiles = await CardProfile.findAll();
    
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

export const updateCardProfile = async (id: string, data: any) => {
  try {
    const [updated] = await CardProfile.update(data, {
      where: { id }
    });

    if (updated === 0) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Card profile not found',
        data: null
      };
    }

    const updatedProfile = await CardProfile.findByPk(id);

    return {
      statusCode: 200,
      status: 'success',
      message: 'Card profile updated',
      data: updatedProfile
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
