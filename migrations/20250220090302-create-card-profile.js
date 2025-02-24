'use strict';

const { UUIDV4 } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('card_profiles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      card_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      card_holder_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      card_type: {
        type: Sequelize.ENUM('VIRTUAL', 'CREDIT', 'DEBIT'),
        allowNull: false
      },
      expiry_date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cvv: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pin: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'INACTIVE', 'ACTIVE', 'BLOCKED'),
        defaultValue: 'PENDING'
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      currency: {
        type: Sequelize.ENUM('NGN', 'USD', 'EUR', 'GBP'),
        defaultValue: 'NGN'
      },
      branch_blacklist: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('card_profiles');
  }
};
