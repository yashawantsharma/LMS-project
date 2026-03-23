import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function StudentTimeTable() {
    const token = localStorage.getItem("token");
    const [viewTheme, setViewTheme] = useState("");
    const [events, setEvents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");

    useEffect(() => {
        fetchTheme();
        fetchCourses();
        fetchBatches();
        fetchTimetable();
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

    const fetchCourses = async () => {
        const res = await axios.get("http://localhost:4040/course/findall");
        setCourses(res.data);
    };

    const fetchBatches = async () => {
        const res = await axios.get("http://localhost:4040/batch/allbatch");
        setBatches(res.data);
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

    const themeClasses = viewTheme === "dark" 
        ? "bg-gray-900 text-white" 
        : "bg-gray-100 text-black";

    const cardThemeClasses = viewTheme === "dark"
        ? "bg-gray-800 text-white border-gray-700"
        : "bg-white text-black border-gray-200";

    const inputThemeClasses = viewTheme === "dark"
        ? "bg-gray-700 text-white border-gray-600"
        : "bg-white text-black border-gray-300";

    return (
        <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
            <h1 className="text-2xl font-bold mb-6">
                My Timetable
            </h1>

            

            <div className={`p-4 rounded-xl shadow-lg ${cardThemeClasses}`}>
                <Calendar
                    key={events.length}
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 650 }}
                    views={["month", "week", "day"]}
                    popup
                    className={viewTheme === "dark" ? "dark" : ""}
                />
            </div>
        </div>
    );
}