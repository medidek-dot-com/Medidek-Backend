import express from "express"
import { requireUser } from "../Middleware/requireUser.js";
const TokenRouter = express.Router();
import { createToken, getToken } from "../Controller/TokenController.js"
import { createAppointmnt } from "../Controller/Appointment.js";

TokenRouter.post("/creatTokenForDoctor", requireUser, createToken);
TokenRouter.post("/bookAppointment", requireUser, createAppointmnt);
TokenRouter.get("/getAppointmentByTokenSlotDetailForDoctorForPerticularDate/:doctorid/:date", requireUser, getToken);
// slotRouter.get("/slot", getslot);
// slotRouter.get("/userslot", userslot);

export { TokenRouter }