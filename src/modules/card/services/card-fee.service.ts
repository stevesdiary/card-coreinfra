import { CardFee } from "../Fee/models/card.fee.model";
import { CardProfile } from "../card-profile/model/card-profile.model";

export const createCardFee = async (cardFeeData: any) => {
  try {
    const cardProfile = await CardProfile.findByPk(cardFeeData.card_profile_id);
    if (!cardProfile) {
      return {
        statusCode: 404,
        status: 'fail',
        message: 'Card profile not found!',
        data: null
      }
    }

    const createFee = await CardFee.findOrCreate(cardFeeData)
    
    return {
      statusCode: 201,
      status: 'success',
      message: 'Card fee Created',
      data: createFee
    }
  } catch (error) {
    console.error('Error creating card fee:', error);
    throw error;
  }
}

export const  updateCardFee = async ( id: string, cardFeeUpdateData: any) => {
  try {
    const updateCardFee = await CardFee.update(cardFeeUpdateData, { where: { id }});
    return {
      statusCode: 200,
      status: 'success',
      message: 'Updated fees',
      data: updateCardFee
    }
  } catch (error) {
    console.error('Error updating card Fee: ', error);
    throw error;
  }
}

export const getCardFees =  async () => {
  try {
    const getFees = await CardFee.findAndCountAll();
    return {
      statusCode: 200,
      status: 'success',
      message: 'Fees retrieved',
      data: getFees
    }
  } catch (error) {
    console.error('Error fetching card Fees: ', error);
    throw error;
  }
}

export const deleteCardFee = async (id: string) => {
  try {
    const deleteFee = await CardFee.destroy({where: { id }});
    if (!deleteFee || deleteFee < 1) {
      return {
        statusCode: 404,
        status: "fail",
        message: "Fee not found",
        data: [],
      };
    }
    // await CardFee.destroy(id);
    return {
      statusCode: 200,
      status: "success",
      message: "fee deleted",
      data: [],
    };
  } catch (error) {
    console.error('Error fetching card Fees: ', error);
    throw error;
  }
}
