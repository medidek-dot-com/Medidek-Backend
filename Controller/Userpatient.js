




import { userpatient } from "../Models/Userpatition.js";
import { Otp } from "../Models/otpSchema.js";
import { error, success } from "../Utils/responseWrapper.js";
import { genrateAccessToken, genrateRefreshToken, sendOTPToEmail } from "./authController.js";
import bcrypt from 'bcrypt'
import {cloud} from "./cloudinary/cloudinary.js"
const UserCreation = async (req, res) => {
    // try {

    //     const finduser= await userpatient.find({updatedEmailAddress:req.body.updatedEmailAddress})
    //     if(finduser.length!==0){
    //         res.send(
    //             error(409, "User already exists with given emailId"))
    //     }

    try {
        const { email } = req.body;

        // if (!email || !password) {
        //     // return res.status(400).send("All fields are required");
        //     return res.send(error(400, "All fields are required"));
        // }

        const oldUser = await userpatient.findOne({ email })
        if (oldUser) {
            // return res.status(400).send("User is already registered");
            return res.send(error(409, "User is already registered"))
        }
        const mailIdExists = await Otp.findOne({ email })
        const OTP = Math.floor(100000 + Math.random() * 900000);

        if (mailIdExists) {
            const updateOtp = await Otp.findByIdAndUpdate({ _id: mailIdExists._id }, { otp: OTP }, { new: true })
            updateOtp.save();

            await sendOTPToEmail(email, OTP)
            return res.send(success(200, `OTP sent successfully to ${email}`));

        } else {
            const saveOtpData = new Otp({ email, otp: OTP });
            await saveOtpData.save();

            await sendOTPToEmail(email, OTP)
            return res.send(success(200, `OTP sent successfully to ${email}`));

        }
    } catch (e) {
        console.log(e);
        return res.send(error(400, e.message));

    }



    // const result = await userpatient.create(req.body)
    //  res.send(
    //     success(201, result))
}

export const varifyOtpAndSignUpPatientController = async (req, res) => {
    const { email, password, otp, phone, name } = req.body


    try {
        const otpverification = await Otp.findOne({ email: email });
        const userExist = await userpatient.findOne({ email: email });

        if (userExist) {
            return res.send(error(409, "User is already registered"))

        }
        if (otpverification.otp !== otp) {
          return  res.send(error(403, "Invalid OTP"))
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userpatient.create({ email, password: hashedPassword, phone, name })
        
        const accessToken = genrateAccessToken({
            _id: user._id
        })
        const refreshToken = genrateRefreshToken({
            _id: user._id
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        // return res.status(200).json({ accessToken })
        return res.send(success(200, { accessToken, user }));

        // return res.status(201).json({ user })
        // return res.send(success(201, { user }))

    } catch (e) {
        console.log(e.message);
    }
};

const sendOtpForResetPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await userpatient.findOne({ email: email })

        if (!user) {
            return res.send(error(404, 'User not found'))
        }

        const mailIdExists = await Otp.findOne({ email })
        const OTP = Math.floor(100000 + Math.random() * 900000);

        if (mailIdExists) {
            const updateOtp = await Otp.findByIdAndUpdate({ _id: mailIdExists._id }, { otp: OTP }, { new: true })
            updateOtp.save();

            await sendOTPToEmail(email, OTP)
            return res.send(success(200, {masseage:`OTP sent successfully to ${email}`,_id:user._id}));

        } else {
            const saveOtpData = new Otp({ email, otp: OTP  });
            await saveOtpData.save();

            await sendOTPToEmail(email, OTP)
            return res.send(success(200, {masseage:`OTP sent successfully to ${email}`,_id:user._id}));

        }


    } catch (e) {
        console.log(e.message);
        return res.send(error(500, e.message))
    }
}

const varifyOtpForResetPassword = async (req, res) => {
    const { email, otp } = req.body
    try {
        const varifyOtp = await Otp.findOne({ email: email })
        if (!varifyOtp) {
           return res.send(error(404, 'User not found'))
        }
        if (varifyOtp.otp !== otp) {
           return res.send(error(403, "Invalid OTP"))
        }

      return  res.send(success(200, "Otp Varified Successfully"))

    } catch (e) {
        console.log(e.message);
        return res.send(error(500, e.message))
    }
}


const ResetPassword =async (req, res)=>{
    try {
        const result = await userpatient.findById(req.params.id)
        console.log(result);
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        result.password = hashedPassword
        result.save()
        //  const updatedpassword=await userpatient.findById(req.params.id,{$set:{password:hashedPassword}})
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e.message))
    }

}



// const getDoctorForHospital = async (req, res) => {
//     try {
//         console.log(req.params.id,req.params.hosp_id)
//         let result = await Doctor.find({hospitalId:req.params.hosp_id,_id:req.params.id})
//         res.send(
//             success(201, result))
//     } catch (e) {
//       res.send(
//             error(500, e))
//     }
// }

const getAllUser = async (req, res) => {
    try {
        let result = await userpatient.find()
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}


const updateUserpatient = async (req, res) => {
    const {id} = req.params
    const {name, email, dateOfBirth, phone, img} = req.body; 
    // const file = req.file ? req.file.filename : img;
    try {
        const result = await cloud.uploader.upload(req.file.path);
        const imageUrl = result.secure_url
        let user = await userpatient.findByIdAndUpdate({_id:id}, { name, email, dateOfBirth, phone, img:imageUrl }, { new: true })
       return res.send(
            success(201, user))
    } catch (e) {
        console.log(e);
       return res.send(
            error(500, e.message))
    }
}

//Sign in with JWT

const FindbyUserNameAndPassoword = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).send("All fields are required");
            return res.send(error(400, "All fields are required"))
        }

        const user = await userpatient.findOne({ email })

        if (!user) {
            // return res.status(404).send("User is not registered");
            return res.send(error(404, "User is not registered"))
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            // return res.status(403).send("Invalid password");

            return res.send(error(403, "Incorrect password"))
        }

        const accessToken = genrateAccessToken({
            _id: user._id
        })
        const refreshToken = genrateRefreshToken({
            _id: user._id
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        // return res.status(200).json({ accessToken })
        return res.send(success(200, { accessToken, user }));




    } catch (e) {
        return res.send(error(500, e.message));
    }
    // try {
    //     let result = await userpatient.find({ updatedEmailAddress: req.body.updatedEmailAddress, password: req.body.password })
    //     if (result.length === 0) {
    //         res.send(
    //             success(404, "!!!!!!!"))
    //     }
    //     else {
    //         res.send(
    //             success(201, result))
    //     }
    // } catch (e) {
    //     res.send(
    //         error(500, e))
    // }
}

const getSinglePetient = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userpatient.findOne({ _id: id });
        res.send(success(200, user))

    } catch (e) {
        res.send(error(500, e.message));
    }
}


const updateUserpatientByyApp = async (req, res) => {


    try {
        let result = await userpatient.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e.message))
    }
}

const updateUserpatientPasswordByyApp = async (req, res) => {
    try {
        const result = await userpatient.findById(req.params.id)

        const matched = await bcrypt.compare(req.body.oldpassword, result.password);
        if (!matched) {
            // return res.status(403).send("Invalid password");

            return res.send(error(403, "Incorrect password"))
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        result.password = hashedPassword
        result.save()
        //  const updatedpassword=await userpatient.findById(req.params.id,{$set:{password:hashedPassword}})
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e.message))
    }
}



// aws.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_BUCKET_REGION
//   });
  
//   const s3 = new aws.S3();
  
//   // Create a function in your controller to handle S3 uploads
//   const uploadToS3 = (req, res) => {
//     const uploadParams = {
//       Bucket: process.env.AWS_BUCKET,
//       Key: 'file-name.jpg', // The name to give to the file in S3
//       Body: 'file-content',  // The file content
//     };
  
//     s3.upload(uploadParams, (err, data) => {
//       if (err) {
//         console.error('Error uploading file to S3:', err);
//         res.status(500).json({ message: 'Error uploading file to S3' });
//       } else {
//         console.log('File uploaded successfully:', data.Location);
//         res.status(200).json({ message: 'File uploaded successfully', url: data.Location });
//       }
//     });
//   };
  
  // Export the uploadToS3 function so you can use it in your routes

export { UserCreation, getAllUser, updateUserpatient, FindbyUserNameAndPassoword, getSinglePetient, updateUserpatientByyApp, updateUserpatientPasswordByyApp, sendOtpForResetPassword, varifyOtpForResetPassword ,ResetPassword }

