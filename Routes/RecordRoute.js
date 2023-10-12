import express from 'express'
import { RecordCreation , getRecordforPatient } from '../Controller/RecordController.js';
import { uploadRecord } from '../Multer/MedicalRecordsConfig.js';

const Record = express.Router();

Record.post('/uploadRecord', RecordCreation)
Record.get("/getRecordOfPatient",getRecordforPatient)

export {Record}

