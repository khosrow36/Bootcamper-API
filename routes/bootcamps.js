const express = require('express');
const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBotcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBotcampsInRadius);

router.route('/:id/photo')
    .put(bootcampPhotoUpload);
module.exports = router;