import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const StudentSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [viewTheme, setViewTheme] = useState("");

    useEffect(() => {
        fetchTheme();
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

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const sidebarClasses = viewTheme === "dark"
        ? "bg-gray-900 text-white border-gray-700"
        : "bg-white text-black border-gray-200";

    const headerBorderClasses = viewTheme === "dark"
        ? "border-gray-700"
        : "border-gray-200";

    const buttonHoverClasses = viewTheme === "dark"
        ? "hover:bg-gray-800"
        : "hover:bg-gray-100";

    const activeButtonClasses = viewTheme === "dark"
        ? "bg-indigo-700 text-white"
        : "bg-indigo-600 text-white";

    const inactiveButtonClasses = viewTheme === "dark"
        ? "text-gray-300 hover:bg-gray-800"
        : "text-gray-600 hover:bg-gray-100";

    const logoutButtonClasses = viewTheme === "dark"
        ? "bg-red-700 hover:bg-red-800 text-white"
        : "bg-red-600 hover:bg-red-700 text-white";

    return (
        <div className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-64 z-30 overflow-y-auto shadow-lg ${sidebarClasses}`}>
            {/* <div className={`p-4 border-b ${headerBorderClasses}`}>
                <h3 className="text-lg font-bold">📚 Student Menu</h3>
            </div> */}

            <div className="flex flex-col p-4 space-y-2">
                <button
                    onClick={() => handleNavigate("/studentdashboard")}
                    className={`text-left px-4 py-3 rounded-lg font-semibold transition ${
                        isActive("/studentdashboard")
                            ? activeButtonClasses
                            : inactiveButtonClasses
                    }`}
                >
                    📊 Dashboard
                </button>

                <button
                    onClick={() => handleNavigate("/studenttimetable")}
                    className={`text-left px-4 py-3 rounded-lg font-semibold transition ${
                        isActive("/studenttimetable")
                            ? activeButtonClasses
                            : inactiveButtonClasses
                    }`}
                >
                    📅 Time Table
                </button>
            </div>

            <div className={`px-4 py-4 border-t ${headerBorderClasses} mt-auto`}>
                <button
                    onClick={handleLogout}
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition ${logoutButtonClasses}`}
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
};

export default StudentSidebar;