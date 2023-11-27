import { getObjectSignedUrl, uploadFile } from "../Middleware/s3.js";
import { Doctor } from "../Models/AddDoctors.js";
import { staff } from "../Models/Addstaff.js";
import { Master } from "../Models/Master.js";
import { error, success } from "../Utils/responseWrapper.js";
import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const hospitalprofileupdate = async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  const {
    nameOfhospitalOrClinic,
    hospitalType,
    location,
    landmark,
    enterFullAddress,
    imgurl
  } = req.body;


  if (
    !nameOfhospitalOrClinic ||
    !hospitalType ||
    !location ||
    !landmark ||
    !enterFullAddress
  ) {
    return res.send(error(409, "pls filled all field in given fields"));
  }
  const imageName = file ? generateFileName() : imgurl;
  const fileBuffer = file?.buffer;
  if (fileBuffer) {
    await uploadFile(fileBuffer, imageName, file.mimetype);
  }
  try {
    const data = await Master.findByIdAndUpdate(
      { _id: id },
      {
        nameOfhospitalOrClinic,
        hospitalType,
        location,
        landmark,
        enterFullAddress,
        img: imageName,
      },
      { new: true }
    ).select("-password")

    data.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + data.img
    await data.save();


    var hospid = data._id;
    const result = await Doctor.find({ hospitalId: hospid });
    for (let newloaction of result) {
      newloaction.location = data.location;
      await newloaction.save();
    }
    // await result.save();
    res.send(success(200, data));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const getdoctorbytheirid = async (req, res) => {
  const { doctorid, hospitalId } = req.body;
  if (!doctorid && !hospitalId) {
    return res.send(error(409, { msg: "pls give doctorid and hospitalid" }));
  }


  // let hospitalId = "5349b4ddd2781d08c09890f3";
  try {
    const isdoctoravailableinhospital = await Doctor.findOne({ $and: [{ doctorid }, { hospitalId }] })
    if (isdoctoravailableinhospital) {
      return res.send(error(403, "this doctor already available in your hospital"))
    }
    const doctorinfo = await Doctor.findOne({
      $and: [{ doctorid: doctorid }, { hospitalId: "6531c8f389aee1b3fbd0a2d7" }]
    });
    if (!doctorinfo) {
      return res.send(error(404, "Invalid doctor id"))
    }
    return res.send(success(200, doctorinfo));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const addDoctorbyhospital = async (req, res) => {
  const { hospitalid } = req.params;
  const file = req.file;
  const {
    nameOfTheDoctor,
    qulification,
    speciality,
    yearOfExprience,
    email,
    phone,
    connsultationFee,
    doctorid,
    imgurl,
    category1,
    category2,
    category3,
    category4,
    description,
    location
  } = req.body;

  if (
    !nameOfTheDoctor ||
    !qulification ||
    !speciality ||
    !yearOfExprience ||
    !email ||
    !phone ||
    !connsultationFee ||
    !doctorid ||
    !hospitalid ||
    !location
  ) {
    return res.send(error(401, "All fields are compulsory"));
  }

  try {
    const isdoctoravailableinhospital = await Doctor.findOne({ $and: [{ doctorid }, { hospitalId: hospitalid }] })
    if (isdoctoravailableinhospital) {
      return res.send(error(500, { msg: "this doctor already available in your hospital" }))
    }

    const isdoctoravailable = await Doctor.findOne({ doctorid });
    if (!isdoctoravailable) {
      return res.send(error(500, { msg: "This doctorid does not exist" }));
    }
    const imageName = file ? generateFileName() : imgurl;
    const fileBuffer = file?.buffer;
    if (fileBuffer) {
      await uploadFile(fileBuffer, imageName, file.mimetype);
    }
    if (isdoctoravailable) {
      const addDoctor = await Doctor.create({
        nameOfTheDoctor,
        qulification,
        speciality,
        yearOfExprience,
        email,
        phone,
        connsultationFee,
        hospitalId: hospitalid,
        img: imageName,
        doctorid,
        category1,
        category2,
        category3,
        category4,
        description,
        location
      });
      addDoctor.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + addDoctor.img
      return res.send(success(200, { addDoctor }));
    }

  } catch (e) {
    res.send(error(500, e.message));
  }
};

const getSingleDoctor = async (req, res) => {
  try {
    let result = await Doctor.findById(req.params.id).populate("reviews");
    await result.populate("reviews.userid");
    console.log(result);
    result.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + result.img

    res.send(success(201, result));
  } catch (e) {
    return res.send(error(500, e));
  }
};

const getSingleStaff = async (req, res) => {
  try {
    let result = await staff.findById(req.params.id);
    result.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + result.img
    res.send(success(201, result));
  } catch (error) {
    return res.send(error(500, e));
  }
};

const editDoctorbyhospital = async (req, res) => {
  const { hospitalid } = req.params;
  const file = req.file;
  const {
    nameOfTheDoctor,
    qulification,
    speciality,
    yearOfExprience,
    email,
    phone,
    password,
    connsultationFee,
    doctorid,
    category1,
    category2,
    category3,
    category4,
    description
  } = req.body;

  if (
    !nameOfTheDoctor ||
    !qulification ||
    !speciality ||
    !yearOfExprience ||
    !email ||
    !phone ||
    !password ||
    !connsultationFee ||
    !doctorid
  ) {
    return res.send(error(404, { msg: "All fields are compulsory" }));
  }
  try {
    const imageName = file ? generateFileName() : "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061";
    const fileBuffer = file?.buffer;
    if (fileBuffer) {
      await uploadFile(fileBuffer, imageName, file.mimetype);
    }

    const editDoctor = await Doctor.findOneAndUpdate(
      { $and: [{ doctorid }, { hospitalId: hospitalid }] },
      {
        nameOfTheDoctor,
        qulification,
        speciality,
        yearOfExprience,
        email,
        phone,
        password,
        connsultationFee,
        hospitalId: hospitalid,
        doctorid,
        img: imageName,
        category1,
        category2,
        category3,
        category4,
        description
      },
      { new: true }
    );

    editDoctor.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + editDoctor.img
    return res.send(success(200, { editDoctor }));
  } catch (error) {
    res.status(500).send({ error, status: "error", code: 500 });
  }
};

const AddStaff = async (req, res) => {
  const file = req.file;
  const {
    nameOfStaff,
    designation,
    email,
    phone,
    hospitalId,
    gender,
    // dob,
  } = req.body;
  console.log(req.body);
  if (
    !nameOfStaff ||
    !designation ||
    !email ||
    !phone ||
    !hospitalId ||
    !gender
    // !dob
  ) {
    return res.send(error(400, "pls filled all field"));
  }

  const imageName = file ? generateFileName() : "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061";
  const fileBuffer = file?.buffer;
  if (fileBuffer) {
    await uploadFile(fileBuffer, imageName, file.mimetype);
  }

  try {
    let result = await staff.create({
      gender,
      nameOfStaff,
      designation,
      email,
      phone,
      hospitalId,
      // dob,
      img: imageName,
    });
    result.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + result.img
    return res.send(success(201, result));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const editStaff = async (req, res) => {
  const file = req.file;
  const { id } = req.params;
  const {
    nameOfStaff,
    designation,
    email,
    phone,
    hospitalId,
    gender,
    dob,
  } = req.body;

  const imageName = file ? generateFileName() : "";
  const fileBuffer = file.buffer;
  await uploadFile(fileBuffer, imageName, file.mimetype);

  try {
    const result = await staff.findByIdAndUpdate(
      { _id: id },
      {
        nameOfStaff,
        designation,
        email,
        phone,
        hospitalId,
        gender,
        dob,
        img: imageName,
      },
      { new: true }
    );

    result.imgurl = await getObjectSignedUrl(result.img);
    return res.send(success(201, result));
  } catch (e) {
    return res.send(error(500, e));
  }
};

const alldoctorandstaffforhospital = async (req, res) => {
  const { hospid } = req.params;
  try {
    const alldoctors = await Doctor.find({ hospitalId: hospid });
    const allstaffs = await staff.find({ hospitalId: hospid });
    for (let doctor of alldoctors) {
      doctor.imgurl = await getObjectSignedUrl(doctor.img)
    }
    for (let staff of allstaffs) {
      staff.imgurl = await getObjectSignedUrl(staff.img)
    }
    // alldoctors.imgurl = await getObjectSignedUrl(alldoctors.img);
    // allstaffs.imgurl = await getObjectSignedUrl(allstaffs.img);
    return res.send(success(200, { alldoctors, allstaffs }));
  } catch (e) {
    res.send(error(e.message));
  }
};
const alldoctors = async (req, res) => {
  const { hospid } = req.params;
  try {
    const alldoctors = await Doctor.find({ hospitalId: hospid });
    for (let doctor of alldoctors) {
      doctor.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + doctor.img
    }
    // alldoctors.imgurl = await getObjectSignedUrl(alldoctors.img);
    // allstaffs.imgurl = await getObjectSignedUrl(allstaffs.img);
    return res.send(success(200, alldoctors));
  } catch (e) {
    res.send(error(e.message));
  }
};

export {
  getSingleStaff,
  hospitalprofileupdate,
  getdoctorbytheirid,
  addDoctorbyhospital,
  editDoctorbyhospital,
  AddStaff,
  editStaff,
  alldoctorandstaffforhospital,
  getSingleDoctor,
  alldoctors
};
