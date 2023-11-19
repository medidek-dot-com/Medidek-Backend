import express from "express"
import { requireUser } from "../Middleware/requireUser.js";
const TokenRouter = express.Router();
import { createToken, getToken } from "../Controller/TokenController.js"
import { createAppointmnt, updateAppointmnt } from "../Controller/Appointment.js";

TokenRouter.post("/creatTokenForDoctor", requireUser, createToken);
TokenRouter.post("/bookAppointment", requireUser, createAppointmnt);
TokenRouter.put("/editAppointment/:appointmentId", requireUser, updateAppointmnt);
TokenRouter.get("/getAppointmentByTokenSlotDetailForDoctorForPerticularDate/:doctorid/:date", requireUser, getToken);
// slotRouter.get("/slot", getslot);
// slotRouter.get("/userslot", userslot);

export { TokenRouter }
