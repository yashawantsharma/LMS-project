import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
    const [viewTheme, setViewTheme] = useState("");
    const [stats, setStats] = useState({
        enrolledCourses: 0,
        completedCourses: 0,
        pendingFees: 0,
        upcomingClasses: 0,
        tutorEngaged: 0
    });

    useEffect(() => {
        fetchTheme();
        fetchStats();
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

    const fetchStats = async () => {
        try {
            const courseRes = await axios.get("http://localhost:4040/course/findall");
            const feesRes = await axios.get("http://localhost:4040/fees/findall");

            setStats({
                enrolledCourses: courseRes.data.length,
                completedCourses: Math.floor(courseRes.data.length * 0.4),
                pendingFees: feesRes.data.filter(f => f.status !== "paid").length,
                upcomingClasses: 5,
                tutorEngaged: 3
            });

        } catch (err) {
            console.log(err);
        }
    };

    const themeClasses = viewTheme === "dark" 
        ? "bg-gray-900 text-white" 
        : "bg-gray-100 text-black";

    const cardThemeClasses = viewTheme === "dark"
        ? "bg-gray-800 text-white border-gray-700"
        : "bg-white text-black border-gray-200";

    const buttonClasses = viewTheme === "dark"
        ? "bg-indigo-700 text-white hover:bg-indigo-800"
        : "bg-indigo-600 text-white hover:bg-indigo-700";

    const secondaryButtonClasses = viewTheme === "dark"
        ? "bg-green-700 text-white hover:bg-green-800"
        : "bg-green-600 text-white hover:bg-green-700";

    const purpleButtonClasses = viewTheme === "dark"
        ? "bg-purple-700 text-white hover:bg-purple-800"
        : "bg-purple-600 text-white hover:bg-purple-700";

    const orangeButtonClasses = viewTheme === "dark"
        ? "bg-orange-700 text-white hover:bg-orange-800"
        : "bg-orange-600 text-white hover:bg-orange-700";

    const borderClasses = viewTheme === "dark"
        ? "border-gray-700"
        : "border-gray-200";

    const textMutedClasses = viewTheme === "dark"
        ? "text-gray-400"
        : "text-gray-600";

    return (
        <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${viewTheme === "dark" ? "text-white" : "text-gray-800"}`}>
                    Welcome Back Student!
                </h1>
                <p className={`mt-2 ${textMutedClasses}`}>
                    Here's your learning progress and updates
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                <Card title="Enrolled Courses" value={stats.enrolledCourses} theme={viewTheme} />
                <Card title="Completed Courses" value={stats.completedCourses} theme={viewTheme} />
                <Card title="Pending Fees" value={stats.pendingFees} theme={viewTheme} />
                <Card title="Upcoming Classes" value={stats.upcomingClasses} theme={viewTheme} />
                <Card title="Tutors Assigned" value={stats.tutorEngaged} theme={viewTheme} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className={`lg:col-span-2 p-6 rounded-xl shadow-lg ${cardThemeClasses}`}>
                    <h2 className="text-xl font-bold mb-4">My Courses</h2>
                    <div className="space-y-3">
                        <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${
                            viewTheme === "dark" ? "bg-gray-700" : "bg-blue-50"
                        }`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">Web Development</h3>
                                    <p className={`text-sm ${textMutedClasses}`}>Progress: 60%</p>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                    viewTheme === "dark" ? "bg-blue-900" : "bg-blue-200"
                                }`}>
                                    <span className="text-lg">📱</span>
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 rounded-lg border-l-4 border-green-500 ${
                            viewTheme === "dark" ? "bg-gray-700" : "bg-green-50"
                        }`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">JavaScript Advanced</h3>
                                    <p className={`text-sm ${textMutedClasses}`}>Progress: 45%</p>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                    viewTheme === "dark" ? "bg-green-900" : "bg-green-200"
                                }`}>
                                    <span className="text-lg">⚙️</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`p-6 rounded-xl shadow-lg ${cardThemeClasses}`}>
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className={`w-full p-3 rounded-lg font-semibold ${buttonClasses}`}>
                            View Courses
                        </button>
                        <button className={`w-full p-3 rounded-lg font-semibold ${secondaryButtonClasses}`}>
                            Pay Fees
                        </button>
                        <button className={`w-full p-3 rounded-lg font-semibold ${purpleButtonClasses}`}>
                            Contact Tutor
                        </button>
                        <button className={`w-full p-3 rounded-lg font-semibold ${orangeButtonClasses}`}>
                            View Timetable
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                <div className={`p-6 rounded-xl shadow-lg ${cardThemeClasses}`}>
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <div className="space-y-3 text-sm">
                        <div className={`pb-3 border-b ${borderClasses}`}>
                            <p className={viewTheme === "dark" ? "text-gray-200" : "text-gray-800"}>
                                <strong>Submitted:</strong> JavaScript Quiz
                            </p>
                            <p className={textMutedClasses}>2 days ago</p>
                        </div>
                        <div className={`pb-3 border-b ${borderClasses}`}>
                            <p className={viewTheme === "dark" ? "text-gray-200" : "text-gray-800"}>
                                <strong>Completed:</strong> CSS Module
                            </p>
                            <p className={textMutedClasses}>5 days ago</p>
                        </div>
                        <div>
                            <p className={viewTheme === "dark" ? "text-gray-200" : "text-gray-800"}>
                                <strong>Enrolled:</strong> React Advanced
                            </p>
                            <p className={textMutedClasses}>1 week ago</p>
                        </div>
                    </div>
                </div>

                <div className={`p-6 rounded-xl shadow-lg ${cardThemeClasses}`}>
                    <h2 className="text-xl font-bold mb-4">Important Notices</h2>
                    <div className="space-y-3 text-sm">
                        <div className={`p-3 border-l-4 border-yellow-500 rounded ${
                            viewTheme === "dark" ? "bg-gray-700" : "bg-yellow-50"
                        }`}>
                            <p className={viewTheme === "dark" ? "text-gray-200" : "text-gray-800"}>
                                <strong>⚠️ Fee Due:</strong> Your fees are due on 20th Feb
                            </p>
                        </div>
                        <div className={`p-3 border-l-4 border-blue-500 rounded ${
                            viewTheme === "dark" ? "bg-gray-700" : "bg-blue-50"
                        }`}>
                            <p className={viewTheme === "dark" ? "text-gray-200" : "text-gray-800"}>
                                <strong>✅ Class Update:</strong> New session starts Monday
                            </p>
                        </div>
                        <div className={`p-3 border-l-4 border-green-500 rounded ${
                            viewTheme === "dark" ? "bg-gray-700" : "bg-green-50"
                        }`}>
                            <p className={viewTheme === "dark" ? "text-gray-200" : "text-gray-800"}>
                                <strong>📢 Announcement:</strong> Quiz rescheduled for tomorrow
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ title, value, theme }) {
    const cardClasses = theme === "dark"
        ? "bg-gray-800 text-white border-gray-700"
        : "bg-white text-black border-gray-200";

    const textMutedClasses = theme === "dark"
        ? "text-gray-400"
        : "text-gray-600";

    const valueClasses = theme === "dark"
        ? "text-white"
        : "text-gray-800";

    return (
        <div className={`p-5 rounded-xl shadow-lg hover:shadow-xl transition ${cardClasses}`}>
            <div>
                <p className={`text-sm font-semibold ${textMutedClasses}`}>{title}</p>
                <h2 className={`text-3xl font-bold mt-2 ${valueClasses}`}>{value}</h2>
            </div>
        </div>
    );
}