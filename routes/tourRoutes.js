const express = require('express')
const tourController = require('../controller/tourController')
const router = express.Router()

//router.param('id', tourController.checkID)

//create a checkBody middleware
//check if body contain the name and price property

router
    .route('/top-5-cheaps')
    .get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getToursStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour)

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

module.exports = router