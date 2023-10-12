
import mongoose from "mongoose";
const MasterShema =new mongoose.Schema({
    patitionId:{type:String },
    documentName:{type:String,default:"Document"},
    image:{type:String},
    // connsultationFee:{type:String}, 
    createddate:{type:Date, default: Date.now()}
})

const Record= mongoose.model("Record",MasterShema)

export {Record}



