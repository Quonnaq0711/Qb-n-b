'use strict';

const { Spots } = require('../models')


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Spots.bulkCreate([
    {
    ownerId: 1,
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    name: "App Academy",
    description: "Place where web developers are created",
    price: 123,
    },
    {
      ownerId: 2,
      address: "12345 Pixar Street",
      city: "New York",
      state: "New York",
      country: "United States of America",
      name: "New York Loft",
      description: "Overlooking time square",
      price: 999,
      },
      {
        ownerId: 3,
        address: "54321 Main Street",
        city: "Estes Park",
        state: "Colorado",
        country: "United States of America",
        name: "Mountain Cabin",
        description: "Beautiful view of river",
        price: 345,
     },
     {
      ownerId: 1,
      address: "54321 YouHitACurb Avenue",
      city: "Diego Park",
      state: "Maryland",
      country: "United States of America",
      name: "Seaside Excape",
      description: "Beautiful view of The perfect retreat, where the sound of the waves and the salty ocean breeze create an idyllic atmosphere for relaxation and adventure.",
      price: 210,
     },
     {
      ownerId: 1,
      address: "9458 yukurt Road",
      city: "Osaska",
      state: "Osaska",
      country: "Japan",
      name: "Japanese Getaway",
      description: "Beautiful view of The perfect retreat, nestled in the midddle of a small town, surrounded by locals ",
      price: 425,
      },
   ], options);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
