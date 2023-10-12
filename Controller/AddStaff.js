


import { staff } from "../Models/Addstaff.js";
import { error, success } from "../Utils/responseWrapper.js";

const staffCreation = async (req, res) => {
    const file = req.file.filename
    const {
        nameOfStaff,
        designation,
        enterEmailId,
        enterPhoneNo,
        hospoitalId,
    } = req.body
    try {
        let result = await staff.create({
            nameOfStaff,
            designation,
            enterEmailId,
            enterPhoneNo,
            hospoitalId,
            img: file
        })
        return res.send(
            success(201, result))
    } catch (e) {
        return res.send(
            error(500, e.message))
    }
}
const updateStaffProfile = async (req, res) => {
    const { staffId } = req.params
    const {
        nameOfStaff,
        designation,
        enterEmailId,
        enterPhoneNo,
        hospoitalId,
        img
    } = req.body
    const file = req.file ? req.file.filename : img
    try {
        let result = await staff.findByIdAndUpdate({ _id: staffId }, {
            nameOfStaff,
            designation,
            enterEmailId,
            enterPhoneNo,
            hospoitalId,
            img: file
        })
        return res.send(
            success(201, result))
    } catch (e) {
        return res.send(
            error(500, e.message))
    }
}



const getStaff = async (req, res) => {
    const search = req.query.search || ""
    const query = {
        hospitalId: req.params.hosp_id,
        status: 'ACTIVE',
        nameOfStaff: { $regex: search, $options: "i" }
    }
    try {
        let result = await staff.find(query)
        return res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}

const updateStaffStatusToRemove = async (req, res) => {
    const { staffId } = req.params
    const { status } = req.body

    try {
        const result = await staff.findByIdAndUpdate({ _id: staffId }, { status }, { new: true })
        return res.send(success(200, result))
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
export { staffCreation, getStaff, updateStaffStatusToRemove, updateStaffProfile }

