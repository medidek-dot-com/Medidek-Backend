import mongoose from "mongoose";


const MasterShema = new mongoose.Schema({
    nameOfTheDoctor: { type: String },
    qulification: { type: String, },
    gender: { type: String, default: 'Male' },
    speciality: { type: String },
    yearOfExprience: { type: String },
    enterEmailId: { type: String },
    enterPhoneNo: { type: String },
    password: { type: String},
    connsultationFee: { type: String },
    consultingTime: { type: String },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref:'Master' },
    doctorImg: { type: String },
    location: { type: String },
    uniqueIdentifier_doctor_id: { type: String },
    createddate: { type: Date, default: Date.now() },
    status: { type: String, default: 'ACTIVE' },
    role: { type: String, default: "DOCTOR" },
    reviews:[{  type: mongoose.Schema.Types.ObjectId, ref:'Review'}]

})

const Doctor = mongoose.model("Doctor", MasterShema)

export { Doctor }



