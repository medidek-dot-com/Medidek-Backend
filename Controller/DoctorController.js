import bcrypt from 'bcrypt'
import { Doctor } from "../Models/AddDoctors.js";
import { error, success } from "../Utils/responseWrapper.js";
import { genrateAccessToken, genrateRefreshToken } from "./authController.js";


const doctorCreation = async (req, res) => {
    const { nameOfTheDoctor,
        qulification,
        speciality,
        yearOfExprience,
        enterEmailId,
        enterPhoneNo,
        password,
        connsultationFee,
        consultingTime,
        hospitalId,
        doctorImg,
        location,
    } = req.body

    const file = req.file ? req.file.filename : doctorImg;

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        let result = await Doctor.create({
            nameOfTheDoctor,
            qulification,
            speciality,
            yearOfExprience,
            enterEmailId,
            enterPhoneNo,
            password : hashedPassword,
            connsultationFee,
            consultingTime,
            hospitalId,
            location,
            doctorImg: file,
        })
        return res.send(
            success(201, result))
    } catch (e) {
        return res.send(
            error(500, e.message))
    }
}
const getDoctorForHospital = async (req, res) => {
    const search = req.query.search || ""
    const query = {
        hospitalId: req.params.hosp_id,
        status: 'ACTIVE',
        nameOfTheDoctor: { $regex: search, $options: "i" }
    }
    try {
        let result = await Doctor.find(query).populate('reviews')
        return res.send(
            success(201, result))
    } catch (e) {
        return res.send(
            error(500, e))
    }
}
// const getDoctorForHospital = async (req, res) => {
//     const search = req.query.search || ""
//     const query = {
//         courseName: { $regex: search, $options: "i" }
//     }
//     try {
//         let result = await Doctor.find({hospitalId:req.params.hosp_id})
//         res.send(
//             success(201, result))
//     } catch (e) {
//       res.send(
//             error(500, e))
//     }
// }


const editDoctorProfile = async (req, res) => {
    const { id } = req.params
    const { nameOfTheDoctor,
        qulification,
        speciality,
        yearOfExprience,
        enterEmailId,
        enterPhoneNo,
        password,
        connsultationFee,
        consultingTime,
        hospitalId,
        doctorImg,
        location
    } = req.body

    const file = req.file ? req.file.filename : doctorImg

    try {
        const doctor = await Doctor.findByIdAndUpdate({ _id: id }, {
            nameOfTheDoctor,
            qulification,
            speciality,
            yearOfExprience,
            enterEmailId,
            enterPhoneNo,
            password,
            connsultationFee,
            consultingTime,
            hospitalId,
            location,
            doctorImg: file
        }, { new: true })

        return res.send(success(200, doctor))
    } catch (e) {
        return res.send(error(500, e.message))
    }

}

const getSingleDoctor = async (req, res) => {
    try {
        let result = await Doctor.findById(req.params.id).populate(["reviews", 'hospitalId'])
        res.send(
            success(201, result))
    } catch (e) {
        return res.send(
            error(500, e))
    }
}

const doctorSignInApi = async (req, res) => {
    const { enterEmailId, password } = req.body
    console.log(password,enterEmailId, "ye haiiiiiiiiiii")
    try {
        const user = await Doctor.find({ enterEmailId }).populate('hospitalId')
        console.log(user);
        if (!user) {
            return res.send(error(404, "User not Registered"))
        }

        console.log('ye hai password', user[0]);

        const matched = await bcrypt.compare(password, user[0].password);
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

            // res.send(success(200, result))
        


        //    (password, user.password);

    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const updateDoctorStatusToRemove = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        const result = await Doctor.findByIdAndUpdate({ _id: id }, { status }, { new: true })
        return res.send(success(200, result))
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const removeDoctor = async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id, { new: true })
        return res.send(
            success(201, "Remove "))
    } catch (e) {
        return res.send(
            error(500, e))
    }
}

const ResetPassword = async (req, res) => {

    const { id } = req.params
    const { oldPassword, newPassword } = req.body
    console.log(oldPassword, newPassword, id);
    try {
        const doctor = await Doctor.findById({ _id: id })
        console.log("This is passssss", doctor.password);
        if(!doctor){
            return res.send(error(404, 'Not Found'));
        }
        const matched = await bcrypt.compare(oldPassword, doctor.password);
        if (!matched) {
            return res.send(error(403, "Incorrect password"))
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        console.log("This is hashed password: ", hashedPassword);
        doctor.password = hashedPassword
        doctor.save()
        //  const updatedpassword=await userpatient.findById(req.params.id,{$set:{password:hashedPassword}})
        res.send(
            success(201, "Password Changed Successfully"))
    } catch (e) {
        console.log(e);
       return res.send(
            error(500, e.message))
    }

}

// const SignUpClinicDoctorcreation =async()=>{'[0'

//     let result= await Doctor.create()

//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             // return res.status(400).send("All fields are required");
//             return res.send(error(400, "All fields are required"))
//         }

//         const user = await Doctor.findOne({ email })

//         if (!user) {
//             // return res.status(404).send("User is not registered");
//             return res.send(error(404, "User is not registered"))
//         }

//         const matched = await bcrypt.compare(password, user.password);
//         if (!matched) {
//             // return res.status(403).send("Invalid password");

//             return res.send(error(403, "Incorrect password"))
//         }

//         const accessToken = genrateAccessToken({
//             _id: user._id
//         })
//         const refreshToken = genrateRefreshToken({
//             _id: user._id
//         });

//         res.cookie('jwt', refreshToken, {
//             httpOnly: true,
//             secure: true
//         })

//         // return res.status(200).json({ accessToken })
//         return res.send(success(200, { accessToken, user }));




//     } catch (e) {
//         return res.send(error(500, e.message));
//     }
// }


export { doctorCreation, getDoctorForHospital, getSingleDoctor, removeDoctor, doctorSignInApi, updateDoctorStatusToRemove, editDoctorProfile, ResetPassword }

