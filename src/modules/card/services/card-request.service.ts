import { customAlphabet } from 'nanoid';

import { CardRequest, CardRequestStatus } from '../Request/models/card-request.model';
import { User } from '../../user/models/user.model';
import { CardProfile } from '../card-profile/model/card-profile.model';
import { CardRequestData } from '../../user/types/type';
import { UUID } from 'sequelize';



export const createCardRequest = async (requestData: any) => {
  try {
    const nanoid = customAlphabet('1234567890', 10);
    const batch_number = nanoid();
    const request_date = new Date();
    
    const user = await User.findByPk(requestData.user_id);
    if (!user) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'User not found',
        data: null
      };
    }
    const similarRequest = await CardRequest.findOne({
      where: {
        user_id: requestData.user_id,
        requested_card_type: requestData.requested_card_type,
        status: CardRequestStatus.PENDING
      }
    });
    if (similarRequest) {
      return {
        statusCode: 400,
        status: 'fail',
        message: 'You already have a pending request for this card type',
        data: null
      };
    }
    
    const cardRequest = await CardRequest.create({
      ...requestData,
      batch_number,
      request_date,
      initiator: requestData.user_id,
      status: CardRequestStatus.PENDING || 'PENDING'
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

export const updateCardRequest = async (requestId: string, data: Partial<CardRequest>) => {
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

export const updateCardRequestStatus = async (requestId: string, data: any) => {
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
    data = { status: CardRequestStatus, card_profile_id: UUID };
    const updatedCardRequest = await cardRequest.update({
      status: data.status,
      card_profile_id: data.card_profile_id,
      where: { id: requestId }
    });

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
    console.error('Error fetching card request:', error);
    return {
      statusCode: 500,
      status: 'error',
      message: 'Failed to fetch card request',
      data: null
    };
  }
}

export const getAllCardRequests = async () => {
  try {
    const cardRequests = await CardRequest.findAll({
      include: [
        { 
          model: User, 
          attributes: ['id', 'first_name', 'last_name', 'email'] 
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
