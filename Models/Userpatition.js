import mongoose from "mongoose";


const MasterShema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    dateOfBirth: { type: String },
    phone: { type: String },
    img: {
        type: String,
        default: "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061",
    },
    password: { type: String },
    createdDate: { type: Date, default: Date.now() },
    location: { type: String, default: "Nagpur" },
    role: { type: String, default: "PATIENT" },
    imgurl: {
        type: String,
        default: "url"
    },
    gender: { type: String },
    medicalRecord: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' }]


})
const userpatient = mongoose.model("userpatient", MasterShema)
export { userpatient }



