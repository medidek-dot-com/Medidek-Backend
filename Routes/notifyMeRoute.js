import express from 'express'
import { notifyMeController } from '../Controller/notifyMeController.js';
export const notifyMe = express.Router();

notifyMe.post('/notifyMe', notifyMeController)

