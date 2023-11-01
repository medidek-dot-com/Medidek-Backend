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
    phone:{
        type:String,
        unique:true,
    },
    nameOfhospitalOrClinic: { type: String },
    hospitalType: { type: String, },
    location: { type: String },
    landmark: { type: String },
    enterFullAddress: { type: String },
    img: { type: String,default:"6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061" },
    role:{type: String, default: "MASTER"},
    // enterHospitalId:{type:String},
    createddate: { type: Date, default: Date.now() },
    imgurl :{
        type:String,
    }
})


const Master = mongoose.model("Master", MasterShema)

export { Master }



