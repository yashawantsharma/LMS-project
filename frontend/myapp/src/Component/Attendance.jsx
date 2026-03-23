import { useEffect, useState } from "react";
import axios from "axios";

const getLastDays = (days = 10) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
  }
  return dates;
};

const Attendance = () => {
  const [viewTheme, setViewTheme] = useState("");
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [mappings, setMappings] = useState([]);
  
  const dates = getLastDays(10);

  useEffect(() => {
    fetchTheme();
    axios.get("http://localhost:4040/attendances/findall")
      .then(res => {
        const map = {};
        res.data.forEach(att => {
          const studentId = att.studentId._id;
          const dateStr = new Date(att.date)
            .toISOString()
            .split("T")[0];
          const key = `${studentId}_${dateStr}`;
          map[key] = att.status;
        });
        setAttendanceMap(map);
      });
      
    axios.get("http://localhost:4040/course/findall")
      .then(res => setCourses(res.data))
      .catch(err => console.error("Error loading courses:", err));
      
    axios.get("http://localhost:4040/couresbatch/course-wise")
      .then(res => setMappings(res.data))
      .catch(err => console.error("Error loading mappings:", err));
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

  useEffect(() => {
    if (selectedCourse) {
      setLoading(true);
      
      axios.get(`http://localhost:4040/couresbatch/batches/${selectedCourse}`)
        .then(res => {
          setBatches(res.data);
          setSelectedBatch(""); 
          setStudents([]); 
        })
        .catch(err => console.error("Error loading batches:", err))
        .finally(() => setLoading(false));
    } else {
      setBatches([]);
      setSelectedBatch("");
      setStudents([]);
    }
  }, [selectedCourse, mappings]);

  useEffect(() => {
    if (selectedBatch) {
      setLoading(true);
      
      axios.get(`http://localhost:4040/student/batch/${selectedBatch}`)
        .then(res => {
          setStudents(res.data);
          loadAttendanceForBatch(selectedBatch);
        })
        .catch(err => console.error("Error loading students:", err))
        .finally(() => setLoading(false));
    } else {
      setStudents([]);
    }
  }, [selectedBatch]);

  const loadAttendanceForBatch = (batchId) => {
    axios.get(`http://localhost:4040/attendances/batch/${batchId}`)
      .then(res => {
        const map = {};
        res.data.forEach(att => {
          const key = `${att.studentId}_${att.date}`;
          map[key] = att.status;
        });
        setAttendanceMap(map);
      })
      .catch(err => console.error("Error loading attendance:", err));
  };

  const markAttendance = (studentId, status, date) => {
    const dateStr = date.toISOString().split("T")[0];
    
    axios.post("http://localhost:4040/attendances/mark", {
      studentId,
      batchId: selectedBatch,
      status,
      date: dateStr
    })
    .then(() => {
      const key = `${studentId}_${dateStr}`;
      setAttendanceMap(prev => ({
        ...prev,
        [key]: status
      }));
    })
    .catch(err => console.error("Error marking attendance:", err));
  };

  const getAttendanceStatus = (studentId, date) => {
    const dateStr = date.toISOString().split("T")[0];
    const key = `${studentId}_${dateStr}`;
    return attendanceMap[key] || "";
  };

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
    : "bg-gray-100 text-black";

  const tableRowClasses = viewTheme === "dark"
    ? "border-gray-700 hover:bg-gray-800"
    : "border-gray-200 hover:bg-gray-50";

  const borderClasses = viewTheme === "dark"
    ? "border-gray-700"
    : "border-gray-300";

  const labelClasses = viewTheme === "dark"
    ? "text-gray-300"
    : "text-gray-700";

  return (
    <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
      <h1 className="text-2xl font-bold mb-6">
        Attendance Management
      </h1>
    
      <div className="mb-6 flex gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${labelClasses}`}>
            Select Course
          </label>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={`border p-2 rounded w-64 ${inputThemeClasses}`}
          >
            <option value="">-- Select Course --</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${labelClasses}`}>
            Select Batch
          </label>
          <select 
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className={`border p-2 rounded w-64 ${inputThemeClasses}`}
            disabled={!selectedCourse || loading || batches.length === 0}
          >
            <option value="">-- Select Batch --</option>
            {batches.map(batch => (
              <option key={batch._id} value={batch._id}>
                {batch.batchName} {batch.timing ? `(${batch.timing})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p className={viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Loading...
          </p>
        </div>
      )}

      {selectedCourse && batches.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-yellow-600">No batches found for this course</p>
        </div>
      )}

      {selectedBatch && students.length > 0 && (
        <>
          <h3 className={`text-lg font-semibold mb-4 ${viewTheme === "dark" ? "text-white" : "text-gray-800"}`}>
            Attendance for Batch: {batches.find(b => b._id === selectedBatch)?.batchName}
          </h3>
          
          <div className="overflow-x-auto">
            <table className={`border w-full text-sm ${borderClasses}`}>
              <thead className={tableHeaderClasses}>
                <tr>
                  <th className={`border p-2 ${borderClasses}`}>Name</th>
                  <th className={`border p-2 ${borderClasses}`}>Email</th>
                  <th className={`border p-2 ${borderClasses}`}>Phone</th>
                  {dates.map(d => (
                    <th key={d} className={`border p-2 min-w-[80px] ${borderClasses}`}>
                      {d.toLocaleDateString()}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {students.map(s => (
                  <tr key={s._id} className={tableRowClasses}>
                    <td className={`border p-2 ${borderClasses}`}>{s.user?.name || s.name}</td>
                    <td className={`border p-2 ${borderClasses}`}>{s.user?.email || s.email}</td>
                    <td className={`border p-2 ${borderClasses}`}>{s.user?.phone || s.phone}</td>

                    {dates.map(d => {
                      const currentStatus = getAttendanceStatus(s._id, d);
                      
                      return (
                        <td key={d} className={`border p-2 ${borderClasses}`}>
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              markAttendance(s._id, e.target.value, d)
                            }
                            className={`border p-1 w-full rounded ${
                              currentStatus === 'present' ? 'bg-green-100 text-green-700' :
                              currentStatus === 'absent' ? 'bg-red-100 text-red-700' :
                              currentStatus === 'online' ? 'bg-blue-100 text-blue-700' : 
                              viewTheme === "dark" ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'
                            }`}
                          >
                            <option value="">-</option>
                            <option value="present">Present (P)</option>
                            <option value="absent">Absent (A)</option>
                            <option value="online">Online (PO)</option>
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedBatch && students.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className={viewTheme === "dark" ? "text-gray-400" : "text-gray-500"}>
            No students found in this batch
          </p>
        </div>
      )}
    </div>
  );
};

export default Attendance;