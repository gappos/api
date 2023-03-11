'use strict';

const TABLE_PATH = {
  schema: 'public',
  tableName: 'spouse',
};

const PERSON_TABLE_PATH = {
  schema: 'public',
  tableName: 'person',
};

const PKEY_CONSTRAIN = 'spouse_pkey';

const COLUMNS = (Sequelize) => ({
  partner1_id: {
    type: Sequelize.UUID,
    references: {
      model: PERSON_TABLE_PATH,
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
  },
  partner2_id: {
    type: Sequelize.UUID,
    references: {
      model: PERSON_TABLE_PATH,
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
  },
  wedding: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  divorce: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_PATH, COLUMNS(Sequelize));
    await queryInterface.addConstraint(TABLE_PATH, {
      type: 'primary key',
      fields: ['partner1_id', 'partner2_id'],
      name: PKEY_CONSTRAIN,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(TABLE_PATH, PKEY_CONSTRAIN);
    await queryInterface.dropTable(TABLE_PATH);
  },
};
