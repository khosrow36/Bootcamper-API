const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder')

// @desc    Get all bootcamps
// @route   GET /api/api/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
});

// @desc    Get single bootcamp
// @route   GET /api/api/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        )
    } else {
        res.status(200).json({success: true, data: bootcamp});
    }
});

// @desc    Create new bootcamp
// @route   POST /api/api/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    })
});

// @desc    Update bootcamp
// @route   PUT /api/api/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        )
    } else {
        res.status(200).json({success: true, data: bootcamp});
    }
});

// @desc    Delete bootcamp
// @route   DEL /api/api/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        )
    } else {
        res.status(200).json({success: true, data: {}});
    }
});

// @desc    Get bootcamps within a radius
// @route   GET /api/api/bootcamps/radius/:zipcode/:distancce
// @access  Private
exports.getBotcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // earth radius = 6 378 km / 3 963 mi
    const radius = distance / 6378;

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});