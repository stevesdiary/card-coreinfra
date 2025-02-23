'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('card_requests', {
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
      requested_card_type: {
        type: Sequelize.ENUM('DEBIT', 'CREDIT', 'VIRTUAL'),
        allowNull: false,
        references: {
          model: 'card_profiles',
          key: 'id'
        }
      },
      initiator: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.STRING    //ENUM('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING'),
        // allowNull: false
      },
      request_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      additional_notes: {
        type: Sequelize.TEXT
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('card_requests');
  }
};
