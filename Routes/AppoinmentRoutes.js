import express from 'express'
import { getAppoinmentForDoctorInHospital, AppointmentCreation, Instantbooking, getAppointmentForPatient, updateAppointment, getCancelAppointmentForPatient, updateUserAppointmentStatus, getPendingAppointmentsForHospitalAndDoctors, getCompleteAppointmentsForHospitalAndDoctors, getAllAppointmentsForPerticularHospital, getPendingAppointmentsForHospital, getCompleteAppointmentsForHospital, getMissedAppointmentsForHospital, getCompletedAppointmentForPatient, createAppointmentByHospitals, getPendingAppointmentForPatient, getMissedAppointmentsForHospitalAndDoctors } from '../Controller/UserAppointment.js';
import { requireUser } from '../Middleware/requireUser.js';
import { requirePatient } from '../Middleware/requirePatient.js';
import { getUpcomingAppointmentForAnUser, getCompletedAppointmentsForAnUser, getMissedAppointmentsForAnUser, getallappointmentofdoctor, getAllPendingAppointmentOfDoctor, getAllCompletedAppointmentOfDoctor, getAllMissedAppointmentOfDoctor } from '../Controller/Appointment.js';
const Appointment = express.Router();


Appointment.get('/getAllAppointmentsForPerticularHospital/:hosep_id', getAllAppointmentsForPerticularHospital)

Appointment.get('/getCompleteAppointmentsForHospital/:hosep_id', getCompleteAppointmentsForHospital)


Appointment.get('/getMissedAppointmentsForHospital/:hosep_id', getMissedAppointmentsForHospital)


//Integreted in website on 10-11-2023 (from here)
// Get All pending Appointments for Doctor
Appointment.get('/getPendingAppoinmentForDoctor/:doctorid/:date', requireUser, getAllPendingAppointmentOfDoctor)

// Get All pending Appointments for Doctor
Appointment.get('/getCompletedAppoinmentForDoctor/:doctorid', requireUser, getAllCompletedAppointmentOfDoctor)

// Get All Missed Appointments for Doctor
Appointment.get('/getMissedAppoinmentForDoctor/:doctorid', requireUser, getAllMissedAppointmentOfDoctor)


//(To here)


Appointment.get('/getPendingAppointmentsForHospital/:hosep_id', requireUser, getPendingAppointmentsForHospital)




Appointment.get('/getPendingAppointmentsForHospitalAndDoctors/:hosep_id/:doctor_id', requireUser, getPendingAppointmentsForHospitalAndDoctors)



Appointment.get('/getCompleteAppointmentsForHospitalAndDoctors/:hosep_id/:doctor_id', requireUser, getCompleteAppointmentsForHospitalAndDoctors)
Appointment.get('/getMissedAppointmentsForHospitalAndDoctors/:hosep_id/:doctor_id', requireUser, getMissedAppointmentsForHospitalAndDoctors)



Appointment.post('/createAppoinment', AppointmentCreation)

Appointment.post('/createAppointmentByHospitals', requireUser, createAppointmentByHospitals)


Appointment.post('/instantcreateAppoinment', requireUser, Instantbooking)


Appointment.get('/getPatientAppointment/:Patient_id', requireUser, getAppointmentForPatient)

//Abhay Made this Api for website
//From here all appointments apis for patient only

// 1. Get All pending appointments for perticular patient
Appointment.get('/getPendingAppointmentForPatient/:Patient_id', requireUser, getUpcomingAppointmentForAnUser)

// 2. Get All completed appointments for perticular patient

Appointment.get("/getCompletedAppointment/:Patient_id", requireUser, getCompletedAppointmentsForAnUser)


// 3. Get All Missed appointments for perticular patient

Appointment.get("/getMissedAppointment/:Patient_id", requireUser, getMissedAppointmentsForAnUser)


Appointment.put("/updateUserAppointment/:id", requireUser, updateAppointment)

Appointment.put('/updateUserAppointmentStatus/:Patient_id', requireUser, updateUserAppointmentStatus)


Appointment.get("/getCancelAppointment/:Patient_id", requireUser, getCancelAppointmentForPatient)








export { Appointment }