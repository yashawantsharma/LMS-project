import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
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

  const sidebarClasses = viewTheme === "dark"
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-white text-black border-gray-200";

  const headerBorderClasses = viewTheme === "dark"
    ? "border-gray-700"
    : "border-gray-200";

  const buttonHoverClasses = viewTheme === "dark"
    ? "hover:bg-gray-800"
    : "hover:bg-gray-100";

  return (
    <div className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-64 z-30 overflow-y-auto shadow-lg ${sidebarClasses}`}>
      <div className={`p-4 border-b ${headerBorderClasses}`}>
        <h3 className="text-lg font-semibold">Dashboard</h3>
      </div>

      <div className="flex flex-col p-4 space-y-2">
        <button
          onClick={() => handleNavigate("/")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          Dashboard
        </button>
        
        <button
          onClick={() => handleNavigate("/alltutors")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          🧑‍🏫 Tutors List
        </button>
        
        <button
          onClick={() => handleNavigate("/allstudent")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          🧑‍🏫 Student List
        </button>

        <button
          onClick={() => handleNavigate("/allemploye")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          👥 Employee List
        </button>

        <button
          onClick={() => handleNavigate("/allskill")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          🛠 Skill List
        </button>

        <button
          onClick={() => handleNavigate("/allcoures")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          📚 Course List
        </button>

        <button
          onClick={() => handleNavigate("/allmapping")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          🔗 Mapping List
        </button>

        <button
          onClick={() => handleNavigate("/couresbatch")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          📚 Course & Batch
        </button>

        <button
          onClick={() => handleNavigate("/allbatch")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          🧑‍🏫 Batch List
        </button>

        <button
          onClick={() => handleNavigate("/visitor")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          👤 Visitor
        </button>

        <button
          onClick={() => handleNavigate("/fees")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          💰 Fees
        </button>

        <button
          onClick={() => handleNavigate("/timetable")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          📅 Timetable
        </button>
        
        <button
          onClick={() => handleNavigate("/attendance")}
          className={`text-left px-3 py-2 rounded transition-colors ${buttonHoverClasses}`}
        >
          📋 Attendance
        </button>
      </div>
    </div>
  );
};

export default Sidebar;