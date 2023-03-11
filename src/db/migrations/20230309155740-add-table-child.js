'use strict';

const TABLE_PATH = {
  schema: 'public',
  tableName: 'child',
};

const PERSON_TABLE_PATH = {
  schema: 'public',
  tableName: 'person',
};

const PARENT_RELATIONS = ['mother', 'father', 'parent'];

const PKEY_CONSTRAIN = 'child_pkey';

const COLUMNS = (Sequelize) => ({
  child_id: {
    type: Sequelize.UUID,
    references: {
      model: PERSON_TABLE_PATH,
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
  },
  parent_id: {
    type: Sequelize.UUID,
    references: {
      model: PERSON_TABLE_PATH,
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
  },
  relation: {
    type: Sequelize.ENUM(PARENT_RELATIONS),
    allowNull: false,
  },
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_PATH, COLUMNS(Sequelize));
    await queryInterface.addConstraint(TABLE_PATH, {
      type: 'primary key',
      fields: ['child_id', 'parent_id'],
      name: PKEY_CONSTRAIN,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(TABLE_PATH, PKEY_CONSTRAIN);
    await queryInterface.dropTable(TABLE_PATH);
  },
};
