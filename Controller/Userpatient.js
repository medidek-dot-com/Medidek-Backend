




import { userpatient } from "../Models/Userpatition.js";
import { Otp } from "../Models/otpSchema.js";
import { error, success } from "../Utils/responseWrapper.js";
import { genrateAccessToken, genrateRefreshToken, sendOTPToEmail } from "./authController.js";
import bcrypt from 'bcrypt'
import { cloud } from "./cloudinary/cloudinary.js"
import { Doctor } from "../Models/AddDoctors.js";
import { Master } from "../Models/Master.js";
import crypto from "crypto";


const usergetalldoctors = async (req, res) => {
    try {
        const alldoctors = await Doctor.find({});
        let newarr = [];
        for (let doctor of alldoctors) {
            var getdocts = await Doctor.find({ doctorid: doctor.doctorid });
            if (newarr.length == 0) {
                newarr.push(getdocts[0])
            }
            else {
                for (let i = 0; i < newarr.length; i++) {
                    let c = i;
                    if (newarr[c].doctorid === getdocts[0].doctorid) {
                        break;
                    }
                    else {
                        c++;
                    }
                    if (c == newarr.length) {
                        newarr.push(getdocts[0])
                        break;
                    }
                }
            }
        }
        return res.send(success(200, newarr))
        // return res.send(success(200,alldoctors))
    } catch (e) {
        return res.send(error(e.message))
    }
}

const isUserExist = async (req, res) => {
    const { email, phone } = req.body;
    try {
        const ispatient = await userpatient.findOne({ $or: [{ email }, { phone }] });
        const isdoctor = await Doctor.findOne({
            $or: [{ email },
            { phone }],
        });
        const ishospital = await Master.findOne({ $or: [{ email }, { phone }] });
        if (ispatient) {
            return res.send(success(200, ispatient))
        }
        else if (isdoctor) {
            return res.send(success(200, isdoctor))
        }
        else if (ishospital) {
            return res.send(success(200, ishospital))
        } else {
            return res.send(error(404, "User not found"))
        }
    } catch (e) {
        return res.send(error(500, e.message));
    }


}


const usersignup = async (req, res) => {
    const { email, password, phone, rol } = req.body;
    if (!email || !password || !phone || !rol) {
        return res.status(200).send({ msg: "Pls filled all given field" });
    }
    const ispatient = await userpatient.findOne({ email, phone });

    const isdoctor = await Doctor.findOne({
        email,
        phone,
    });
    const ishospital = await Master.findOne({ email, phone });

    if (ispatient) {
        return res.send(error(409, "User is already exist"));
    }
    if (isdoctor) {
        return res.send(error(409, "User is already exist"));
    }
    if (ishospital) {
        return res.send(error(409, "User is already exist"));
    }

    try {
        if (rol === "PATIENT") {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userpatient.create({
                email,
                phone,
                password: hashedPassword,
            });
            const accessToken = genrateAccessToken({ _id: user._id });
            return res.send(success(200, { accessToken, user }));
        } else if (rol === "DOCTOR") {
            const doctorid = crypto.randomInt(0, 1000000);
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await Doctor.create({
                email,
                phone,
                password: hashedPassword,
                doctorid,
            });
            const accessToken = genrateAccessToken({ _id: user._id });
            return res.send(success(200, { accessToken, user }));
        }
        if (rol === "HOSPITAL") {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await Master.create({ email, password: hashedPassword, phone });
            const accessToken = genrateAccessToken({ _id: user._id });
            return res.send(success(200, { accessToken, user }));
        }
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

// usersignin for doctor hopital and patient

const usersignin = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        // return res.status(400).send("All fields are required");
        return res.send(error(400, "All fields are required"));
    }

    const ispatient = await userpatient.findOne({ email });
    const isdoctor = await Doctor.findOne({ email });
    const ishospital = await Master.findOne({ email });

    try {
        if (!ispatient && !isdoctor && !ishospital) {
            return res.send(error(404, "User not registered "));
        }

        if (ispatient && role !== "PATIENT") {
            return res.send(error(404, `User exists as Patient. Please signin as Patient`));
        }
        if (isdoctor && role !== "DOCTOR") {
            return res.send(error(404, `User exists as Doctor. Please signin as Doctor`))

        }
        if (ishospital && role !== "MASTER") {
            return res.send(error(404, `User exists as Hospital. Please signin as Hospital`))

        }


        if (ispatient && role === "PATIENT") {
            const matched = await bcrypt.compare(password, ispatient.password);
            if (!matched) {
                return res.send(error(403, "Incorrect password"))
            }
            const accessToken = genrateAccessToken({ _id: ispatient._id });

            return res.send(success(200, { accessToken, ispatient }));
        }
        if (isdoctor && role === "DOCTOR") {
            const matched = await bcrypt.compare(password, isdoctor.password);
            if (!matched) {
                return res.send(error(403, "Incorrect password"))
            }
            const accessToken = genrateAccessToken({ _id: isdoctor._id });
            return res.send(success(200, { accessToken, isdoctor }));
        }
        if (ishospital && role === "MASTER") {
            const matched = await bcrypt.compare(password, ishospital.password);
            if (!matched) {
                return res.send(error(403, "Incorrect password"))
            }
            const accessToken = genrateAccessToken({ _id: ishospital._id });
            return res.send(success(200, { accessToken, ishospital }));
        }



    } catch (e) {
        res.send(error(500, e.message))
    }
};


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
            const saveOtpuser = new Otp({ email, otp: OTP });
            await saveOtpuser.save();

            await sendOTPToEmail(email, OTP)
            return res.send(success(200, `OTP sent successfully to ${email}`));

        }
    } catch (e) {
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
            return res.send(error(403, "Invalid OTP"))
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
        return res.send(error(500, e.message));
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
            return res.send(success(200, { masseage: `OTP sent successfully to ${email}`, _id: user._id }));

        } else {
            const saveOtpuser = new Otp({ email, otp: OTP });
            await saveOtpuser.save();

            await sendOTPToEmail(email, OTP)
            return res.send(success(200, { masseage: `OTP sent successfully to ${email}`, _id: user._id }));

        }


    } catch (e) {

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

        return res.send(success(200, "Otp Varified Successfully"))

    } catch (e) {

        return res.send(error(500, e.message))
    }
}

const userforgotpassword = async (req, res) => {
    const { phone } = req.body;
    const ispatient = await userpatient.findOne({ phone });
    const isdoctor = await Doctor.findOne({ phone })
    const ishospital = await Master.findOne({ phone })
    try {
        if (ishospital) {
            return res.send(success(200, { role: ishospital.role, phone }))
        }
        if (isdoctor) {
            return res.send(success(200, { role: isdoctor.role, phone }))
        }
        if (ispatient) {
            return res.send(success(200, { role: ispatient.role, phone }))
        } else {
            return res.send(error(404, "user not found"))
        }

    } catch (error) {
        return res.send(error(500, ("error in backend")))
    }
}

// userpassword updated

const userpasswordupdated = async (req, res) => {
    const { password, role, phone } = req.body;
    if (role === "PATIENT") {
        const result = await userpatient.findOne({ phone });

        const hashedPassword = await bcrypt.hash(password, 10);
        result.password = hashedPassword;
        result.save();
        return res.send(success(200, { msg: "user password updated succesfully" }));
    }
    if (role === "DOCTOR") {
        const result = await Doctor.findOne({ phone });

        const hashedPassword = await bcrypt.hash(password, 10);
        result.password = hashedPassword;
        result.save();
        return res.send(success(200, { msg: "user password updated succesfully" }));
    }
    if (role === "MASTER") {
        const result = await Master.findOne({ phone });

        const hashedPassword = await bcrypt.hash(password, 10);
        result.password = hashedPassword;
        result.save();
        return res.send(success(200, { msg: "user password updated succesfully" }));
    }
}


const ResetPassword = async (req, res) => {
    try {
        const result = await userpatient.findById(req.params.id)
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
    const { id } = req.params
    const { name, email, dateOfBirth, phone, img } = req.body;
    // const file = req.file ? req.file.filename : img;
    try {
        const result = await cloud.uploader.upload(req.file.path);
        const imageUrl = result.secure_url
        let user = await userpatient.findByIdAndUpdate({ _id: id }, { name, email, dateOfBirth, phone, img: imageUrl }, { new: true })
        return res.send(
            success(201, user))
    } catch (e) {
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

const changepassword = async (req, res) => {
    const { id } = req.params;
    const { oldpassword, newpassword, role } = req.body;

    if (!oldpassword || !newpassword || !id || !role) {
        return res.send(error(500, "pls filled all field"));
    }
    try {
        if (role === "DOCTOR") {
            const finduser = await Doctor.findOne({ _id: id });
            if (finduser) {
                const matched = await bcrypt.compare(oldpassword, finduser.password);
                if (matched) {
                    const hashedPassword = await bcrypt.hash(newpassword, 10);
                    const changepassword = await Doctor.findByIdAndUpdate({ _id: id }, { password: hashedPassword }, { new: true });
                    return res.send(success(200, changepassword));
                }
                else {
                    return res.status(409).send({ msg: "your entered password is wrong" });
                }
            }
            else {
                return res.status(200).send({ msg: "user is not present" });
            }
        }
        if (role === "HOSPITAL") {
            const finduser = await Master.findOne({ _id: id });
            if (finduser) {
                const matched = await bcrypt.compare(oldpassword, finduser.password);
                if (matched) {
                    const hashedPassword = await bcrypt.hash(newpassword, 10);
                    const changepassword = await Master.findByIdAndUpdate({ _id: id }, { password: hashedPassword }, { new: true });
                    return res.send(success(200, changepassword));
                }
                else {
                    return res.status(409).send({ msg: "your entered password is wrong" });
                }
            }
            else {
                return res.status(200).send({ msg: "user is not present" });
            }
        }
        if (role === "PATIENT") {
            const finduser = await userpatient.findOne({ _id: id });
            if (finduser) {
                const matched = await bcrypt.compare(oldpassword, finduser.password);
                if (matched) {
                    const hashedPassword = await bcrypt.hash(newpassword, 10);
                    const changepassword = await userpatient.findByIdAndUpdate({ _id: id }, { password: hashedPassword }, { new: true });
                    return res.send(success(200, changepassword));
                }
                else {
                    return res.send(error(409, "Your entered password is wrong"));
                }
            }
            else {
                return res.status(200).send({ msg: "user is not present" });
            }
        }

    } catch (e) {
        return res.send(error(500, e.message));
    }
}



export { UserCreation, getAllUser, updateUserpatient, FindbyUserNameAndPassoword, getSinglePetient, updateUserpatientByyApp, updateUserpatientPasswordByyApp, sendOtpForResetPassword, varifyOtpForResetPassword, ResetPassword, usersignup, usersignin, userpasswordupdated, userforgotpassword, isUserExist, usergetalldoctors, changepassword }

