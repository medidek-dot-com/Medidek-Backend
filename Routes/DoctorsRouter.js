import express from 'express'
import { editDoctorfile, multipleloginprofile} from '../Controller/DoctorController.js';
const Router = express.Router();
import {requireUser} from '../Middleware/requireUser.js'
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

Router.put('/editDoctorfile/:id',requireUser,upload.single("image"),editDoctorfile);
Router.get("/multipleloginprofile/:doctorid",requireUser,multipleloginprofile);


 export {Router}