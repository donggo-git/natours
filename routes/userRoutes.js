const express = require('express')
const userController = require('../controller/userController')
const authController = require('../controller/authController')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgotPassword', authController.forgotPassword)
router.post('/resetPassword/:token', authController.resetPassword)

router.patch('/updateMyPassword', authController.protect, authController.updatePassword)
//update user data that's not password
router.patch('/updateMe', authController.protect, userController.updateMe)

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUsers)

router
    .route('/:id')
    .get(userController.getUser)
//.patch(userController.updateUser)
//.delete(userController.deleteUser)

module.exports = router    