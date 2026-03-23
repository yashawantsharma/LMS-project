import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    tutors: 0,
    employees: 0,
    courses: 0,
    batches: 0
  });
  const [viewTheme, setViewTheme] = useState("");

  useEffect(() => {
     const token = localStorage.getItem("token");
    if (!token){
      alert("Please login is first");
      navigate("/login");
      return;
    }
    fetchTheme();
    fetchStats();
  }, [viewTheme]);
  const navigate = useNavigate();

  const fetchTheme = async () => {
    const token = localStorage.getItem("token");
    if (!token){
      alert("Please login is first");
      navigate("/login");
      return;
    }
    const res = await axios.get(
      "http://localhost:4040/users/theme",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setViewTheme(res.data.theme);
  };

  const fetchStats = async () => {
    try {
      const studentRes = await axios.get("http://localhost:4040/student/findall");
      const tutorRes = await axios.get("http://localhost:4040/tutor/findall");
      const empRes = await axios.get("http://localhost:4040/employe/findall");
      const courseRes = await axios.get("http://localhost:4040/course/findall");
      const batchRes = await axios.get("http://localhost:4040/batch/allbatch");

      setStats({
        students: studentRes.data.length,
        tutors: tutorRes.data.length,
        employees: empRes.data.length,
        courses: courseRes.data.length,
        batches: batchRes.data.length
      });
    } catch (err) {
      console.log(err);
    }
  };

  
  const themeClasses = viewTheme === "dark" 
    ? "bg-gray-900 text-white" 
    : "bg-white text-black";

  return (
    <div className={`flex min-h-screen ${themeClasses}`}>
      
      <div className={`w-64 p-5 ${themeClasses}`}>
        <h2 className="text-xl font-bold mb-6">LMS Admin</h2>
        <ul className="space-y-3">
          <li className="p-2 rounded">Dashboard</li>
          <li className="p-2 rounded">Students</li>
          <li className="p-2 rounded">Tutors</li>
          <li className="p-2 rounded">Employees</li>
          <li className="p-2 rounded">Courses</li>
          <li className="p-2 rounded">Batches</li>
        </ul>
      </div>

     
      <div className={`flex-1 ${themeClasses}`}>
       
        <div className={`px-6 py-4 flex justify-between ${themeClasses}`}>
          <h1 className="font-semibold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button className="bg-blue-600 px-3 py-1 rounded text-white">
              Profile
            </button>
            <button className="bg-red-500 px-3 py-1 rounded text-white">
              Logout
            </button>
          </div>
        </div>

        
        <div className={`p-6 space-y-6 ${themeClasses}`}>
         
          <div className="grid grid-cols-5 gap-5">
            <Card title="Students" value={stats.students} theme={viewTheme} />
            <Card title="Tutors" value={stats.tutors} theme={viewTheme} />
            <Card title="Employees" value={stats.employees} theme={viewTheme} />
            <Card title="Courses" value={stats.courses} theme={viewTheme} />
            <Card title="Batches" value={stats.batches} theme={viewTheme} />
          </div>

         
          <div className="grid grid-cols-3 gap-5">
            <SummaryBox
              title="Students Summary"
              theme={viewTheme}
              data={[
                { label: "Active", value: 5 },
                { label: "Inactive", value: 3 },
                { label: "Suspended", value: 2 }
              ]}
            />
            <SummaryBox
              title="Courses Summary"
              theme={viewTheme}
              data={[
                { label: "Published", value: 5 },
                { label: "Draft", value: 1 },
                { label: "Archived", value: 2 }
              ]}
            />
            <SummaryBox
              title="Visitors Summary"
              theme={viewTheme}
              data={[
                { label: "Follow Up", value: 0 },
                { label: "Converted", value: 4 }
              ]}
            />
          </div>

         
          <div className="grid grid-cols-2 gap-5">
            <div className={`border p-5 rounded-xl shadow ${themeClasses}`}>
              <h3 className="font-semibold mb-3">Recent Students</h3>
              <p className="text-gray-400">No data</p>
            </div>
            <div className={`border p-5 rounded-xl shadow ${themeClasses}`}>
              <h3 className="font-semibold mb-3">Upcoming Dues</h3>
              <p className="text-gray-400">No dues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


function Card({ title, value, theme }) {
  const themeClasses = theme === "dark" 
    ? "bg-gray-900 text-white border-gray-700" 
    : "bg-white text-black border-gray-200";
  
  return (
    <div className={`border p-5 rounded-xl shadow ${themeClasses}`}>
      <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}


function SummaryBox({ title, data, theme }) {
  const themeClasses = theme === "dark" 
    ? "bg-gray-900 text-white border-gray-700" 
    : "bg-white text-black border-gray-200";
  
  return (
    <div className={`border p-5 rounded-xl shadow ${themeClasses}`}>
      <h3 className="font-semibold mb-3">{title}</h3>
      {data.map(d => (
        <div key={d.label} className="flex justify-between py-1 text-sm">
          <span>{d.label}</span>
          <span>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;