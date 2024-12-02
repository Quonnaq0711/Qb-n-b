'use strict';

const { spotImage } = require('../models')

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
    await spotImage.bulkCreate([
    {
      spotId: 1,
        url: "https://media.istockphoto.com/id/2155877631/photo/luxury-home-with-charming-roof-on-a-quaint-street-in-encino-ca.webp?a=1&b=1&s=612x612&w=0&k=20&c=ieVJPRZWssYEoN9dJa5BYqgq1skPK9yybnfrAY1i8f0=",
        url1: 'https://images.pexels.com/photos/15824906/pexels-photo-15824906/free-photo-of-modern-living-room-interior.jpeg?auto=compress&cs=tinysrgb&w=800',
        preview: true
    },
    {
      spotId: 2,
      url: "https://images.pexels.com/photos/2459/stairs-home-loft-lifestyle.jpg?auto=compress&cs=tinysrgb&w=800",
      preview: true
    },
    {
      spotId: 3,
      url: "https://images.pexels.com/photos/7746560/pexels-photo-7746560.jpeg?auto=compress&cs=tinysrgb&w=800",
      preview: true
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/2980955/pexels-photo-2980955.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: true
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/208321/pexels-photo-208321.jpeg?auto=compress&cs=tinysrgb&w=400",
        preview: true
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
    options.tableName = 'spotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
