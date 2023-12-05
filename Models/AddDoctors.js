import mongoose from "mongoose";


const MasterShema = new mongoose.Schema({
    nameOfTheDoctor: { type: String },
    qulification: { type: String, },
    speciality: { type: String },
    yearOfExprience:
        { type: Number },
    email: {
        type: String,
        required: true,
    },
    phone:
    {
        type: Number,
        min: 10,
        required: true,
    },
    password: {
        type: String,
    },
    connsultationFee: {
        type: Number
    },
    location: {
        type: String,
        default: null
    },
    hospitalId:
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'Master',
        default: "6531c8f389aee1b3fbd0a2d7"
    },
    img: {
        type: String,
        default: "76f4617430e7b5acdffae2580adbd8b1f1fd12ca15e09d261915f6e5c6b7a115",
    },
    category1: {
        type: String,
        required: true,
        default: "None"
    },
    category2: {
        type: String,
        required: true,
        default: "None"
    },
    category3: {
        type: String,
        required: true,
        default: "None"
    },
    category4: {
        type: String,
        required: true,
        default: "None"
    },
    description: {
        type: String,
        required: true,
        default: "description"
    },
    createddate: { type: Date, default: Date.now() },
    status: { type: String, default: 'ACTIVE' },
    role: { type: String, default: "DOCTOR" },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    doctorid: {
        type: Number,
        required: true,
    },
    imgurl: {
        type: String,
        default: "url"
    },
    acceptAppointments: {
        type: String,
        required: true,
        default: "byToken"
    },
    // acceptAppointmentByToken: {
    //     type: Boolean,
    //     default: false
    // },

})

const Doctor = mongoose.model("Doctor", MasterShema)

export { Doctor }



