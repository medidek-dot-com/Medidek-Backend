import express from 'express';
import { addDoctor, getAllDoctors } from '../Controller/Admindoctor.js';
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const admindoctorRouter = express.Router();

admindoctorRouter.get('/getAllDoctors', getAllDoctors)
admindoctorRouter.post('/addDoctor', upload.single("image"), addDoctor)

export { admindoctorRouter }