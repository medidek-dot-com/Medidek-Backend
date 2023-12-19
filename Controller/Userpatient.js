




import { userpatient } from "../Models/Userpatition.js";
import { Otp } from "../Models/otpSchema.js";
import { error, success } from "../Utils/responseWrapper.js";
import { genrateAccessToken, genrateRefreshToken, sendOTPToEmail } from "./authController.js";
import bcrypt from 'bcrypt'
import { Doctor } from "../Models/AddDoctors.js";
import { Master } from "../Models/Master.js";
import crypto from "crypto";
import { uploadFile } from "../Middleware/s3.js";



const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");


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
        return res.send(error(409, "User already exists"));
    }
    if (isdoctor) {
        return res.send(error(409, "User already exists"));
    }
    if (ishospital) {
        return res.send(error(409, "User already exists"));
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

const userprofileupdate = async (req, res) => {
    const { id } = req.params;
    const { name, email, dateOfBirth, phone, imgurl, gender, mapLink } = req.body;
    if (!name || !email || !dateOfBirth || !phone, !gender) {
        return res.send(error(409, "pls filled all field"));
    }
    const file = req.file;

    const imageName = file ? generateFileName() : imgurl;

    const fileBuffer = file?.buffer;
    try {
        if (fileBuffer) {
            await uploadFile(fileBuffer, imageName, file.mimetype)
        }
        const data = await userpatient.findByIdAndUpdate({ _id: id }, {
            name, email, dateOfBirth, phone, img: imageName, gender, mapLink
        }, { new: true })
        data.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + data.img
        await data.save();
        return res.send(success(200, data));
    } catch (e) {
        return res.send(error(500, e.message))
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
                    return res.send(error(409, "Your entered password is wrong"));
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
                    return res.send(error(409, "Your entered password is wrong"));
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
export {
    usersignup,
    usersignin,
    userpasswordupdated,
    userforgotpassword,
    isUserExist,
    usergetalldoctors,
    changepassword,
    userprofileupdate
}

