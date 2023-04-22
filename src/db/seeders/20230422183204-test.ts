'use strict';
import data from "../seedgen/mock-data-gen"
const { locations } = data;

const TABLE_PATH = {
  schema: 'public',
  tableName: 'location',
};

/** @type {import('sequelize-cli').Migration} */
export default {
  // @ts-expect-error
  async up(queryInterface, Sequelize) {
    console.log(locations)
    return await queryInterface.bulkInsert(TABLE_PATH, locations)
  },
  // @ts-expect-error
  async down(queryInterface, Sequelize) {
  }
};
