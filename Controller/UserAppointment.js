
import { Appointment } from "../Models/Appointment.js";
import { error, success } from "../Utils/responseWrapper.js";

const AppointmentCreation = async (req, res) => {
    try {
        // Check if an appointment exists for the given date, user, and doctor
        const existingAppointment = await Appointment.findOne({
            appointmentDate: req.body.appointmentDate,
            userId: req.body.userId,
            doctorsId: req.body.doctorsId
        }).populate('doctorsId')

        if (existingAppointment) {
            // An appointment already exists for the user on the given date
            res.send(error(409, { message: 'Appointment already exists for this date and user' }));
        } else {
            // Create a new appointment since none exists for the given date, user, and doctor
            const newAppointmentData = req.body;

            // Count appointments for the same date, user, and doctor
            const appointmentCount = await Appointment.countDocuments({
                appointmentDate: req.body.appointmentDate,
                doctorsId: req.body.doctorsId
            })

            // Generate a token based on the appointment count
            const token = appointmentCount + 1

            // Add the token to the new appointment data
            newAppointmentData.token = token;

            // Create the new appointment with the token
            const result = await (await Appointment.create(newAppointmentData)).populate(['userId', 'doctorsId'])

            res.send(success(201, result));
        }
    } catch (e) {
        res.send(error(500, { message: 'Internal server error', error: e.message }));
    }
}

const createAppointmentByHospitals = async (req, res) => {
    const newAppointmentData = req.body;

    try {
        const appointmentCount = await Appointment.countDocuments({
            appointmentDate: req.body.appointmentDate
        });
        const token = appointmentCount + 1

        newAppointmentData.token = token;

        const result = await Appointment.create(newAppointmentData);

        return res.send(success(201, result));
    } catch (e) {
        return res.send(error(500, e.message));
    }


}
// const getDoctorForHospital = async (req, res) => {
//     try {
//         console.log(req.params.id,req.params.hosp_id)
//         let result = await Doctor.find({hospitalId:req.params.hosp_id,_id:req.params.id})
//         res.send(
//             success(201, result))
//     } catch (e) {
//       res.send(
//             error(500, e))
//     }
// }

const Instantbooking = async (req, res) => {
    try {
        let result = await Appointment.create(req.body)
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}

const getAllAppointmentsForPerticularHospital = async (req, res) => {
    const { hosep_id } = req.params
    const search = req.query.search || ""
    const query = {
        hospitalId: hosep_id,
        status: 'pending',
        // if(search === undefined){
        //    return false
        // }
       
        // patientName: { $regex: search, $options: "i" },
        // appointmentDate: { $regex: search, $options: "i" },

    }
    try {
        const result = await Appointment.find(query)
        return res.send(success(200, result))
    } catch (e) {
        console.log(e.message);
        return res.send(error(500, e.message))
    }
}
const getCompleteAppointmentsForHospital = async (req, res) => {
    const { hosep_id } = req.params
    try {
        const result = await Appointment.find({ hospitalId: hosep_id, status: 'completed' }).populate("doctorsId")
        return res.send(success(200, result))
    } catch (e) {
        console.log(e.message);
        return res.send(error(500, e.message))
    }
}
const getMissedAppointmentsForHospital = async (req, res) => {
    const { hosep_id } = req.params
    try {
        const result = await Appointment.find({ hospitalId: hosep_id, status: 'missed' }).populate("doctorsId")
        return res.send(success(200, result))
    } catch (e) {
        console.log(e.message);
        return res.send(error(500, e.message))
    }
}



const getAppoinmentForDoctorInHospital = async (req, res) => {
    try {
        // console.log(req.params.hosep_id,req.params.id);
        const { hosep_id, doctor_id } = req.params
        const currentDate = Date.now();
        console.log("this is hospital id", hosep_id, "this is doctor id", doctor_id);
        let result = await Appointment.find({ hospitalId: hosep_id, doctorsId: doctor_id })
        console.log(result);
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}

const getPendingAppointmentsForHospital = async (req, res) => {
    try {
        // console.log(req.params.hosep_id,req.params.id);
        const { hosep_id } = req.params
        console.log("this is hospital id", hosep_id, "this is doctor id", doctor_id);
        let result = await Appointment.find({ hospitalId: hosep_id, status: "pending" })
        console.log(result);
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e.message));
    }
}
const getPendingAppointmentsForHospitalAndDoctors = async (req, res) => {
    try {
        // console.log(req.params.hosep_id,req.params.id);
        const { hosep_id, doctor_id } = req.params
        console.log("this is hospital id", hosep_id, "this is doctor id", doctor_id);
        let result = await Appointment.find({ hospitalId: hosep_id, doctorsId: doctor_id, status: "pending" })
        console.log(result);
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}
const getCompleteAppointmentsForHospitalAndDoctors = async (req, res) => {
    try {
        // console.log(req.params.hosep_id,req.params.id);
        const { hosep_id, doctor_id } = req.params
        console.log("this is hospital id", hosep_id, "this is doctor id", doctor_id);
        let result = await Appointment.find({ hospitalId: hosep_id, doctorsId: doctor_id, status: "completed" })
        console.log(result);
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}
const getMissedAppointmentsForHospitalAndDoctors = async (req, res) => {
    try {
        // console.log(req.params.hosep_id,req.params.id);
        const { hosep_id, doctor_id } = req.params
        console.log("this is hospital id", hosep_id, "this is doctor id", doctor_id);
        let result = await Appointment.find({ hospitalId: hosep_id, doctorsId: doctor_id, status: "missed" })
        console.log(result);
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}


const getAppointmentForPatient = async (req, res) => {
    try {
        const currentDate = Date.now();
        console.log(currentDate);
        const appointments = await Appointment.find({
            userId: req.params.Patient_id,
            appointmentDate: { $gte: currentDate },
            status: "pending"
        }).sort({ appointmentDate: 1 }); // Sort by appointmentDate in ascending order

        console.log(appointments);
        res.status(201).json({ success: true, data: appointments });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}

//Abhay Made This for website
const getPendingAppointmentForPatient = async (req, res) => {
    try {
        const currentDate = Date.now();
        console.log(currentDate);
        const appointments = await Appointment.find({
            userId: req.params.Patient_id,
            status: "pending"
        }).sort({ appointmentDate: 1 }).populate(['doctorsId', 'userId'])

        console.log(appointments);
        return res.send(success(200, appointments));
    } catch (e) {
        return res.send(error(500, e.message));
    }
}



const getCancelAppointmentForPatient = async (req, res) => {
    try {
        console.log(req.params.Patient_id);
        const appointments = await Appointment.find({
            userId: req.params.Patient_id,
            status: "cancel"
        }); // Sort by appointmentDate in ascending order

        console.log(appointments);
        res.status(201).json({ success: true, data: appointments });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}

const getCompletedAppointmentForPatient = async (req, res) => {
    try {
        console.log(req.params.Patient_id);
        const appointments = await Appointment.find({
            userId: req.params.Patient_id,
            status: "completed"
        }); // Sort by appointmentDate in ascending order

        console.log(appointments);
        res.status(201).json({ success: true, data: appointments });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}

const updateAppointment = async (req, res) => {
    try {
        console.log(req.body, req.params.id);
        let result = await Appointment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.send(
            success(201, result))
    } catch (e) {
        res.send(
            error(500, e))
    }
}

const updateUserAppointmentStatus = async (req, res) => {
    const { Patient_id } = req.params;
    const { status } = req.body;
    console.log("This is updated Status", status);
    try {
        const updateUserStatus = await Appointment.findByIdAndUpdate({ _id: Patient_id }, { status: status }, { new: true });
        res.send(success(200, updateUserStatus));
    } catch (e) {
        res.send(
            error(500, e))

    }
};


export { AppointmentCreation, getAppoinmentForDoctorInHospital, Instantbooking, getAppointmentForPatient, updateAppointment, getCancelAppointmentForPatient, updateUserAppointmentStatus, getPendingAppointmentsForHospitalAndDoctors, getCompleteAppointmentsForHospitalAndDoctors, getAllAppointmentsForPerticularHospital, getPendingAppointmentsForHospital, getCompleteAppointmentsForHospital, getMissedAppointmentsForHospital, getCompletedAppointmentForPatient, createAppointmentByHospitals, getPendingAppointmentForPatient, getMissedAppointmentsForHospitalAndDoctors }

