

import express from 'express'
import { usersignup, usersignin, userpasswordupdated, userforgotpassword, isUserExist, usergetalldoctors, changepassword, userprofileupdate,alldoctors } from '../Controller/Userpatient.js';
import { requireUser } from '../Middleware/requireUser.js'
import multer from "multer";
import { Searchdoctorbylocation, Searchdoctorbyuser } from '../Controller/searchcontroller.js';
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const userCreationRouter = express.Router();

userCreationRouter.put('/changepassword/:id', requireUser, changepassword);
userCreationRouter.put('/updateuserpatient/:id', requireUser, upload.single("image"), userprofileupdate);
userCreationRouter.post('/isUserExist', isUserExist)
userCreationRouter.post('/userCreation', usersignup)
userCreationRouter.post('/userpasswordupdated', userpasswordupdated)
userCreationRouter.get('/getusergetalldoctors', usergetalldoctors)
userCreationRouter.post('/FindUserByNameAndPassword', usersignin)
userCreationRouter.post('/forgotpassword', userforgotpassword)
userCreationRouter.get('/searchdoctor/:lat/:long', Searchdoctorbyuser)


userCreationRouter.post('/doctorsByLocation', Searchdoctorbylocation)
userCreationRouter.get('/alldoctors', alldoctors)


// userCreationRouter.get("/getalldoctors", usergetalldoctors)     







export { userCreationRouter } 


import express from 'express'
import { usersignup, usersignin, userpasswordupdated, userforgotpassword, isUserExist, usergetalldoctors, changepassword, userprofileupdate, findUserByEmailOrPhone, } from '../Controller/Userpatient.js';
import { requireUser } from '../Middleware/requireUser.js'
import multer from "multer";
import { Searchdoctorbylocation, Searchdoctorbyuser } from '../Controller/searchcontroller.js';
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const userCreationRouter = express.Router();

userCreationRouter.put('/changepassword/:id', requireUser, changepassword);
userCreationRouter.put('/updateuserpatient/:id', requireUser, upload.single("image"), userprofileupdate);
userCreationRouter.post('/isUserExist', isUserExist)
userCreationRouter.post('/userCreation', usersignup)
userCreationRouter.post('/userpasswordupdated', userpasswordupdated)
userCreationRouter.get('/getusergetalldoctors', usergetalldoctors)
userCreationRouter.post('/FindUserByNameAndPassword', usersignin)
userCreationRouter.post('/forgotpassword', userforgotpassword)
userCreationRouter.get('/searchdoctor/:lat/:long', Searchdoctorbyuser)

userCreationRouter.post('/findPatientByEmailOrPhone', findUserByEmailOrPhone);


userCreationRouter.post('/doctorsByLocation', Searchdoctorbylocation)
// userCreationRouter.get("/getalldoctors", usergetalldoctors)     







export { userCreationRouter } 