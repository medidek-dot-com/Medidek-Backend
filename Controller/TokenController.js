import { Tokens } from "../Models/Token.js";
import { success, error } from "../Utils/responseWrapper.js";
const createToken = async (req, res) => {
    const { // doctorid should be database id of doctor
        Starttime1,
        Endtime1,
        Starttime2,
        Endtime2,
        Starttime3,
        Endtime3,
        date,
        doctorid,
        appointmentByToken
    } = req.body;
    const newdate = new Date(date);

    try {
        const isslotalready = await Tokens.findOne({ $and: [{ doctor_id: doctorid }, { date: newdate }] });
        if (isslotalready) {
            const updatedslot = await Tokens.findOneAndUpdate({ doctor_id: doctorid }, {
                Starttime1,
                Endtime1,
                Starttime2,
                Endtime2,
                Starttime3,
                Endtime3,
                date: newdate,
                doctor_id: doctorid
            })
            return res.send(success(200, { update: updatedslot }));
        }
        const createdslot = await Tokens.create({
            Starttime1,
            Endtime1,
            Starttime2,
            Endtime2,
            Starttime3,
            Endtime3,
            date: newdate,
            doctor_id: doctorid
        })
        return res.send(success(200, { create: createdslot }));
    } catch (e) {
        return res.send(error(e.messege));
    }

}


const getTokenData = async (req, res) => {
    const { doctorid, date } = req.params;
    const newDate = new Date(date)
    if (!doctorid || !date) {
        return res.send(error(400, "pls filled all field"));
    }
    try {
        const data = await Tokens.findOne({
            $and: [{ doctor_id: doctorid }, { date: newDate }],
        });
        return res.send(success(200, data));
    } catch (e) {
        return res.send(error(500, e.messege));
    }
};

export { createToken, getTokenData };