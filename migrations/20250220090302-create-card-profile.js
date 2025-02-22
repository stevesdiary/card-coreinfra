'use strict';

const { UUIDV4 } = require('sequelize');
const { now } = require('sequelize/lib/utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('card_profiles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: UUIDV4
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
        allowNull: false
      },
      card_holder_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      card_type: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('card_profiles');
  }
};