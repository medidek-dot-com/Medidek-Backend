import { Record } from "../Models/Records.js"
import { error, success } from "../Utils/responseWrapper.js"
import  express  from "express";
// import  cloudinary  from 'cloudinary/lib/v2';


const RecordCreation = async (req, res) => {
    try {
        const image=req.file.filename
        let result = await Record.create({...req.body,image:image})
        res.send(
            success(201, result))
    } catch (e) {
      res.send(
            error(500, e.masseage))
    }
}


const getRecordforPatient = async (req, res) => {
    try {
        let result = await Record.findById(req.params.id)
        res.send(
            success(201, result))
    } catch (e) {
      res.send(
            error(500, e))
    }
}









export { RecordCreation , getRecordforPatient }

