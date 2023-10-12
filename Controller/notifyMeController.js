import { Notify } from "../Models/NotifyMeSchema.js"
import { error, success } from "../Utils/responseWrapper.js"

export const notifyMeController = async(req, res)=>{
    const {email} = req.body
    if(!email){
        res.send(error(401, "Email is requiered"))
    }
    try {
        
        const notifyMe = await Notify.create({email: email})
            res.send(success(201, notifyMe)) 
    } catch (e) {
       res.send(error(500, e.message)) 
    }
}