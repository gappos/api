'use strict';

const TABLE_PATH = {
  schema: 'public',
  tableName: 'person',
};

const LOCATION_TABLE_PATH = {
  schema: 'public',
  tableName: 'location',
};

const GENDERS = ['male', 'female'];

const COLUMNS = (Sequelize) => ({
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'),
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  middle_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  gender: {
    type: Sequelize.ENUM(GENDERS),
    allowNull: false,
  },
  dob: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  dod: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  place_id: {
    type: Sequelize.UUID,
    references: {
      model: LOCATION_TABLE_PATH,
      key: 'id',
    },
    allowNull: true,
    onDelete: 'CASCADE',
  },
  pob_id: {
    type: Sequelize.UUID,
    references: {
      model: LOCATION_TABLE_PATH,
      key: 'id',
    },
    allowNull: true,
    onDelete: 'CASCADE',
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
