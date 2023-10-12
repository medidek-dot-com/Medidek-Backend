
import express from 'express'
import { ReviewCreation } from "../Controller/ReviewController.js"
const review = express.Router();

review.post('/reviewCreation/:id', ReviewCreation)
// Router.get('/getSingleDoctor/:id', getSingleDoctor)


 export  { review } 