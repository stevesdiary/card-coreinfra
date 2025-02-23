import { CardRequest, CardRequestStatus } from '../Request/models/card-request.model';
import { User } from '../../user/models/user.model';
import { CardProfile } from '../profile/card-profile.model';
import { request } from 'http';

interface CardRequestDTO {
  user_id: string;
  card_profile_id?: string;
  status?: CardRequestStatus;
  remarks?: string;
}

export const createCardRequest = async (data: CardRequestDTO) => {
  try {
    // Check if user exists
    const user = await User.findByPk(data.user_id);
    if (!user) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'User not found',
        data: null
      };
    }

    // Optional: Check if card profile exists if provided
    if (data.card_profile_id) {
      const cardProfile = await CardProfile.findByPk(data.card_profile_id);
      if (!cardProfile) {
        return {
          statusCode: 404,
          status: 'fail',
          message: 'Card profile not found',
          data: null
        };
      }
    }

    const cardRequest = await CardRequest.create({
      ...data,
      status: data.status || CardRequestStatus.PENDING
    });

    return {
      statusCode: 201,
      status: 'success',
      message: 'Card request created',
      data: cardRequest
    };
  } catch (error) {
    console.error('Error creating card request:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to create card request',
      data: null
    };
  }
}

export const getCardRequests = async (userId: string) => {
  try {
    const cardRequests = await CardRequest.findAll({
      where: { user_id: userId },
      include: [
        { 
          model: User, 
          attributes: ['id', 'first_name', 'last_name', 'email'] 
        },
        { 
          model: CardProfile, 
          attributes: ['id', 'card_number', 'card_type'] 
        }
      ]
    });

    return {
      statusCode: 200,
      status: 'success',
      message: 'Card requests retrieved',
      data: cardRequests
    };
  } catch (error) {
    console.error('Error retrieving card requests:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to retrieve card requests',
      data: null
    };
  }
}

export const updateCardRequest = async (requestId: string, data: Partial<CardRequestDTO>) => {
  try {
    const cardRequest = await CardRequest.findByPk(requestId);
    if (!cardRequest) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Card request not found',
        data: null
      };
    }

    const updatedCardRequest = await cardRequest.update(data);

    return {
      statusCode: 200,
      status: 'success',
      message: 'Card request updated',
      data: updatedCardRequest
    };
  } catch (error) {
    console.error('Error updating card request:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to update card request',
      data: null
    };
  }
}

export const updateCardRequestStatus = async (requestId: string, data: Partial<CardRequestDTO>) => {
  try {
    const cardRequest = await CardRequest.findByPk(requestId);
    if (!cardRequest) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Card request not found',
        data: null
      };
    }

    const updatedCardRequest = await cardRequest.update(data);

    return {
      statusCode: 200,
      status: 'success',
      message: 'Card request status updated',
      data: updatedCardRequest
    };
  } catch (error) {
    console.error('Error updating card request:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to update card request',
      data: null
    };
  }
}

export const getCardRequestById = async (requestId: string) => {
  try {
    const cardRequest = await CardRequest.findByPk(requestId, {
      include: [
        { 
          model: User, 
          attributes: ['id', 'first_name', 'last_name', 'email'] 
        },
        { 
          model: CardProfile, 
          attributes: ['id', 'card_number', 'card_type'] 
        }
      ]
    })
    if (!cardRequest) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Card request not found',
        data: null
      };
    }
    return {
      statusCode: 200,
      status: 'success',
      message: 'Card request found',
      data: cardRequest
    };
  } catch (error) {
    console.error('Error updating card request:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to update card request',
      data: null
    };
  }
}
