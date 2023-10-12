import mongoose from "mongoose";


const MasterShema = new mongoose.Schema({
    email:{
        type:String,
        // required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        // required:true
    },
    nameOfhospitalOrClinic: { type: String },
    hospitalType: { type: String, },
    location: { type: String },
    landmark: { type: String },
    enterFullAddress: { type: String },
    img: { type: String },
    role:{type: String, default: "MASTER"},
    // enterHospitalId:{type:String},
    createddate: { type: Date, default: Date.now() }

})


const Master = mongoose.model("Master", MasterShema)

export { Master }


