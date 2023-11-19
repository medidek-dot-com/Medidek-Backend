
import mongoose from "mongoose";
const MedicalHistorySchema =new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userpatient"
    },
    img: { type: String,
        default:"6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061",
    },
    imgurl :{
        type:String,
        default:"url"
    },
    createddate:{type:Date, default: Date.now()}
})

const MedicalHistory= mongoose.model("MedicalHistory",MedicalHistorySchema)

export {MedicalHistory}



