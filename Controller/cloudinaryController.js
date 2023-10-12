
import { MedicalRecord } from "../Models/MedicalRecord.js";
import { userpatient } from "../Models/Userpatition.js";
import express from 'express'
import multer from "multer";
import { error, success } from "../Utils/responseWrapper.js";
import { cloud } from "./cloudinary/cloudinary.js";
// Load environment variables

// Initialize Cloudinary with your API credentials

// cloudinary.v2.config({
//   cloud_name: process.env.Cloud_name,
//   api_key:  process.env.Api_key,
//   api_secret: process.env.Api_secret,
// });

const router = express.Router();

// Configure multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Handle image upload
router.post("/uploadMedicalRecord/:id", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Use the Cloudinary `upload` method to upload the image
    const result = await cloud.uploader.upload(req.file.path);

    // The `result` object contains details about the uploaded image, including the public URL
    const imageUrl = result.secure_url;

    // Create a new MedicalRecord
    const record = await MedicalRecord.create({
      medicalImg: imageUrl,
      name: req.body.name,
      medicalRecordName: req.body.medicalRecordName,
    });

    // Assuming you have the userPatient ID available as req.body.userId
    const userId = req.body.userId; // Replace with how you get the userPatient ID

    // Update the userPatient document by pushing the record ID to the medicalRecord array
    const updatedUser = await userpatient.findByIdAndUpdate(
      req.params.id,
      {
        $push: { medicalRecord: record._id }, // Push the record ID to the medicalRecord array
      },
      { new: true } // Return the updated userPatient document
    );

    // You can save the `imageUrl` to your database or use it as needed
    res.json({ Record: record, updatedUser: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during image upload" });
  }
});
router.get("/getMedicalRecordOfuser/:id",async (req,res)=>{
  try {
    const result =await userpatient.findById(req.params.id).populate("medicalRecord")
    return res.send(success(
      200,result
    ))
  } catch (e) {
    return res.send(error(
      200,{masseage:e}
    ))
  }
})

router.delete("/deleteMedicalRecordOfUser/:userId/:recordId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const recordId = req.params.recordId;

    // First, remove the medical record from the MedicalRecord collection
    await MedicalRecord.findByIdAndRemove(recordId);

    // Then, remove the record ID from the user's medicalRecord array
    const updatedUser = await userpatient.findByIdAndUpdate(
      userId,
      {
        $pull: { medicalRecord: recordId }, // Pull (remove) the record ID from the medicalRecord array
      },
      { new: true } // Return the updated userPatient document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Medical record deleted successfully', updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during record deletion" });
  }
});


export { router };
