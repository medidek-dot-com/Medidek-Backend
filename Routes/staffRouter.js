import express from 'express'
import { staffCreation ,getStaff, updateStaffStatusToRemove, updateStaffProfile } from '../Controller/AddStaff.js';
import { requireUser } from '../Middleware/requireUser.js';
import { upload } from '../Multer/staffImgConfig.js';
const Staff = express.Router();

Staff.post('/staff', requireUser, upload.single("img"), staffCreation)
Staff.put('/updateStaffProfile/:staffId', requireUser, upload.single("img"), updateStaffProfile)
Staff.put('/updateStaffStatusToRemove/:staffId',  updateStaffStatusToRemove)
// Staff.get('/getstaffForHospital/:staffId', requireUser, getstaffForHospital)
Staff.get('/getstaff/:id', getStaff)

 export {Staff} 