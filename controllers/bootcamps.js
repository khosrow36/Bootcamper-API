// @desc    Get all bootcamps
// @route   GET /api/api/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({'success': true, msg: 'Show all bootcamps'});
}

// @desc    Get single bootcamp
// @route   GET /api/api/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({'success': true, msg: `Show bootcamp ${req.params.id}`});
}

// @desc    Create new bootcamp
// @route   POST /api/api/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({'success': true, msg: 'Create new bootcamps'});
}

// @desc    Update bootcamp
// @route   PUT /api/api/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({'success': true, msg: `Update bootcamp ${req.params.id}`});
}

// @desc    Delete bootcamp
// @route   DEL /api/api/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({'success': true, msg: `Delete bootcamp ${req.params.id}`});
}