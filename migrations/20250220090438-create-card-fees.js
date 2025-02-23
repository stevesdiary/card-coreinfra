'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('card_fees', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      card_type: {
        type: Sequelize.ENUM('DEBIT', 'CREDIT', 'VIRTUAL'),
        allowNull: false
        // Remove the references block
      },
      fee_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      frequency: {
        type: Sequelize.STRING,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      card_profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'card_profiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('card_fees');
  }
};
