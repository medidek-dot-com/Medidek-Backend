import mongoose from "mongoose";
const Appointment = new mongoose.Schema({
    doctorid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userpatient"
    },
    name: {
        type: String,
        default: "name"
    },
    age: {
        type: Number,
        default: 9189214567
    },
    gender: {
        type: String,
        default: "Gender"
    },
    phone: {
        type: Number,
        default: 9189214567
    },
    AppointmentNotes: {
        type: String,
        default: "Notes",
    },
    appointmentDate: {
        type: Date,
    },
    AppointmentTime: {
        type: String,
    },
    // isbookbytoken:{
    //   type:Boolean,
    //   default:false
    // },
    status:
    {
        type: String,
        default: "pending"
    },
})

const AppointmentModel = mongoose.model("Appointment", Appointment);
export { AppointmentModel }