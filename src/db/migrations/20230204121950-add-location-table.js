'use strict';

const TABLE_PATH = {
  schema: 'public',
  tableName: 'location',
};

const COLUMNS = (Sequelize) => ({
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'),
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  place: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});
const INDEXED_FIELDS = [];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create table
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(TABLE_PATH, COLUMNS(Sequelize), {
        transaction,
      });
      INDEXED_FIELDS.forEach(async (field) => {
        await queryInterface.addIndex(TABLE_PATH, [field], {
          transaction,
        });
      });
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      INDEXED_FIELDS.forEach(async (field) => {
        await queryInterface.removeIndex(TABLE_PATH, [field], {
          transaction,
        });
      });

      await queryInterface.dropTable(TABLE_PATH, { transaction });
    });
  },
};
