import express from 'express'
import { acceptAppointmentBySlotEditController, acceptAppointmentByTokenEditController, editDoctorfile, multipleloginprofile } from '../Controller/DoctorController.js';
const Router = express.Router();
import { requireUser } from '../Middleware/requireUser.js'
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

Router.put('/editDoctorfile/:id', requireUser, upload.single("image"), editDoctorfile);
Router.put('/editAcceptAppointmentBySlot/:id', requireUser, acceptAppointmentBySlotEditController);
Router.put('/editAcceptAppointmentByToken/:id', requireUser, acceptAppointmentByTokenEditController);
Router.get("/multipleloginprofile/:doctorid", requireUser, multipleloginprofile);


export { Router }