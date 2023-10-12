import express from 'express'
import { getMasterUserDataController, masterCreation, getDoctorsAndStatffData } from '../Controller/Master.js';
import { requireUser } from '../Middleware/requireUser.js';
import { upload } from '../Multer/hospitalImgConfig.js';
const masterRouter = express.Router();

masterRouter.put('/master/:id', requireUser, upload.single("img"), masterCreation)
masterRouter.get('/masterData', requireUser, getMasterUserDataController); 
masterRouter.get('/getDoctorsAndStatffData/:hosp_id', getDoctorsAndStatffData); 



 export {masterRouter} 