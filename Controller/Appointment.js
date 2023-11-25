import moment from "moment/moment.js";
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
        role
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
        !role ||
        !AppointmentTime) {
        return res.send(error(400, "all fields  required"));
    }


    try {
        if (role === "MASTER") {
            const Appointmentdata = await AppointmentModel.create({
                doctorid,
                hospitalid: userid,
                name,
                age,
                gender,
                phone,
                AppointmentNotes,
                appointmentDate,
                AppointmentTime
            })
            // await Appointmentdata.populate(["doctorid", "hospitalid"])
            // console.log("aappooint aa gyi" + isappointmentexist);
            return res.send(success(201, Appointmentdata))

        }
        const isappointmentexist = await AppointmentModel.findOne({ $and: [{ doctorid }, { userid }, { appointmentDate }, { status: "pending" }] });
        console.log("aappoointcoming: " + isappointmentexist);
        if (isappointmentexist !== null) {
            return res.send(error(409, "Appointment is already exist"));
        }
        else {
            const Appointmentdata = await AppointmentModel.create({
                doctorid,
                userid: userid,
                name,
                age,
                gender,
                phone,
                AppointmentNotes,
                appointmentDate,
                AppointmentTime
            })
            // await Appointmentdata.populate(["doctorid", "userid"])
            return res.send(success(201, Appointmentdata))
        }

    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const updateAppointmnt = async (req, res) => {
    const { appointmentId } = req.params;
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
        status
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
        !AppointmentTime ||
        !status) {
        return res.send(error(400, "all fields  required"));
    }


    try {
        const appointmentupdated = await AppointmentModel.findByIdAndUpdate({ _id: appointmentId }, {
            doctorid,
            userid,
            name,
            age,
            gender,
            phone,
            AppointmentNotes,
            appointmentDate,
            AppointmentTime,
            status,
        }, { new: true });
        return res.send(success(200, appointmentupdated));
    } catch (e) {
        return res.send(error(e.message));
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

const getsingleappointmentbyid = async (req, res) => {
    const { appointmentId, status } = req.params;
    if (!appointmentId) {
        return res.send(error(400, "id is required"));
    }
    try {
        const singleappointment = await AppointmentModel.findOne({ $and: [{ _id: appointmentId }, { status }] }).populate("doctorid")
        return res.send(success(200, singleappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const changeappointmentstatus = async (req, res) => {
    const { id } = req.params;
    const { status, remark } = req.body;
    try {
        const chnageappointmentstatusbydoctor = await AppointmentModel.findByIdAndUpdate({ _id: id }, { status, remark }, { new: true });
        return res.send(success(200, "status changed succesfully"));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}


const getallappointmentofdoctor = async (req, res) => {
    const { doctorid } = req.params;
    const allappointment = await AppointmentModel.find({ doctorid }).populate("userid");
    try {
        if (allappointment === null) {
            return res.status(200).send({ msg: "no appointment found by this doctor" });
        }
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getAllPendingAppointmentOfDoctor = async (req, res) => {
    const { doctorid, date } = req.params;
    // const { date } = req.query;

    const allappointment = await AppointmentModel.find({
        $and: [{ doctorid },
        { status: "pending" },
        { appointmentDate: date }
        ]
    }).populate(["userid"]);

    // ({ doctorid }).populate("userid");
    try {
        if (allappointment === null) {
            return res.status(200).send({ msg: "no appointment found by this doctor" });
        }
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getAllCompletedAppointmentOfDoctor = async (req, res) => {
    const { doctorid, date } = req.params;
    const allappointment = await AppointmentModel.find({
        $and: [{ doctorid },
        { status: "completed" },
        { appointmentDate: date }
        ]
    }).populate("userid");

    // ({ doctorid }).populate("userid");
    try {
        if (allappointment === null) {
            return res.status(200).send({ msg: "no appointment found by this doctor" });
        }
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getAllMissedAppointmentOfDoctor = async (req, res) => {
    const { doctorid, date } = req.params;
    const allappointment = await AppointmentModel.find({
        $and: [{ doctorid },
        { status: { $in: ["missed", "cancelled"] } },
        { appointmentDate: date }
        ]
    }).populate("userid");

    // ({ doctorid }).populate("userid");
    try {
        if (allappointment === null) {
            return res.send(error(404, "no appointment found by this doctor"));
        }
        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

// get all Pending appointments for perticular patient

const getUpcomingAppointmentForAnUser = async (req, res) => {
    const { Patient_id, doctorid } = req.params;
    console.log(Patient_id);
    if (doctorid) {
        const allappointment = await AppointmentModel.find({
            $and: [{ doctorid: doctorid },
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
    if (Patient_id) {
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

// get all completed appointments for perticular patient

const getMissedAppointmentsForAnUser = async (req, res) => {
    const { Patient_id } = req.params;
    console.log(Patient_id);

    try {
        const allappointment = await AppointmentModel.find({
            userid: Patient_id,
            status: { $in: ["missed", "cancelled"] }
        }).populate("doctorid");

        if (!allappointment || allappointment.length === 0) {
            return res.send(error(404, "No appointments found for this user."));
        }

        return res.send(success(200, allappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}





const getallappointmentsforparticularhospitalidpending = async (req, res) => {
    const { hospitalid, date } = req.params;
    const newdate = new Date(date)
    if (!hospitalid) {
        return res.send(error(404, "filed missing required parameter"))
    }
    try {
        const allappointment = await AppointmentModel.find({
            $and: [{ hospitalid }, { status: "pending" }, { appointmentDate: newdate }]
        }).populate("doctorid")
        return res.send(success(200, allappointment))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}
const getallappointmentsforparticularhospitalidcompleted = async (req, res) => {
    const { hospitalid, date } = req.params;
    const newdate = new Date(date)
    if (!hospitalid) {
        return res.send(error(404, "filed missing required parameter"))
    }
    try {
        const allappointment = await AppointmentModel.find({
            $and: [{ hospitalid }, { status: "completed" }, { appointmentDate: newdate }]
        }).populate("doctorid")
        return res.send(success(200, allappointment))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}
const getallappointmentsforparticularhospitalidmissed = async (req, res) => {
    const { hospitalid, date } = req.params;
    const newdate = new Date(date)
    if (!hospitalid) {
        return res.send(error(404, "filed missing required parameter"))
    }
    try {
        const allappointment = await AppointmentModel.find({
            $and: [{ hospitalid }, { status: "missed" }, { appointmentDate: newdate }]
        }).populate("doctorid")
        return res.send(success(200, allappointment))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}










// const getMissedAppointmentsForAnUser = async (req, res) => {
//     const { Patient_id } = req.params;
//     console.log(Patient_id);
//     const allappointment = await AppointmentModel.find({
//         $and: [{ userid: Patient_id },
//     { status: "missed" }, { status: "pending" }
//         ]
//     }).populate("doctorid");
//     console.log(allappointment)
//     // $and: [{ doctor_id: doctorid }, { date: newdate }]
//     try {
//         if (allappointment === null) {
//             return res.send(error(404, "no appointment found by this doctor"));
//         }
//         return res.send(success(200, allappointment));
//     } catch (e) {
//         return res.send(error(500, e.message));
//     }
// }

const Totalapatient = async (req, res) => {
    const { doctorid, date } = req.params;
    const newdate = new Date(date);
    const year = newdate.getFullYear()
    const month = newdate.getMonth();
    const intialdate = `${year}-${month}-01`
    const intialdat = new Date(intialdate);
    console.log("this is initil date", intialdat)

    try {
        const allpatient = await AppointmentModel.
            find({ $and: [{ doctorid }, { appointmentDate: { $gte: intialdat } }, { appointmentDate: { $lte: newdate } }] }).countDocuments();
        return res.send(success(200, allpatient));
    } catch (e) {
        return res.send(error(e.message));
    }
}

const TodayAppointment = async (req, res) => {
    const { doctorid, date } = req.params;
    const today = new Date(date)
    try {
        const totalAppointments = await AppointmentModel.find({ $and: [{ doctorid }, { appointmentDate: today }] }).countDocuments();
        const completeAppointments = await AppointmentModel.find({
            $and: [{ doctorid },
            { status: { $in: ["missed", "cancelled", "completed"] } },
            { appointmentDate: today }
            ]
        }).countDocuments();
        // awaiit aajkiappointment.C
        return res.send(success(200, { totalAppointments, completeAppointments }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const Futureappointment = async (req, res) => {
    const { doctorid } = req.params;
    const today = moment().format("YYYY-MM-DD")
    const date = new Date(today);
    try {
        const newappointment = await AppointmentModel.
            find({ $and: [{ doctorid }, { status: "pending" }, { appointmentDate: { $gte: date } }] }).countDocuments();
        return res.send(success(200, newappointment));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const Appointmentstatusinpercentage = async (req, res) => {
    const { doctorid, date } = req.params;
    console.log(doctorid, date);
    const stringdate = new Date(date)
    try {
        const totalappointment = await AppointmentModel.find({ $and: [{ doctorid }, { appointmentDate: stringdate }] }).countDocuments();
        const pendingapointment = await AppointmentModel.find({ $and: [{ doctorid }, { status: "pending" }, { appointmentDate: stringdate }] }).countDocuments();
        const completedappointment = await AppointmentModel.find({ $and: [{ doctorid }, { status: "completed" }, { appointmentDate: stringdate }] }).countDocuments();
        const cancelledapointment = await AppointmentModel.find({ $and: [{ doctorid }, { status: "cancelled" }, { appointmentDate: stringdate }] }).countDocuments();
        console.log(totalappointment, completedappointment)
        const PA = (100 * pendingapointment) / totalappointment;
        const COMPA = (100 * completedappointment) / totalappointment;
        const CA = (100 * cancelledapointment) / totalappointment;
        return res.send(success(200, { pending: PA, completed: COMPA, cancelled: CA }));
    } catch (e) {
        return res.send(error(e.message));
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
    getallappointmentsforparticularhospitalidmissed,
    getallappointmentsforparticularhospitalidcompleted,
    getallappointmentsforparticularhospitalidpending,
    createAppointmnt,
    getAllPendingAppointmentOfDoctor,
    getAllCompletedAppointmentOfDoctor,
    getAllMissedAppointmentOfDoctor,
    getallappointmentofdoctor,
    appointmentstatus,
    changeappointmentstatus,
    Totalapatient,
    TodayAppointment,
    Futureappointment,
    Appointmentstatusinpercentage,
    AppointmentBydate,
    appointmentstatusfordoctor,
    getUpcomingAppointmentForAnUser,
    getCompletedAppointmentsForAnUser,
    getMissedAppointmentsForAnUser,
    getsingleappointmentbyid,
    updateAppointmnt
}