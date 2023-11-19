import { getObjectSignedUrl, uploadFile } from "../Middleware/s3.js";
import {MedicalHistory } from "../Models/Records.js"
import { error, success } from "../Utils/responseWrapper.js"
import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

  

const RecordCreation = async (req, res) => {
    try {
        const {id} =req.params;
        const file =req.file;
        const imageName = file ?  generateFileName() : "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061";
        const fileBuffer = file?.buffer;
        if(fileBuffer){
            await uploadFile(fileBuffer, imageName, file.mimetype)
          }
        let data = await MedicalHistory.create({userid:id,img:imageName})
        if(data.img){
            data.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + data.img
            await data.save();
          }
        res.send(
            success(201, data))
    } catch (e) {
      res.send(
            error(500, e.masseage))
    }
}


const getRecordforPatient = async (req, res) => {
    try {
        let result = await MedicalHistory.findById(req.params.id)
        res.send(
            success(201, result))
    } catch (e) {
      res.send(
            error(500, e))
    }
}









export { RecordCreation , getRecordforPatient }

