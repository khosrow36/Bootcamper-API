const path = require('path');
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder')

// @desc    Get all bootcamps
// @route   GET /api/api/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advacentResults);
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
    req.body.user = req.user.id;

    // Check for published bootcamp & if user can add another bootcamp
    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});
    if(publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`), 400);
    }

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
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        )
    } else {
        bootcamp.remove();
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

// @desc    Upload photo for bootcamp
// @route   PUT /api/api/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;
    // Make sure img is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }
    // CHeck filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }
    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
});