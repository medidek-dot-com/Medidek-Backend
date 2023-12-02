import { Doctor } from "../Models/AddDoctors.js";
import { error, success } from "../Utils/responseWrapper.js";
import { uploadFile, getObjectSignedUrl } from '../Middleware/s3.js';
import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");




const editDoctorfile = async (req, res) => {
  const { id } = req.params;
  const {
    nameOfTheDoctor,
    qulification,
    speciality,
    yearOfExprience,
    connsultationFee,
    category1,
    category2,
    category3,
    category4,
    description,
    email,
    phone,
    acceptAppointments,
    imgurl,
    location
  } = req.body
  const file = req.file
  console.log("this is file", file)

  console.log("doctori profile", location)


  if (!nameOfTheDoctor || !qulification || !speciality
    || !yearOfExprience || !connsultationFee || !email || !phone || !acceptAppointments || !location
  ) {
    return res.send(error(500, { msg: "pls filled all field" }));
  }
  const imageName = file ? generateFileName() : imgurl;
  const fileBuffer = file?.buffer;

  try {
    if (fileBuffer) {
      await uploadFile(fileBuffer, imageName, file.mimetype)
    }
    const data = await Doctor.findByIdAndUpdate({ _id: id }, {
      nameOfTheDoctor,
      qulification,
      speciality,
      yearOfExprience,
      connsultationFee,
      img: imageName,
      category1,
      category2,
      category3,
      category4,
      description,
      email,
      phone,
      acceptAppointments,
      location
    }, { new: true });
    data.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + data.img
    await data.save();
    console.log("request coming from db");
    res.send(success(200, data));

  } catch (e) {
    res.send(error(500, e.message));
  }
}


const multipleloginprofile = async (req, res) => {
  const { doctorid } = req.params;
  if (!doctorid) {
    return res.send(error(400, "Pls give doctor id"));
  }
  try {
    const alldocts = await Doctor.find({ doctorid }).populate("hospitalId")
    for (let doctor of alldocts) {
      doctor.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + doctor.img
    }
    return res.send(success(200, alldocts));
  } catch (e) {
    return res.send(error(500, e.message))
  }

}

const acceptAppointmentBySlotEditController = async (req, res) => {
  const { id } = req.params
  const { acceptAppointmentBySlot } = req.body

  try {
    const doctor = await Doctor.findByIdAndUpdate({ _id: id }, { acceptAppointmentBySlot }, { new: true })

    return res.send(success(200, doctor))

  } catch (e) {
    return res.send(error(500, e.message))
  }

}
const acceptAppointmentByTokenEditController = async (req, res) => {
  const { id } = req.params
  const { acceptAppointmentByToken } = req.body

  try {
    const doctor = await Doctor.findByIdAndUpdate({ _id: id }, { acceptAppointmentByToken }, { new: true })

    return res.send(success(200, doctor))

  } catch (e) {
    return res.send(error(500, e.message))
  }

}





export { editDoctorfile, multipleloginprofile, acceptAppointmentBySlotEditController, acceptAppointmentByTokenEditController }

