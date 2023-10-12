

import express from 'express'
import { UserCreation ,getAllUser,ResetPassword ,updateUserpatient ,FindbyUserNameAndPassoword, varifyOtpAndSignUpPatientController, getSinglePetient, updateUserpatientByyApp, updateUserpatientPasswordByyApp, sendOtpForResetPassword, varifyOtpForResetPassword } from '../Controller/Userpatient.js';
import {requireUser} from '../Middleware/requireUser.js'
import { requirePatient } from '../Middleware/requirePatient.js';
// import { upload } from '../Multer/petientImgConfig.js';
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const userCreationRouter = express.Router();

userCreationRouter.post('/userCreation', UserCreation)
userCreationRouter.post('/userVarify', varifyOtpAndSignUpPatientController)
userCreationRouter.post('/sendOtpForResetPassword', sendOtpForResetPassword)
userCreationRouter.post('/varifyOtpForResetPassword', varifyOtpForResetPassword)
userCreationRouter.put('/ResetPassword/:id',ResetPassword )
userCreationRouter.get('/getAllUser',requirePatient, getAllUser)
userCreationRouter.get('/getSinglePetient/:id', requirePatient, getSinglePetient)
userCreationRouter.put('/updateuserpatient/:id',requirePatient, upload.single("img"), updateUserpatient )
userCreationRouter.post('/FindUserByNameAndPassword', FindbyUserNameAndPassoword)

// for the native
userCreationRouter.put('/updateUserpatientByapp/:id', updateUserpatientByyApp)
userCreationRouter.put('/updateUserpatientPasswordByapp/:id', updateUserpatientPasswordByyApp)




 export {userCreationRouter} 