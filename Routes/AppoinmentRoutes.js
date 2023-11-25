import express from 'express'
import { getAppoinmentForDoctorInHospital, AppointmentCreation, Instantbooking, getAppointmentForPatient, updateAppointment, getCancelAppointmentForPatient, updateUserAppointmentStatus, getPendingAppointmentsForHospitalAndDoctors, getCompleteAppointmentsForHospitalAndDoctors, getAllAppointmentsForPerticularHospital, getPendingAppointmentsForHospital, getCompleteAppointmentsForHospital, getMissedAppointmentsForHospital, getCompletedAppointmentForPatient, createAppointmentByHospitals, getPendingAppointmentForPatient, getMissedAppointmentsForHospitalAndDoctors } from '../Controller/UserAppointment.js';
import { requireUser } from '../Middleware/requireUser.js';
import { requirePatient } from '../Middleware/requirePatient.js';
import { getUpcomingAppointmentForAnUser, getCompletedAppointmentsForAnUser, getMissedAppointmentsForAnUser, getallappointmentofdoctor, getAllPendingAppointmentOfDoctor, getAllCompletedAppointmentOfDoctor, getAllMissedAppointmentOfDoctor, changeappointmentstatus, getsingleappointmentbyid, Appointmentstatusinpercentage, TodayAppointment, Totalapatient, Futureappointment, getallappointmentsforparticularhospitalidpending, getallappointmentsforparticularhospitalidcompleted, getallappointmentsforparticularhospitalidmissed } from '../Controller/Appointment.js';
const Appointment = express.Router();







Appointment.get('/getAllAppointmentsForPerticularHospital/:hospitalid/:date', getallappointmentsforparticularhospitalidpending)

Appointment.get('/getCompleteAppointmentsForHospital/:hospitalid/:date', getallappointmentsforparticularhospitalidcompleted)


Appointment.get('/getMissedAppointmentsForHospital/:hospitalid/:date',
    getallappointmentsforparticularhospitalidmissed)











//Integreted in website on 10-11-2023 (from here)
// Get All pending Appointments for Doctor
Appointment.get('/getPendingAppoinmentForDoctor/:doctorid/:date', requireUser, getAllPendingAppointmentOfDoctor)

// Get All pending Appointments for Doctor
Appointment.get('/getCompletedAppoinmentForDoctor/:doctorid/:date', requireUser, getAllCompletedAppointmentOfDoctor)

// Get All Missed Appointments for Doctor
Appointment.get('/getMissedAppoinmentForDoctor/:doctorid/:date', requireUser, getAllMissedAppointmentOfDoctor)


//(To here)

// Pi chart Api rout here
Appointment.get('/getPiChartData/:doctorid/:date/piChart', requireUser, Appointmentstatusinpercentage)

//Today's Appointments Route
Appointment.get('/todaysAppointement/:doctorid/:date/:todaysAppointment', requireUser, TodayAppointment)

//Total petient Route
Appointment.get('/totalPatient/:doctorid/:date/totalPatient', requireUser, Totalapatient)

//Future Appointments Route
Appointment.get('/futureAppointment/:doctorid/futureAppointment', requireUser, Futureappointment)


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
Appointment.get('/getPendingAppointmentForDoctor/:doctorid', requireUser, getUpcomingAppointmentForAnUser)

// 2. Get All completed appointments for perticular patient

Appointment.get("/getCompletedAppointment/:Patient_id", requireUser, getCompletedAppointmentsForAnUser)


// 3. Get All Missed appointments for perticular patient

Appointment.get("/getMissedAppointment/:Patient_id", requireUser, getMissedAppointmentsForAnUser)

Appointment.get("/getsingleappointmentbyid/:appointmentId/:status", requireUser, getsingleappointmentbyid)


Appointment.put("/updateUserAppointment/:id", requireUser, updateAppointment)

Appointment.put('/updateUserAppointmentStatus/:id', requireUser, changeappointmentstatus)


Appointment.get("/getCancelAppointment/:Patient_id", requireUser, getCancelAppointmentForPatient)








export { Appointment }