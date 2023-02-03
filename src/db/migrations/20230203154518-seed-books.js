'use strict';

const TABLE_PATH = {
  schema: 'public',
  tableName: 'book'
};

const BOOKS = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster'
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'Jerome David Salinger'
  },
  {
    title: 'The Old Man and the Sea',
    author: 'Ernest Hemingway'
  },
  {
    title: 'The Master and Margarita',
    author: 'Mikhail Bulgakov'
  },
  {
    title: 'Divina Commedia',
    author: 'Dante Alighieri'
  },
  {
    title: 'Odyssey',
    author: 'Homer'
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert(TABLE_PATH, BOOKS);
  },

  async down(queryInterface, Sequelize) {}
};
