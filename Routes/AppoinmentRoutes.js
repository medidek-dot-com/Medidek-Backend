import express from 'express'
import { getAppoinmentForDoctorInHospital ,AppointmentCreation ,Instantbooking, getAppointmentForPatient, updateAppointment, getCancelAppointmentForPatient, updateUserAppointmentStatus, getPendingAppointmentsForHospitalAndDoctors, getCompleteAppointmentsForHospitalAndDoctors, getAllAppointmentsForPerticularHospital, getPendingAppointmentsForHospital, getCompleteAppointmentsForHospital, getMissedAppointmentsForHospital, getCompletedAppointmentForPatient, createAppointmentByHospitals, getPendingAppointmentForPatient, getMissedAppointmentsForHospitalAndDoctors} from '../Controller/UserAppointment.js';
import { requireUser } from '../Middleware/requireUser.js';
import { requirePatient } from '../Middleware/requirePatient.js';
const Appointment = express.Router();


 Appointment.get('/getAllAppointmentsForPerticularHospital/:hosep_id', getAllAppointmentsForPerticularHospital)

 Appointment.get('/getCompleteAppointmentsForHospital/:hosep_id', getCompleteAppointmentsForHospital)


 Appointment.get('/getMissedAppointmentsForHospital/:hosep_id', getMissedAppointmentsForHospital)




 Appointment.get('/getAppoinmentForDoctorInHospital/:hosep_id/:doctor_id', requireUser, getAppoinmentForDoctorInHospital)





 Appointment.get('/getPendingAppointmentsForHospital/:hosep_id', requireUser, getPendingAppointmentsForHospital)




 Appointment.get('/getPendingAppointmentsForHospitalAndDoctors/:hosep_id/:doctor_id', requireUser, getPendingAppointmentsForHospitalAndDoctors)



 Appointment.get('/getCompleteAppointmentsForHospitalAndDoctors/:hosep_id/:doctor_id', requireUser, getCompleteAppointmentsForHospitalAndDoctors)
 Appointment.get('/getMissedAppointmentsForHospitalAndDoctors/:hosep_id/:doctor_id', requireUser, getMissedAppointmentsForHospitalAndDoctors)



 Appointment.post('/createAppoinment', AppointmentCreation) 

 Appointment.post('/createAppointmentByHospitals', requireUser, createAppointmentByHospitals)


 Appointment.post('/instantcreateAppoinment', requireUser, Instantbooking)


 Appointment.get('/getPatientAppointment/:Patient_id', requireUser, getAppointmentForPatient)

 //Abhay Made this Api for website
 Appointment.get('/getPendingAppointmentForPatient/:Patient_id', requireUser, getPendingAppointmentForPatient)
//end

 Appointment.put("/updateUserAppointment/:id", requireUser, updateAppointment)
 
 Appointment.put('/updateUserAppointmentStatus/:Patient_id', requireUser, updateUserAppointmentStatus)

 
 Appointment.get("/getCancelAppointment/:Patient_id", requireUser, getCancelAppointmentForPatient)
 Appointment.get("/getCompletedAppointment/:Patient_id",getCompletedAppointmentForPatient)






 export {Appointment}