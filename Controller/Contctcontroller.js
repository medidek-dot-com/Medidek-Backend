


import { contact} from "../Models/Contact.js";
import { error, success } from "../Utils/responseWrapper.js";

const contactCreation = async (req, res) => {
    try {
        let result = await contact.create(req.body)
        res.send(
            success(201, result))
    } catch (e) {
      res.send(
            error(500, e))
    }
}


const getContact = async (req, res) => {
    try {
        let result = await contact.find()
        res.send(
            success(201, result))
    } catch (e) {
      res.send(
            error(500, e))
    }
}
export { contactCreation ,getContact }

