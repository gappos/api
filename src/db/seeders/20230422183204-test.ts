// @ts-nocheck
'use strict';
import data from "../seedgen/mock-data-gen"
const { locations } = data;
const { persons } = data;
const { spouses } = data;
const { parents } = data;


const locationPath = {
  schema: 'public',
  tableName: 'location',
};

const personPath = {
  schema: "public",
  tableName: "person",
}

const spousePath = {
  schema: "public",
  tableName: "spouse",
}

const childPath = {
  schema: "public",
  tableName: "child",
}

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert(locationPath, locations) && await queryInterface.bulkInsert(personPath, persons) && await queryInterface.bulkInsert(spousePath, spouses) && await queryInterface.bulkInsert(childPath, parents)
  },
  async down(queryInterface, Sequelize) {
  }
};
