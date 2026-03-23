import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function Timetable() {
    const token = localStorage.getItem("token");
    const [viewTheme, setViewTheme] = useState("");

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
        fetchTheme();
        fetchCourses();
        fetchTutors();
        fetchTimetable();
        fetchStudents();
    }, []);

    const fetchTheme = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:4040/users/theme",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setViewTheme(res.data.theme);
        } catch (error) {
            console.log("Error fetching theme:", error);
        }
    };

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
        setBatches(res.data);
    };

    const fetchTutors = async () => {
        const res = await axios.get(
            "http://localhost:4040/tutor/findall",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTutors(res.data);
    };

    const fetchTimetable = async () => {
        const res = await axios.get("http://localhost:4040/timetable/findall");
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
                        title: `${t.course?.name} - ${s.time}`,
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

    const batchStudents = students.filter(s => s.batch?._id === selectedBatch);

    const themeClasses = viewTheme === "dark" 
        ? "bg-gray-900 text-white" 
        : "bg-gray-100 text-black";

    const cardThemeClasses = viewTheme === "dark"
        ? "bg-gray-800 text-white border-gray-700"
        : "bg-white text-black border-gray-200";

    const inputThemeClasses = viewTheme === "dark"
        ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
        : "bg-white text-black border-gray-300";

    const tableHeaderClasses = viewTheme === "dark"
        ? "bg-gray-700 text-white"
        : "bg-indigo-600 text-white";

    const tableRowClasses = viewTheme === "dark"
        ? "border-gray-700 hover:bg-gray-800"
        : "border-gray-200 hover:bg-gray-50";

    const borderClasses = viewTheme === "dark"
        ? "border-gray-700"
        : "border-gray-300";

    const buttonClasses = viewTheme === "dark"
        ? "bg-green-700 text-white hover:bg-green-800"
        : "bg-green-600 text-white hover:bg-green-700";

    const cancelButtonClasses = viewTheme === "dark"
        ? "bg-gray-600 text-white hover:bg-gray-700"
        : "bg-gray-300 text-black hover:bg-gray-400";

    const saveButtonClasses = viewTheme === "dark"
        ? "bg-indigo-700 text-white hover:bg-indigo-800"
        : "bg-indigo-600 text-white hover:bg-indigo-700";

    return (
        <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
            <h1 className="text-2xl font-bold mb-6">
                Timetable Management
            </h1>

            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <select
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        value={selectedCourse}
                        className={`border px-3 py-2 rounded ${inputThemeClasses}`}
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
                            value={selectedBatch}
                            className={`border px-3 py-2 rounded ${inputThemeClasses}`}
                        >
                            <option value="">Select Batch</option>
                            {batches
                                .filter(b => b.course?._id === selectedCourse)
                                .map(b => (
                                    <option key={b._id} value={b._id}>
                                        {b.batchName}
                                    </option>
                                ))}
                        </select>
                    )}
                </div>

                {selectedCourse && selectedBatch && (
                    <button
                        onClick={() => setShowPopup(true)}
                        className={`px-4 py-2 rounded ${buttonClasses}`}
                    >
                        + Add Timetable
                    </button>
                )}
            </div>

            <div className={`p-4 rounded-xl shadow-lg ${cardThemeClasses}`}>
                {selectedCourse && selectedBatch ? (
                    <Calendar
                        key={events.length}
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 650 }}
                        views={["month", "week", "day"]}
                        popup
                        className={viewTheme === "dark" ? "rbc-dark" : ""}
                    />
                ) : (
                    <div className="text-center py-20">
                        <p className={viewTheme === "dark" ? "text-gray-400" : "text-gray-500"}>
                            Please select a course and batch to view timetable
                        </p>
                    </div>
                )}
            </div>

            {selectedCourse && selectedBatch && (
                <div className={`mt-8 p-6 rounded-2xl shadow-md ${cardThemeClasses}`}>
                    <h2 className={`text-xl font-bold mb-4 ${viewTheme === "dark" ? "text-white" : "text-gray-800"}`}>
                        Batch Details
                    </h2>

                    <p className={`mb-2 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        <strong>Batch:</strong>{" "}
                        {batches.find(b => b._id === selectedBatch)?.batchName}
                    </p>

                    <p className={`mb-4 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        <strong>Total Students:</strong> {batchStudents.length}
                    </p>

                    {batchStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border rounded-lg overflow-hidden">
                                <thead className={tableHeaderClasses}>
                                    <tr>
                                        <th className="p-2 text-left">Name</th>
                                        <th className="p-2 text-left">Email</th>
                                        <th className="p-2 text-left">Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batchStudents.map(student => (
                                        <tr key={student._id} className={`border-b ${tableRowClasses}`}>
                                            <td className="p-2">
                                                {student.visitor?.name || "N/A"}
                                            </td>
                                            <td className="p-2">
                                                {student.visitor?.email || "N/A"}
                                            </td>
                                            <td className="p-2">
                                                {student.visitor?.phone || "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className={`text-center py-4 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            No students enrolled in this batch
                        </p>
                    )}
                </div>
            )}

            {showPopup && (
                <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
                    <div className={`w-full max-w-md rounded-xl p-6 shadow-xl ${cardThemeClasses}`}>
                        <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${borderClasses}`}>
                            Add Timetable
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                                    .map(day => (
                                        <label key={day} className={`flex items-center gap-2 text-sm ${viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
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
                                                className="accent-indigo-600"
                                            />
                                            {day.slice(0, 3)}
                                        </label>
                                    ))}
                            </div>

                            {form.days.map(day => (
                                <div key={day} className="flex items-center gap-3">
                                    <label className={`w-28 font-medium ${viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
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
                                        className={`border px-3 py-2 rounded flex-1 ${inputThemeClasses}`}
                                    />
                                </div>
                            ))}

                            <select
                                required
                                value={form.tutor || ""}
                                onChange={(e) => setForm({ ...form, tutor: e.target.value })}
                                className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
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
                                    className={`px-4 py-2 rounded ${cancelButtonClasses}`}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded ${saveButtonClasses}`}
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