'use strict';
const { reviewImage } = require('../models')

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
    await reviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://images.pexels.com/photos/15824906/pexels-photo-15824906/free-photo-of-modern-living-room-interior.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        reviewId: 2,
        url: "image url 2"
      },
      {
        reviewId: 3,
        url: "image url 3"
      }
      ], options)
    },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'reviewImage';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
