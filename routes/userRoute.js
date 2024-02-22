const express = require('express')
const router = express()
const userController = require('../controller/userController')

router.use(express.json())
router.post('/send-otp', userController.sendOtp)
router.post('/verify-otp', userController.verifyOtp)

module.exports = router;