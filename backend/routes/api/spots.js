const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spots, User, spotImage, Review } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const { Sequelize } = require('sequelize'); 


// //get all spots with avgStars and Preview image
// router.get('/', async (req, res) => {
//     const spots = await Spots.findAll();
//     res.status(200).json({ Spots: spots });
// });

router.get('/', async (req, res) => {
    const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const errors = {};
    
    // Validate page and size only if provided
    if (page) {
        const pageNumber = Number(page);
        if (pageNumber < 1) errors.page = "Page must be greater than or equal to 1";
    }
    
    if (size) {
        const pageSize = Number(size);
        if (pageSize < 1 || pageSize > 20) errors.size = "Size must be between 1 and 20";
    }

    // Validate latitude and longitude
    if (minLat && (isNaN(minLat) || Number(minLat) < -90 || Number(minLat) > 90)) {
        errors.minLat = "Minimum latitude is invalid";
    }
    if (maxLat && (isNaN(maxLat) || Number(maxLat) < -90 || Number(maxLat) > 90)) {
        errors.maxLat = "Maximum latitude is invalid";
    }
    if (minLng && (isNaN(minLng) || Number(minLng) < -180 || Number(minLng) > 180)) {
        errors.minLng = "Minimum longitude is invalid";
    }
    if (maxLng && (isNaN(maxLng) || Number(maxLng) < -180 || Number(maxLng) > 180)) {
        errors.maxLng = "Maximum longitude is invalid";
    }
    if (minPrice && (isNaN(minPrice) || Number(minPrice) < 0)) {
        errors.minPrice = "Minimum price must be greater than or equal to 0";
    }
    if (maxPrice && (isNaN(maxPrice) || Number(maxPrice) < 0)) {
        errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    }

    // Set default values for page and size if not provided
    const pageNumber = page ? Number(page) : 1;  // Default page = 1
    const pageSize = size ? Number(size) : 20;   // Default size = 20

    const limit = pageSize;
    const offset = (pageNumber - 1) * limit;

    // Prepare filters
    const whereConditions = {};
    if (minLat) whereConditions.lat = { [Sequelize.Op.gte]: minLat };
    if (maxLat) whereConditions.lat = { [Sequelize.Op.lte]: maxLat };
    if (minLng) whereConditions.lng = { [Sequelize.Op.gte]: minLng };
    if (maxLng) whereConditions.lng = { [Sequelize.Op.lte]: maxLng };
    if (minPrice) whereConditions.price = { [Sequelize.Op.gte]: minPrice };
    if (maxPrice) whereConditions.price = { [Sequelize.Op.lte]: maxPrice };

    // Fetch spots with filtering, pagination, and averaging ratings
    const spots = await Spots.findAll({
        where: whereConditions,
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 
            'lat', 'lng', 'name', 'description', 'price', 
            'createdAt', 'updatedAt',
            [Sequelize.literal('(SELECT AVG(stars) FROM Reviews WHERE Reviews.spotId = Spots.id)'), 'avgRating']
        ],
        include: [
            {
                model: spotImage, 
                attributes: ['url', 'preview'], 
                required: false
            }
        ],
        limit,
        offset,
        group: ['Spots.id']
    });

    // Format the response
    const formattedSpots = spots.map(spot => {
        const spotData = spot.toJSON();
        const previewImageObj = spotData.spotImages?.find(image => image.preview === true) || null;

        return {
            id: spotData.id,
            ownerId: spotData.ownerId,
            address: spotData.address,
            city: spotData.city,
            state: spotData.state,
            country: spotData.country,
            lat: spotData.lat,
            lng: spotData.lng,
            name: spotData.name,
            description: spotData.description,
            price: spotData.price,
            createdAt: spotData.createdAt,
            updatedAt: spotData.updatedAt,
            avgRating: parseFloat(spotData.avgRating) || null,
            previewImage: previewImageObj ? previewImageObj.url : null
        };
    });

    // Prepare the response object
    const response = { Spots: formattedSpots };

    // Only include pagination info in the response if page and size were provided
    if (req.query.page) response.page = pageNumber;
    if (req.query.size) response.size = pageSize;

    res.status(200).json(response);
});

//get all Spots owned by the Current User

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    
    if (!user) {
        return res.status(401).json({
            message: 'Authentication required',
            statusCode: 401
        });
    }

    const spots = await Spots.findAll({
        where: {
            ownerId: user.id
        },
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 
            'lat', 'lng', 'name', 'description', 'price', 
            'createdAt', 'updatedAt',
            // Corrected subquery to calculate average rating per spot
            [Sequelize.literal('(SELECT AVG(stars) FROM Reviews WHERE Reviews.spotId = Spots.id)'), 'avgRating']
        ],
        include: [
            {
                model: spotImage,
                attributes: ['url', 'preview'],
                required: false
            }
        ]
    });

    // Format the response
    const formattedSpots = spots.map(spot => {
        const spotData = spot.toJSON();
        const previewImageObj = spotData.spotImages?.find(image => image.preview === true) || null;

        return {
            id: spotData.id,
            ownerId: spotData.ownerId,
            address: spotData.address,
            city: spotData.city,
            state: spotData.state,
            country: spotData.country,
            lat: spotData.lat,
            lng: spotData.lng,
            name: spotData.name,
            description: spotData.description,
            price: spotData.price,
            createdAt: spotData.createdAt,
            updatedAt: spotData.updatedAt,
            avgRating: parseFloat(spotData.avgRating) || null,
            previewImage: previewImageObj ? previewImageObj.url : null
        };
    });

    const response = { Spots: formattedSpots };

    return res.json(response);
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spotId = req.params.spotId;

    // Fetch spot details with associated User (Owner) and SpotImages
    const details = await Spots.findByPk(spotId, {
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 
            'lat', 'lng', 'name', 'description', 'price', 
            'createdAt', 'updatedAt',
            // Calculate avgStarRating and count the total number of reviews
            [Sequelize.literal('(SELECT AVG(stars) FROM Reviews WHERE Reviews.spotId = Spots.id)'), 'avgStarRating'],
            [Sequelize.literal('(SELECT COUNT(*) FROM Reviews WHERE Reviews.spotId = Spots.id)'), 'numReviews']  // Count total reviews
        ],
        include: [
            {
                model: User,  // Include the owner (User)
                attributes: { exclude: ['createdAt', 'updatedAt', 'username', 'email', 'hashedPassword'] }
            },
            {
                model: spotImage,  // Include images
                attributes: { exclude: ['createdAt', 'updatedAt', 'spotId'] }
            }
        ]
    });

    // If no spot found, return 404
    if (!details) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    // Convert Sequelize instance to plain JSON
    const spotData = details.toJSON();
    
    // Format the response
    const formattedResponse = {
        id: spotData.id,
        ownerId: spotData.ownerId,
        address: spotData.address,
        city: spotData.city,
        state: spotData.state,
        country: spotData.country,
        lat: spotData.lat,
        lng: spotData.lng,
        name: spotData.name,
        description: spotData.description,
        price: spotData.price,
        createdAt: spotData.createdAt,
        updatedAt: spotData.updatedAt,
        numReviews: parseInt(spotData.numReviews) || 0,  // Include total number of reviews
        avgStarRating: parseFloat(spotData.avgStarRating) || null,  // Include avgStarRating
        SpotImages: spotData.spotImages || [],  // Include all spot images
        Owner: {
            id: spotData.User.id,  // Rename User to Owner
            firstName: spotData.User.firstName,
            lastName: spotData.User.lastName
        }
    };

    // Send response with formatted spot details
    res.status(200).json(formattedResponse);
});

//Create a Spot
router.post('/', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;

    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
        const err = new Error("Bad Request");
        err.status = 400; 
        err.errors = {};
        if (!address) err.errors.address = "Street address is required";
        if (!city) err.errors.city = "City is required";
        if (!state) err.errors.state = "State is required";
        if (!country) err.errors.country = "Country is required";
        if (lat < -90 || lat > 90) err.errors.lat = "Latitude must be within -90 and 90";
        if (lng < -180 || lng > 180) err.errors.lng = "Longitude must be within -180 and 180";
        if (!name || name.length > 50) err.errors.name = "Name must be less than 50 characters";
        if (!description) err.errors.description = "Description is required";
        if (!price || price <= 0) err.errors.price = "Price per day must be a positive number";
        return next(err);
    }    
        const createSpot = await Spots.create({
            ownerId, address, city, state, country, lat, lng, name, description, price
        });
        res.status(201).json(createSpot);
    
});

//Edit a Spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spotId = parseInt(req.params.spotId);
    // console.log(spotId);

    const updatedSpot = await Spots.findByPk(spotId);
    // console.log(updatedSpot);

    if(!updatedSpot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
          });
    };

    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
        const err = new Error("Bad Request");
        err.status = 400; 
        err.errors = {};
        if (!address) err.errors.address = "Street address is required";
        if (!city) err.errors.city = "City is required";
        if (!state) err.errors.state = "State is required";
        if (!country) err.errors.country = "Country is required";
        if (lat < -90 || lat > 90) err.errors.lat = "Latitude must be within -90 and 90";
        if (lng < -180 || lng > 180) err.errors.lng = "Longitude must be within -180 and 180";
        if (!name || name.length > 50) err.errors.name = "Name must be less than 50 characters";
        if (!description) err.errors.description = "Description is required";
        if (!price || price <= 0) err.errors.price = "Price per day must be a positive number";
        return next(err);
    } ;

    await updatedSpot.update({
        address, 
        city, 
        state, 
        country, 
        lat, 
        lng, 
        name, 
        description, 
        price
    });
    return res.status(200).json(updatedSpot);
});

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const deletedSpot = await Spots.findByPk(spotId);

    if(!deletedSpot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    await deletedSpot.destroy();
    res.status(200).json({
        "message": "Successfully deleted"
      })
})

   
module.exports = router;