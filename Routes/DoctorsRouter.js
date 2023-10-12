

import express from 'express'
import { doctorCreation,doctorSignInApi,getDoctorForHospital ,getSingleDoctor,removeDoctor, updateDoctorStatusToRemove, editDoctorProfile, ResetPassword } from '../Controller/DoctorController.js';
const Router = express.Router();
import {requireUser} from '../Middleware/requireUser.js'
import { upload } from '../Multer/doctorImgConfig.js';

Router.post('/addDoctor', upload.single("doctorImg"), doctorCreation)
Router.post('/signinDoctor', doctorSignInApi)
Router.put('/changePasswordForDoctor/:id', ResetPassword)
Router.get('/getDoctorsforHospital/:hosp_id', requireUser, getDoctorForHospital)
Router.get('/getSingleDoctor/:id', getSingleDoctor)
Router.put('/editDoctorProfile/:id', upload.single("doctorImg"), editDoctorProfile)
Router.put('/updateDoctorStatusToRemove/:id', updateDoctorStatusToRemove)
Router.delete('/removeDoctor/:id', removeDoctor)


 export {Router} 