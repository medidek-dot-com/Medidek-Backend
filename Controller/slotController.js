import { Slots } from "../Models/slots.js";
import { success, error } from "../Utils/responseWrapper.js";
import moment from "moment";
const createslot = async (req, res) => {
    const { // doctorid should be database id of doctor
        slotduration,
        Starttime1,
        Endtime1,
        Starttime2,
        Endtime2,
        Starttime3,
        Endtime3,
        isholiday,
        date,
        doctorid,
        isOnlineSlot
    } = req.body;
    const newdate = new Date(date);
    if (!doctorid || !date) {
        return res.send(error(400, "all fields are required"))
    }
    try {
        const isslotalready = await Slots.findOne({ $and: [{ doctor_id: doctorid }, { date: newdate }] });
        if (isslotalready) {
            const updatedslot = await Slots.findOneAndUpdate({ doctor_id: doctorid }, {
                slotduration,
                Starttime1,
                Endtime1,
                Starttime2,
                Endtime2,
                Starttime3,
                Endtime3,
                isholiday,
                date: newdate,
                doctor_id: doctorid
            })
            return res.send(success(200, { update: updatedslot }));
        }
        const createdslot = await Slots.create({
            slotduration,
            Starttime1,
            Endtime1,
            Starttime2,
            Endtime2,
            Starttime3,
            Endtime3,
            isholiday,
            date: newdate,
            doctor_id: doctorid
        })
        return res.send(success(200, { create: createdslot }));
    } catch (e) {
        return res.send(error(e.messege));
    }

}

const getslot = async (req, res) => {
    const { date, doctorid } = req.params
    if (!doctorid || !date) {
        return res.send(error(400, "all fields are required"))
    }
    const newdate = new Date(date);
    try {
        const data = await Slots.findOne({
            $and: [{ doctor_id: doctorid }, { date: newdate }],
        });
        return res.send(success(200, data));
    } catch (e) {
        return res.send(error(e.message));
    }
};

const userslot = async (req, res) => {
    const { doctorid, date } = req.params;
    const newdate = new Date(date)

    try {
        const isslotavailable = await Slots.findOne({ $and: [{ doctor_id: doctorid }, { date: newdate }] });
        if (isslotavailable !== null) {
            let slots1 = [];
            let slots2 = [];
            let slots3 = [];
            const SD = isslotavailable.slotduration;
            const slotDuration = SD;
            // isslotavailable)
            // "object is already available");
            // Define the starttimes and endtimes
            const startTime1 = isslotavailable.Starttime1;
            const endTime1 = isslotavailable.Endtime1;
            if (startTime1 && startTime1 !== 0 && endTime1 && endTime1 !== 0) {
                const cb = startTime1?.split(" ");
                const newb = cb[0]?.split(":");
                // const SD = isslotavailable.slotduration;
                const starthour = newb[0];
                const format = cb[1];
                // const slotDuration = SD;

                const cbb = endTime1?.split(" ");
                const newbb = cbb[0]?.split(":");
                const endhour = newbb[0];
                const endformat = cbb && cbb[1];
                // Define the starttimes and endtimes
                slots1 = genrateSlots(starthour, endhour, slotDuration, format, endformat)
            }


            const startTime2 = isslotavailable.Starttime2;
            const endTime2 = isslotavailable.Endtime2;
            if (startTime2 && startTime2 !== 0 && endTime2 && endTime2 !== 0) {
                const cb1 = startTime2?.split(" ");
                const newb1 = cb1[0].split(":");
                // const SD1 = newb1[1];
                const starthour1 = newb1 && newb1[0];
                const format1 = cb1 && cb1[1];
                // const slotDuration1 = SD1;

                const cbb1 = endTime2?.split(" ");
                const newbb1 = cbb1[0]?.split(":");
                const endhour1 = newbb1 && newbb1[0];
                const endformat1 = cbb1[1];
                // Define the starttimes and endtimes
                slots2 = genrateSlots(starthour1, endhour1, slotDuration, format1, endformat1)
            }


            const startTime3 = isslotavailable.Starttime3;
            const endTime3 = isslotavailable.Endtime3;
            if (startTime3 && startTime3 !== 0 && endTime3 && endTime3 !== 0) {
                const cb2 = startTime3?.split(" ");
                const newb2 = cb2[0]?.split(":");
                const SD2 = newb2[1];
                const starthour2 = newb2 && newb2[0];
                const format2 = cb2[1];
                // const slotDuration2 = SD;

                const cbb2 = endTime3?.split(" ");
                const newbb2 = cbb2[0]?.split(":");
                const endhour2 = newbb2 && newbb2[0];
                const endformat2 = cbb2 && cbb2[1];
                slots3 = genrateSlots(starthour2, endhour2, slotDuration, format2, endformat2)
            }

            const comparray = [...slots1, ...slots2, ...slots3];
            return res.send(success(200, comparray));
        }
        else {
            return res.send(success(200, ["doctor not available for this date"]));
        }
        // return res.send(isslotavailable);

    } catch (e) {
        res.send(error(500, e.message));
    }
};


const genrateSlots = (startTime, endTime, slotDuration, format, endformat) => {
    // Initialize the slots array
    const start = moment().hour(parseInt(endTime))
    const originalDate = moment(start);
    const endlastDate = originalDate.set({ hour: parseInt(endTime), minute: slotDuration, second: 0 });
    const slots = [];
    let c = 12;
    let d = 12;
    // Calculate the number of slots
    if (startTime < 12 && endTime < 12 && format === "AM" && endformat === "AM") {
        var numberOfSlots = Math.floor(((endTime - startTime) * 60) / slotDuration);

    }
    else if (startTime <= 12 && endTime >= 1 && format === "AM" && endformat === "PM") {
        if (parseInt(endTime) !== 12) {
            c = c + parseInt(endTime);
        }

        var numberOfSlots = Math.floor(((c - startTime) * 60) / slotDuration);

    }
    else if (startTime <= 12 && endTime < 12 && format === "PM" && endformat === "PM") {
        d = d + startTime;
        c = c + endTime;
        var numberOfSlots = Math.floor(((c - d) * 60) / slotDuration);
        // numberOfSlots)
    }
    else if (startTime < 12 && endTime >= 1 && format === "PM" && endformat === "AM") {
        c = c + endTime;
        var numberOfSlots = Math.floor(((c - startTime) * 60) / slotDuration);
        // numberOfSlots)
    }
    else {
        return null;
    }

    //   Iterate over the slots
    for (let i = 1; i <= numberOfSlots; i++) {
        // Calculate the start and end times for each slot
        // const start = moment().add(startTime,'hour').set('hour');
        const start = moment().hour(parseInt(startTime))
        const originalDate = moment(start);
        const modifiedDate = originalDate.set({ hour: parseInt(startTime), minute: 0, second: 0 });
        const a = modifiedDate.format()
        // // const newdate = new Date(a);
        // // newdate);
        // // const fom = newdate.setMinutes(0)
        // // const fom2 = newdate.setSeconds(0)
        // // const fom3 = newdate.setMilliseconds(0);
        // const format  = newdate.toISOString().slice(0,13);
        // newdate,format);
        const startTimeOfSlot = moment(a).add(i * slotDuration, 'minutes');
        const endTimeOfSlot = moment(startTimeOfSlot).add(slotDuration, 'minutes');
        if (endTimeOfSlot.format('hh:mm A') == endlastDate.format('hh:mm A')) {
            return slots;
        }
        // Add the slot to the slots array
        slots.push({
            startTime: startTimeOfSlot.format('hh:mm A'),
            endTime: endTimeOfSlot.format('hh:mm A')
        });
    }

    // Return the slots array
    return slots;
};

export { createslot, getslot, userslot };