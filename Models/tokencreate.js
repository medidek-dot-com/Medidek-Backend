import mongoose from "mongoose";
const AppointmentToken  = new mongoose.Schema({
        Doctorid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Doctor"
        },
        userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"userpatient"
        },
        name:{
            type:String,
            default:"name"
        },
        Age:{
            type:Number,
            default:9189214567
        },
        Gender:{
            type:String,
            default:"Gender"
        },
        Mobile:{
            type:Number,
            default:9189214567
        },
        AppointmentNotes:{
            type:String,
            default:"Notes",
        },
        AppointmentDate:{
            type:Date,
        },
        token:{
            type:String,
        },
        // AppointmentTime:{
        //     type:String,
        // },
        // isbookbytoken:{
        //   type:String,
        //   default:false
        // },
       status:
        {
                type:String,
                default:"pending"
        },
})
const AppointmentTokenModel = mongoose.model("Appointment",AppointmentToken);
export {AppointmentTokenModel}