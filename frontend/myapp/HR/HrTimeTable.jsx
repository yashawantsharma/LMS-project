
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function HrTimeTable() {

    const token = localStorage.getItem("token");

    const [events, setEvents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [batchDetails, setBatchDetails] = useState(null);
    const [students, setStudents] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");

    const [showPopup, setShowPopup] = useState(false);

    const [form, setForm] = useState({
        days: [],
        Data: "",
        dayTimes: {},
        tutor: ""
    });


    useEffect(() => {
        fetchCourses();
        fetchTutors();
        fetchTimetable();
        fetchStudents();
    }, []);
    const fetchStudents = async () => {
  const res = await axios.get("http://localhost:4040/student/findall");
  setStudents(res.data);
};

    useEffect(() => {
        if (selectedCourse) fetchBatches();
    }, [selectedCourse]);

    const fetchCourses = async () => {
        const res = await axios.get("http://localhost:4040/course/findall");
        setCourses(res.data);
    };

    const fetchBatches = async () => {
        const res = await axios.get("http://localhost:4040/batch/allbatch");
        setBatches(res.data); //.filter(b => b.course?._id === selectedCourse)
    };

    const fetchTutors = async () => {
        const res = await axios.get(
            "http://localhost:4040/tutor/findall",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTutors(res.data);
    };

    const fetchTimetable = async () => {
        const res = await axios.get(
            "http://localhost:4040/timetable/findall"
        );

        const formatted = res.data
            .filter(t => !t.isdeleted)
            .flatMap(t =>
                t.schedule.map(s => {

                    const start = moment()
                        .day(s.day)
                        .set({
                            hour: moment(s.time, "HH:mm").hour(),
                            minute: moment(s.time, "HH:mm").minute()
                        });

                    return {
                        id: t._id + s.day,
                        title: `${t.course?.name}  - ${s.time}`,
                        start: start.toDate(),
                        end: moment(start).add(1, "hour").toDate()
                    };
                })
            );
        setEvents(formatted);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post(
            "http://localhost:4040/timetable/",
            {
                ...form,
                course: selectedCourse,
                batch: selectedBatch
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setShowPopup(false);
        await fetchTimetable();
    };


    const deleteTimetable = async (id) => {
        await axios.put(
            `http://localhost:4040/timetable/delete/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchTimetable();
    };



    const fetchBatchDetails = async (batchId) => {
        try {
            const res = await axios.get(`http://localhost:4040/batch/${batchId}`);
            setBatchDetails(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const batchStudents = students.filter(
  s => s.batch?._id === selectedBatch
);
console.log("Selected batch:", selectedBatch);
console.log("Students:", students);

    return (
        <div className="ml-58 mt-10  p-6 bg-gray-100 min-h-screen">

            <h1 className="text-2xl font-bold mb-6">
                Timetable
            </h1>


            <div className="flex justify-between items-center mb-6">


                <div className="flex gap-4">
                    <select
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="">Select Course</option>
                        {courses.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {selectedCourse && (
                        <select
                            onChange={(e) => {
                                const id = e.target.value;
                                setSelectedBatch(id);
                                fetchBatchDetails(id);
                            }}

                            className="border px-3 py-2 rounded"
                        >
                            <option value="">Select Batch</option>
                            {batches.map(b => (
                                <option key={b._id} value={b._id}>
                                    {b.batchName}
                                </option>
                            ))}
                        </select>
                    )}
                </div>


                {/* {selectedCourse && selectedBatch && (
                    <button
                        onClick={() => setShowPopup(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        + Add Timetable
                    </button>
                )} */}

            </div>

            {/* CALENDAR */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
                {selectedCourse && selectedBatch && (
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <Calendar
                            key={events.length}
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 650 }}
                            views={["month", "week", "day"]}
                            popup
                        />
                    </div>
                )}
            </div>
            {batchDetails && (
  <div className="mt-6 bg-white rounded-xl shadow p-4">

    <h2 className="text-lg font-semibold mb-4">
      Batch Overview
    </h2>

    <table className="min-w-full border">

      <thead className="bg-gray-100">
        <tr>
          <th className="border px-3 py-2">Student</th>
          <th className="border px-3 py-2">Teacher</th>
          <th className="border px-3 py-2">Course</th>
          <th className="border px-3 py-2">Batch</th>
        </tr>
      </thead>

      <tbody>
    
      </tbody>

    </table>
  </div>
)}
{/* BATCH STUDENTS LIST */}
{selectedCourse && selectedBatch && (
  <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">

    <h2 className="text-xl font-bold mb-4 text-gray-800">
      Batch Details
    </h2>

    {/* Batch Name */}
    <p className="mb-2 text-gray-600">
      <strong>Batch:</strong>{" "}
      {batches.find(b => b._id === selectedBatch)?.batchName}
    </p>

    {/* Total Students */}
    <p className="mb-4 text-gray-600">
      <strong>Total Students:</strong> {batchStudents.length}
    </p>

    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
             {/* <th className="p-2 text-left">Corse</th> */}
            <th className="p-2 text-left">Phone</th>
          </tr>
        </thead>
        <tbody>
          {batchStudents.map(student => (
            <tr key={student._id} className="border-b">
              <td className="p-2">
                {student.visitor?.name}
              </td>
              <td className="p-2">
                {student.visitor?.email}
              </td>
              {/* <td className="p-2">
                {student.visitor?.course?.name}
              </td> */}
              <td className="p-2">
                {student.visitor?.phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
)}

            {/* ADD POPUP */}
            {showPopup && (
                <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">

                        <h2 className="text-xl font-bold mb-4">
                            Add Timetable
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                                    .map(day => (
                                        <label key={day} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={form.days.includes(day)}
                                                onChange={(e) => {
                                                    const value = e.target.value;

                                                    setForm(prev => {
                                                        let updatedDays;

                                                        if (e.target.checked) {
                                                            updatedDays = [...prev.days, value];
                                                        } else {
                                                            updatedDays = prev.days.filter(d => d !== value);
                                                        }

                                                        let updatedTimes = { ...prev.dayTimes };

                                                        if (!e.target.checked) {
                                                            delete updatedTimes[value];
                                                        }

                                                        return {
                                                            ...prev,
                                                            days: updatedDays,
                                                            dayTimes: updatedTimes
                                                        };
                                                    });
                                                }}
                                            />
                                            {day}
                                        </label>
                                    ))}
                            </div>


                            {/* <input
                type="date"
                required
                onChange={(e)=>setForm({...form,Data:e.target.value})}
                className="w-full border px-3 py-2 rounded"
              /> */}

                            {form.days.map(day => (
                                <div key={day} className="flex items-center gap-3">

                                    <label className="w-28 font-medium">
                                        {day}
                                    </label>

                                    <input
                                        type="time"
                                        required
                                        value={form.dayTimes[day] || ""}
                                        onChange={(e) => {
                                            setForm(prev => ({
                                                ...prev,
                                                dayTimes: {
                                                    ...prev.dayTimes,
                                                    [day]: e.target.value
                                                }
                                            }));
                                        }}
                                        className="border px-3 py-2 rounded flex-1"
                                    />

                                </div>
                            ))}

                            <select
                                required
                                onChange={(e) => setForm({ ...form, tutor: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">Select Tutor</option>
                                {tutors.map(t => (
                                    <option key={t._id} value={t._id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPopup(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}