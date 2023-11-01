
import mongoose from "mongoose";
const MasterShema =new mongoose.Schema({
    nameOfStaff :{type:String },
    gender: { type: String, default: 'Female' },
    designation:{type:String,},
    email:{type:String},
    phone:{type:String},
    hospitalId: 
    { type: mongoose.Schema.Types.ObjectId, ref:'Master',
},
    dob:{
        type:Date,
    },
    img:{
        type:String,
       default:"6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061",
    },
    imgurl:{
       type:String,
       default:"url",
    },
    status:{type:String, default: 'ACTIVE'}
    // connsultationFee:{type:String}, 
})

const staff= mongoose.model("staff",MasterShema)

export {staff}



