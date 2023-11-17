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
        console.log(e)
        return res.send(error(e.messege));
    }

}

const getToken = async (req, res) => {
    const { date, doctorid } = req.params
    // const { date } = req.body;
    console.log("thisi s date", date)
    const newdate = new Date(date);
    try {
        const data = await Tokens.findOne({
            $and: [{ doctor_id: doctorid }, { date: newdate }],
        });
        return res.send(success(200, data));
    } catch (e) {
        return res.send(error(e.message));
    }
};

export { createToken, getToken };