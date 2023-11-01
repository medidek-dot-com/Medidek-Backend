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
    imgurl
  } = req.body
  const file = req.file


  if (!nameOfTheDoctor || !qulification || !speciality
    || !yearOfExprience || !connsultationFee || !email || !phone
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
      phone
    }, { new: true });
    data.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + data.img
    await data.save();
    console.log("request coming from db");
    res.send(success(200, data));

  } catch (error) {
    res.status(500).send(error)
  }
}


const multipleloginprofile = async (req, res) => {
  const { doctorid } = req.body;
  const alldocts = await Doctor.find({ doctorid });
  for (let doctor of alldocts) {
    doctor.imgurl = await getObjectSignedUrl(doctor.img)
  }
  return res.send(alldocts);
}


export { editDoctorfile, multipleloginprofile }

