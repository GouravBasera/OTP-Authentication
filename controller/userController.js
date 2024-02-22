const otpModel = require('../models/otp')
const otpVerification = require('../helper/otpValidate')

const twilio = require('twilio')
const otpGenerator = require('otp-generator')

const accountSid = "AC25569a1b07d7525d8fdfbd2a4f11fe6c";
const authToken = "9680e0db12c1c2bacabeb200e2eee1a4";
// const verifySid = "VAe000fbeb4a897c3107a37bc9f263cc92"

const twilioClient = new twilio(accountSid, authToken);

const sendOtp = async (req, res) => {
    try{
        const {phoneNumber} = req.body;

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false ,
        specialChars: false,
        lowerCaseAlphabets: false,
        })

        const cDate = new Date()

        await otpModel.findOneAndUpdate({ phoneNumber }, 
            { otp, otpExpiration: new Date(cDate.getTime())},
            { upsert: true, new: true }
            );
        
        await twilioClient.messages.create({
            body: `Your OTP is ${otp}`,
            to: phoneNumber,
            from: "+1 516 928 6930",
        })

        return res.status(200).json({
            success: true,
            msg: 'OTP Sent Successfully'
        })

    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const verifyOtp = async (req, res)=>{
    try{
        const { phoneNumber, otp } = req.body

        const otpData = await otpModel.findOne({
            phoneNumber, 
            otp
        })

        if(!otpData){
            return res.status(400).json({
                success: false,
                msg: "Wrong OTP Entered"
            })
        }

        const isOtpExpired = await otpVerification(otpData.otpExpiration);

        if(isOtpExpired){
            return res.status(400).json({
                success: false,
                msg: "Your OTP has been expired"
            })
        }
        return res.status(200).json({
            msg: "OTP Verified Successfully"
        })

    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports = {
    sendOtp,
    verifyOtp
}