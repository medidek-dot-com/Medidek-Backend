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
    hospitalId:
    {
        type: mongoose.Schema.Types.ObjectId, ref: 'Master',
        default: "6531c8f389aee1b3fbd0a2d7"
    },
    img: {
        type: String,
        default: "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061",
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



