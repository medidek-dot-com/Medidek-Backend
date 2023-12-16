
import mongoose from "mongoose";
const MasterShema = new mongoose.Schema({
    courseName: { type: String },
    image: { type: String },
    courseDiscription: { type: String },
    courseDuration: { type: String },
    courseEligiblity: { type: String },
    courseFee: { type: String }
})

const course = mongoose.model("course", MasterShema)

export { course }



