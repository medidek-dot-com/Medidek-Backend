


import { course} from "../Models/Course.js";
import { error, success } from "../Utils/responseWrapper.js";

const courseCreation = async (req, res) => {
    try {
        let result = await course.create(req.body)
        res.send(
            success(201, result))
    } catch (e) {
      res.send(
            error(500, e))
    }
}


const getCourse = async (req, res) => {
    const search = req.query.search || ""
    const query = {
        courseName: { $regex: search, $options: "i" }
    }
    try {
        let result = await course.find(query)
       return res.send(
            success(201, result))
    } catch (e) {
     return res.send(
            error(500, e))
    }
}

const getSingleCourse = async(req, res)=>{
    const {courseId} = req.params
    try {
        const singleCourse = await course.findOne({_id:courseId})
        return res.send(success(200, singleCourse))
    } catch (e) {
        return res.send(error(e.message))
    }
}


const getCourseByName = async (req, res) => {
    try {
        let result = await course.find({courseName:{$regex:req.body.courseName, $options:"i"}})
        res.send(
            success(201, result))
    } catch (e) {
      res.send(
            error(500, e))
    }
}

export { courseCreation ,getCourse ,getCourseByName, getSingleCourse }

