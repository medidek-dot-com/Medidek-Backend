
import { Doctor } from "../Models/AddDoctors.js";
import { staff } from "../Models/Addstaff.js";
import { Master } from "../Models/Master.js";
import { error, success } from "../Utils/responseWrapper.js";

const masterCreation = async (req, res) => {
console.log("ye hai req ", req);
    const {id} = req.params
    console.log("ye hai req dot id", req._id);
    const {
        email,
        password,
        enterFullAddress,
        hospitalType,
        landmark,
        location,
        nameOfhospitalOrClinic,
        img
    } = req.body
    const file = req.file ? req.file.filename : img
    try {
        let user = await Master.findByIdAndUpdate({_id:id}, { email,
            password,
            enterFullAddress,
            hospitalType,
            img:file,
            landmark,
            location,
            nameOfhospitalOrClinic, }, { new: true });
        res.send(
            success(201, user))
    } catch (e) {
        res.send(
            error(500, e.message))
    }
} 

const getMasterUserDataController = async (req, res) => {
    console.log(req._id);
    try {
        const user = await Master.findById(req._id);
        return res.send(success(200, { user }))
    } catch (e) {
        res.send(error(500, e.message))
    }
}

const getDoctorsAndStatffData = async(req, res) => {
    const {hosp_id} = req.params
    try {
        const doctors = await Doctor.find({hospitalId: hosp_id});
        const staffData = await staff.find({hospoitalId: hosp_id});
        return res.send(success(200, { doctors, staffData }))
    } catch (e) {
       return res.send(error(500, e.message))
    }
}

export { masterCreation, getMasterUserDataController, getDoctorsAndStatffData }

