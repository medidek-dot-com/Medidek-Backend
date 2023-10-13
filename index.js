import express from 'express'
import 'dotenv/config.js'
// import './DB/db.js'
import {dbConnection} from './DB/db.js'
import { authRouter } from './Routes/authRouter.js'
import { masterRouter } from './Routes/masterRouter.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Router } from './Routes/DoctorsRouter.js'
import { Staff } from './Routes/staffRouter.js'
import { userCreationRouter } from './Routes/UserpatientRoutes.js'
import { locationrouter } from './Routes/locationroutes.js'
import { Appointment } from './Routes/AppoinmentRoutes.js'
import {contact} from "./Routes/ContactRoutes.js"
import { course } from './Routes/CourseRouter.js'
import { notifyMe } from './Routes/notifyMeRoute.js'
import { Record } from './Routes/RecordRoute.js'
import { review } from './Routes/ReviewRoute.js'
import { router }  from "./Controller/cloudinaryController.js"

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(
    cors({
      "origin": "*",
    })
  );
app.use(cookieParser());
app.use('/uploads', express.static('./uploads'))

//Routes

app.use('/v2', authRouter)
app.use("/v2",masterRouter)
app.use("/v2",Router)
app.use("/v2",Staff)
app.use("/v2",userCreationRouter)
app.use("/v2",locationrouter)
app.use("/v2",Appointment)
app.use("/v2", contact)
app.use("/v2", course)
app.use("/v2", notifyMe)
app.use("/v2",Record)
app.use("/v2",review)
app.use("/v2",router)

dbConnection()
app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));


