import mongoose from "mongoose";


const MasterShema =new mongoose.Schema({
    name :{type:String },
    email:{type:String},
    dateOfBirth:{type:String},
    phone:{type:String},
    img:{type:String},
    password:{type:String},
    createdDate:{type:Date, default: Date.now()},
    location:{type:String, default: "Nagpur"},
    role:{type: String, default: "PETIEN"},
    medicalRecord:[{  type: mongoose.Schema.Types.ObjectId, ref:'MedicalRecord'}]

    
})
const userpatient= mongoose.model("userpatient",MasterShema)
export {userpatient}


