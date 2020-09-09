const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/api/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success: true, count: bootcamps.length, data: bootcamps});
    } catch (e) {
        res.status(400).json({success: false});
    }
}

// @desc    Get single bootcamp
// @route   GET /api/api/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            res.status(400).json({success: false});
        }
        else res.status(200).json({success: true, data: bootcamp})
    } catch (e) {
        res.status(400).json({success: false})
    }
}

// @desc    Create new bootcamp
// @route   POST /api/api/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch (e) {
        res.status(400).json({success: false});
    }
}

// @desc    Update bootcamp
// @route   PUT /api/api/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if(!bootcamp) {
            return res.status(400).json({success: false});
        }
        else res.status(200).json({success: true, data: bootcamp});
    } catch (e) {
        return res.status(400).json({success: false});
    }
}

// @desc    Delete bootcamp
// @route   DEL /api/api/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp) {
            return res.status(400).json({success: false});
        }
        else res.status(200).json({success: true, data: {}});
    } catch (e) {
        return res.status(400).json({success: false});
    }
}