'use strict';
import locations from "scripts/mock-data.json"

const TABLE_PATH = {
  schema: 'public',
  tableName: 'location',
};

// const locations = [
//   {
//     id: "047ec7e0-02ce-4ea8-ad07-6a7f545e56e6",
//     city: "Caemlyn",
//     country: "Andor"
//   },
//   {
//     id: "047ec7e0-02ce-4ea8-ad07-6a7f545e56e7",
//     city: "Tanchiko",
//     country: "Tarabon"
//   },
//   {
//     id: "047ec7e0-02ce-4ea8-ad07-6a7f545e56e9",
//     city: "Cold Rocks Hold",
//     country: "Aiel Waste"
//   }
// ]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(TABLE_PATH, locations)
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
