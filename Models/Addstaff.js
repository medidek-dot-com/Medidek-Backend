
import mongoose from "mongoose";
const MasterShema =new mongoose.Schema({
    nameOfStaff :{type:String },
    gender: { type: String, default: 'Female' },
    designation:{type:String,},
    enterEmailId:{type:String},
    enterPhoneNo:{type:String},
    password:{type:String},
    hospitalId:{type:String},
    img:{type:String},
    status:{type:String, default: 'ACTIVE'}
    // connsultationFee:{type:String}, 
})

const staff= mongoose.model("staff",MasterShema)

export {staff}



