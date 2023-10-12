
import mongoose from "mongoose";
const MasterShema =new mongoose.Schema({
    name :{type:String },
    phone:{type:String,},
    enterEmailId:{type:String},
    masseage:{type:String},
    // connsultationFee:{type:String}, 
})

const contact= mongoose.model("contact",MasterShema)

export {contact}



