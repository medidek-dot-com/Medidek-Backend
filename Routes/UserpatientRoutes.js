

import express from 'express'
import { UserCreation, getAllUser, ResetPassword, FindbyUserNameAndPassoword, varifyOtpAndSignUpPatientController, getSinglePetient, updateUserpatientByyApp, updateUserpatientPasswordByyApp, sendOtpForResetPassword, varifyOtpForResetPassword, usersignup, usersignin, userpasswordupdated, userforgotpassword, isUserExist, usergetalldoctors, changepassword, userprofileupdate } from '../Controller/Userpatient.js';
import { requireUser } from '../Middleware/requireUser.js'
import { requirePatient } from '../Middleware/requirePatient.js';
// import { upload } from '../Multer/petientImgConfig.js';
import multer from "multer";
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const userCreationRouter = express.Router();

userCreationRouter.put('/changepassword/:id', requireUser, changepassword);
// userCreationRouter.put('/updateuserpatient/:id', requirePatient, upload.single("img"), updateUserpatient)
userCreationRouter.put('/updateuserpatient/:id', requireUser, upload.single("image"), userprofileupdate);

userCreationRouter.post('/isUserExist', isUserExist)

userCreationRouter.post('/userCreation', usersignup)

userCreationRouter.post('/userVarify', varifyOtpAndSignUpPatientController)
userCreationRouter.post('/sendOtpForResetPassword', sendOtpForResetPassword)
userCreationRouter.post('/varifyOtpForResetPassword', varifyOtpForResetPassword)
userCreationRouter.put('/ResetPassword/:id', ResetPassword)
userCreationRouter.get('/getAllUser', requirePatient, getAllUser)
userCreationRouter.get('/getSinglePetient/:id', requirePatient, getSinglePetient)
userCreationRouter.post('/FindUserByNameAndPassword', usersignin)

userCreationRouter.post('/userpasswordupdated', userpasswordupdated)
userCreationRouter.post('/forgotpassword', userforgotpassword)
userCreationRouter.get("/getalldoctors", usergetalldoctors)

// for the native
userCreationRouter.put('/updateUserpatientByapp/:id', updateUserpatientByyApp)
userCreationRouter.put('/updateUserpatientPasswordByapp/:id', updateUserpatientPasswordByyApp)


userCreationRouter.get('/getusergetalldoctors', usergetalldoctors)






export { userCreationRouter } 