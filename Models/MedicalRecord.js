
import mongoose from "mongoose";
const MasterShema =new mongoose.Schema({
    medicalImg :{type:String },
    name:{type:String},
    medicalRecordName:{type:String},
    // connsultationFee:{type:String}, 
    createdDate:{type:Date, default: Date.now()},
})

const MedicalRecord= mongoose.model("MedicalRecord",MasterShema)

export {MedicalRecord}



