const Tour = require('../models/tourModel')
const APIFeatures = require('../ultis/APIFeatures')
const catchAsync = require('../ultis/catchAsync')
const AppError = require('../ultis/appError')

exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = 5
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingAverage,summary,difficulty'
    next()
}

exports.getAllTours = catchAsync(async (req, res) => {
    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitField()
        .paginate()
    const tours = await features.query

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
})

exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id)

    if (!tour) {
        return next(new AppError('No Tour found with that ID'), 404)
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})



exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            tours: newTour
        }
    })
    /*try {
        
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }*/
})

exports.updateTour = catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    //Update tour

    //send updated data back to user
    res.status(200).json({
        status: 'success',
        data: { tour }
    })
})

exports.deleteTour = catchAsync(async (req, res) => {
    //delete tour from json file
    const tour = await Tour.findByIdAndDelete(req.params.id)
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }
    //fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
    res.status(201).json({
        status: 'success',
        data: {
            tours: tour
        }
    })
    //})

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getToursStats = catchAsync(async (req, res) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: { stats }
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res) => {
    const year = req.params.year * 1;//2021
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ])

    res.status(200).json({
        status: 'success',
        data: { plan }
    })
})