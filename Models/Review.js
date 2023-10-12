
import mongoose from "mongoose";
const MasterShema =new mongoose.Schema({
    name:{type:String },
    doctorId:{type:String,default:"Document"},
    rating:{type:String},
    masseage:{type:String},
    // connsultationFee:{type:String}, 
    createddate:{type:Date, default: Date.now()}
})

const Review= mongoose.model("Review",MasterShema)

export {Review}



