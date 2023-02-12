'use strict';

const NAME = 'book';
const COLUMNS = (Sequelize) => ({
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
const INDEXED_FIELDS = [];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create table
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(NAME, COLUMNS(Sequelize), {
        transaction,
      });
      INDEXED_FIELDS.forEach(async (field) => {
        await queryInterface.addIndex(NAME, [field], { transaction });
      });
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      INDEXED_FIELDS.forEach(async (field) => {
        await queryInterface.removeIndex(NAME, [field], { transaction });
      });

      await queryInterface.dropTable(NAME, { transaction });
    });
  },
};
