'use strict';
import data from '../seedgen/mock-data-gen';
const { locations, parents, spouses, persons } = data;

const locationPath = {
  schema: 'public',
  tableName: 'location',
};

const personPath = {
  schema: 'public',
  tableName: 'person',
};

const spousePath = {
  schema: 'public',
  tableName: 'spouse',
};

const childPath = {
  schema: 'public',
  tableName: 'child',
};

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    return (
      (await queryInterface.bulkInsert(locationPath, locations)) &&
      (await queryInterface.bulkInsert(personPath, persons)) &&
      (await queryInterface.bulkInsert(spousePath, spouses)) &&
      (await queryInterface.bulkInsert(childPath, parents))
    );
  },
  async down(queryInterface, Sequelize) {
    const sql = `DELETE FROM ${locationPath.tableName} WHERE city IN ('${Array.from(
      new Set(locations.map(({ city }) => city)),
    ).join("','")}');`;
    return await queryInterface.sequelize.query(sql);
  },
};
