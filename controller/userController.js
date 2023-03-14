const fs = require('fs')
const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`))
const User = require('../models/userModel')
const catchAsync = require('../ultis/catchAsync')
const AppError = require('./../ultis/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})

exports.createUsers = (req, res) => {

    const newID = users[users.length - 1]._id + 1;
    const newUser = Object.assign({ id: newID }, req.body)

    users.push(newUser)

    fs.writeFile('./dev-data/data/users.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tours: newUser
            }
        })
    })

}

exports.getUser = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

/*exports.updateUser = (req, res) => {
    const id = req.params.id * 1;
    const orgTour = tours.find(el => el.id === id)

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        })
    }

    //Update tour

    //send updated data back to user
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<>'
        }
    })
}*/


exports.deleteUser = (req, res) => {
    const id = req.params.id * 1

    if (id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    //delete tour from json file
    const newTour = tours.filter(el => el.id != id)
    console.log(newTour)
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour
            }
        })
    })

    res.status(204).json({
        status: 'success',
        data: null
    })
}



exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) create error if user post password data
    if (req.body.password || req.body.passwordConfirm)
        return next(new AppError('this route is not for password update. Please use /updateMyPassword', 404))
    // 2) update user data
    const filterBody = filterObj(req.body, 'name', 'email')

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })
    res.status(204).json({
        status: 'success',
        data: null
    })
})
