import { AppointmentModel } from "../Models/Appointments.js"
import { success, error } from "../Utils/responseWrapper.js";

const createAppointmnt = async (req, res) => {
    const {
        doctorid,
        userid,
        name,
        age,
        gender,
        phone,
        AppointmentNotes,
        appointmentDate,
        AppointmentTime,
    } = req.body;

    if (
        !doctorid ||
        !userid ||
        !name ||
        !age ||
        !gender ||
        !phone ||
        !appointmentDate ||
        !AppointmentNotes ||
        !AppointmentTime) {
        return res.send(error(400, "all fields  required"));
    }


    try {
        const isappointmentexist = await AppointmentModel.findOne({ $and: [{ doctorid }, { userid }, { appointmentDate }] })
        if (isappointmentexist) {
            return res.send(error(409, "Appointment is already exist"));
        }
        const Appointmentdata = await AppointmentModel.create({
            doctorid,
            userid,
            name,
            age,
            gender,
            phone,
            AppointmentNotes,
            appointmentDate,
            AppointmentTime
        })
        return res.send(success(201, Appointmentdata));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const appointmentstatus = async (req, res) => {
    const { userid, status } = req.body;
    try {
        const allapointmentbystatus = await AppointmentModel.find({ $and: [{ userid }, { status }] });
        return res.status(200).send(allapointmentbystatus);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const changeappointmentstatus = async (req, res) => {
    const { Doctorid, status } = req.body;
    try {
        const chnageappointmentstatusbydoctor = await AppointmentModel.findByIdAndUpdate({ Doctorid }, { status }, { new: true });
        return res.status(200).send("status changed succesfully");
    } catch (error) {
        return res.status(500).send(error);
    }
}


const getallappointmentofdoctor = async (req, res) => {
    const { Doctorid } = req.body;
    const allappointment = await AppointmentModel.find({ Doctorid });
    try {
        if (allappointment === null) {
            return res.status(200).send({ msg: "no appointment found by this doctor" });
        }
        return res.status(200).send(allappointment);
    } catch (e) {
        return res.status(500).send({ msg: "error in backend" });
    }
}

// get all completed appointments for perticular patient

const getUpcomingAppointmentForAnUser = async (req, res) => {
    const { Patient_id } = req.params;
    console.log(Patient_id);
    const allappointment = await AppointmentModel.find({
        $and: [{ userid: Patient_id },
        { status: "pending" }
        ]
    }).populate("doctorid");

    try {
        if (allappointment === null) {
            return res.send(error(404, "no appointment found by this doctor"));
        }
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

// get all completed appointments for perticular patient
const getCompletedAppointmentsForAnUser = async (req, res) => {
    const { Patient_id } = req.params;
    console.log(Patient_id);
    const allappointment = await AppointmentModel.find({
        $and: [{ userid: Patient_id },
        { status: "completed" }
        ]
    }).populate("doctorid");
    console.log(allappointment)
    // $and: [{ doctor_id: doctorid }, { date: newdate }]
    try {
        if (allappointment === null) {
            return res.send(error(404, "no appointment found by this doctor"));
        }
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getMissedAppointmentsForAnUser = async (req, res) => {
    const { Patient_id } = req.params;
    console.log(Patient_id);
    const allappointment = await AppointmentModel.find({
        $and: [{ userid: Patient_id },
        { status: "missed" }
        ]
    }).populate("doctorid");
    console.log(allappointment)
    // $and: [{ doctor_id: doctorid }, { date: newdate }]
    try {
        if (allappointment === null) {
            return res.send(error(404, "no appointment found by this doctor"));
        }
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const Totalapatient = async (req, res) => {
    const { Doctorid } = req.body;
    try {
        const allpatient = await AppointmentModel.find({ Doctorid });
        return res.status(200).send(allpatient);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const TodayAppointment = async (req, res) => {
    const { Doctorid } = req.body;
    const today = new Date().toLocaleDateString();
    try {
        const aajkiappointment = await AppointmentModel.find({ $and: [{ Doctorid }, { AppointmentDate: today }] });
        return res.status(200).send(aajkiappointment);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const Futureappointment = async (req, res) => {
    const { Doctorid } = req.body;
    try {
        const newappointment = await AppointmentModel.find({ $and: [{ Doctorid }, { status: "pending" }] });
        return res.status(200).send(newappointment);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const Appointmentstatusinpercentage = async (req, res) => {
    const { Doctorid } = req.body;
    try {
        const totalappointment = await AppointmentModel.find({ Doctorid });
        const pendingapointment = await AppointmentModel.find({ $and: [{ Doctorid }, { status: "pending" }] });
        const completedappointment = await AppointmentModel.find({ $and: [{ Doctorid }, { status: "completed" }] });
        const cancelledapointment = await AppointmentModel.find({ $and: [{ Doctorid }, { status: "cancelled" }] });
        const PA = (totalappointment * pendingapointment) / 100;
        const COMPA = (totalappointment * completedappointment) / 100;
        const CA = (totalappointment * cancelledapointment) / 100;
        return res.status(200).send({ pending: PA, completed: COMPA, cancelled: CA });
    } catch (error) {
        return res.status(500).send(error);
    }
}

const AppointmentBydate = async (req, res) => {
    const { Doctorid, Date } = req.body;
    // const today = new Date().toLocaleDateString();
    try {
        const dateappointment = await AppointmentModel.find({ $and: [{ Doctorid }, { AppointmentDate: Date }] });
        return res.status(200).send(dateappointment);
    } catch (error) {
        return res.status(500).send(error);
    }
}
const appointmentstatusfordoctor = async (req, res) => {
    const { Doctorid, status } = req.body;
    try {
        const allapointmentbystatus = await AppointmentModel.find({ $and: [{ Doctorid }, { status }] });
        return res.status(200).send(allapointmentbystatus);
    } catch (error) {
        return res.status(500).send(error);
    }
}

export {
    createAppointmnt,
    getallappointmentofdoctor,
    getUpcomingAppointmentForAnUser,
    appointmentstatus,
    changeappointmentstatus,
    Totalapatient,
    TodayAppointment,
    Futureappointment,
    Appointmentstatusinpercentage,
    AppointmentBydate,
    appointmentstatusfordoctor,
    getCompletedAppointmentsForAnUser,
    getMissedAppointmentsForAnUser
}