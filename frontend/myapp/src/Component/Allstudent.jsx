import axios from "axios";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdCheckCircle, MdCancel, MdVisibility } from "react-icons/md";

export default function Allstudent() {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [viewTheme, setViewTheme] = useState("");

  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [view, setView] = useState("active");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    fees: "",
  });

  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => {
    fetchTheme();
    fetchStudents();
    fetchCourses();
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
    try {
      const res = await axios.get("http://localhost:4040/student/findall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:4040/course/findall");
    setCourses(res.data);
  };

  useEffect(() => {
    let data = [...students];

    data = view === "active"
      ? data.filter((s) => s.isactive)
      : data.filter((s) => !s.isactive);

    if (search) {
      data = data.filter((s) =>
        s.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "feesLow") {
      data.sort((a, b) => a.fees - b.fees);
    }
    if (sort === "feesHigh") {
      data.sort((a, b) => b.fees - a.fees);
    }

    setFiltered(data);
  }, [students, view, search, sort]);

  const trashCount = students.filter((s) => !s.isactive).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4040/student/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Student added successfully");
      setShowAdd(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        course: "",
        fees: "",
      });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Add failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4040/student/update/${editStudent._id}`,
        editStudent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEdit(false);
      fetchStudents();
    } catch (err) {
      setError("Update failed");
    }
  };

  const moveToTrash = async (id) => {
    await axios.put(`http://localhost:4040/student/delete/${id}`);
    fetchStudents();
  };

  const restoreStudent = async (id) => {
    await axios.post(
      `http://localhost:4040/student/delete/${id}`,
      { isactive: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchStudents();
  };

  const movetoinactive = async (id) => {
    await axios.post(
      `http://localhost:4040/student/active/${id}`,
      { isactive: false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchStudents();
  };

  const handleView = (student) => {
    setViewData(student);
    setViewOpen(true);
  };

  const [tab, setTab] = useState("active");

  const showhandel = filtered.filter(emp =>
    tab === "active" || tab === "inactive"
      ? emp.status === "active" || emp.status === "inactive"
      : emp.status === "deleted"
  );
  

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
    : "bg-gray-800 text-white";

  const tableRowClasses = viewTheme === "dark"
    ? "border-gray-700 hover:bg-gray-800"
    : "border-gray-200 hover:bg-gray-50";

  return (
    <div className={`ml-58 mt-10 p-6 min-h-screen ${themeClasses}`}>
      <h1 className="text-2xl font-bold mb-6">
        Student Management
      </h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTab("active")}
          className={`px-4 py-2 rounded ${
            tab === "active"
              ? "bg-indigo-600 text-white"
              : viewTheme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200 text-black"
          }`}
        >
          Active Students
        </button>

        <button
          onClick={() => setTab("trash")}
          className={`px-4 py-2 rounded ${
            tab === "trash"
              ? "bg-red-600 text-white"
              : viewTheme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200 text-black"
          }`}
        >
          Trash ({trashCount})
        </button>

        {/* <button
          onClick={() => setShowAdd(true)}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Student
        </button> */}
      </div>

      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`border px-3 py-2 rounded w-1/3 ${inputThemeClasses}`}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={`border px-3 py-2 rounded ${inputThemeClasses}`}
        >
          <option value="">Sort By</option>
          <option value="feesLow">Fees Low → High</option>
          <option value="feesHigh">Fees High → Low</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )}

      <div className={`overflow-x-auto rounded-xl shadow ${cardThemeClasses}`}>
        <table className="min-w-full">
          <thead className={tableHeaderClasses}>
            <tr>
              <th className="px-2 py-3 text-left">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Status</th>
              <th>Date</th>
              <th className="pr-15">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className={`text-center py-6 ${
                  viewTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  Loading...
                </td>
              </tr>
            ) : showhandel.length === 0 ? (
              <tr>
                <td colSpan="7" className={`text-center py-6 ${
                  viewTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  No students found
                </td>
              </tr>
            ) : (
              showhandel.map((student) => (
                <tr key={student._id} className={`border-b ${tableRowClasses}`}>
                  <td className="px-5 py-3 text-left">{student.visitor?.name}</td>
                  <td>{student.visitor?.email}</td>
                  <td>{student.visitor?.phone}</td>
                  <td>
                    {courses.find(c => c._id === student.visitor?.coures)?.name || "No Course"}
                  </td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      student.visitor?.status === "active"
                        ? "bg-green-100 text-green-700"
                        : student.visitor?.status === "inactive"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                      {student.visitor?.status || "Unknown"}
                    </span>
                  </td>
                  <td>
                    {new Date(student.date).toLocaleDateString()}
                  </td>
                  <td className="space-x-2 pl-10">
                    <button
                      onClick={() => handleView(student)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <MdVisibility size={20} />
                    </button>
                    
                    <button
                      onClick={() => {
                        setEditStudent(student);
                        setShowEdit(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <MdEdit size={20} />
                    </button>
                    
                    <button
                      onClick={() => moveToTrash(student._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDelete size={20} />
                    </button>

                    {view === "active" ? (
                      <button
                        onClick={() => movetoinactive(student._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <MdCheckCircle size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => restoreStudent(student._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewOpen && viewData && (
        <ViewModal
          data={viewData}
          courses={courses}
          onClose={() => setViewOpen(false)}
          theme={viewTheme}
        />
      )}

      {showAdd && (
        <Modal title="Add Student" close={() => setShowAdd(false)} theme={viewTheme}>
          <StudentForm
            form={form}
            setForm={setForm}
            courses={courses}
            onSubmit={handleAdd}
            theme={viewTheme}
          />
        </Modal>
      )}

      {showEdit && editStudent && (
        <Modal title="Edit Student" close={() => setShowEdit(false)} theme={viewTheme}>
          <StudentForm
            form={editStudent}
            setForm={setEditStudent}
            courses={courses}
            onSubmit={handleUpdate}
            theme={viewTheme}
          />
        </Modal>
      )}
    </div>
  );
}

function ViewModal({ data, courses, onClose, theme }) {
  const themeClasses = theme === "dark"
    ? "bg-gray-800 text-white"
    : "bg-white text-black";

  const borderClasses = theme === "dark"
    ? "border-gray-700"
    : "border-gray-200";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0  bg-opacity-50" onClick={onClose} />
      <div className={`relative p-6 rounded-xl shadow-xl w-[90%] max-w-2xl ${themeClasses}`}>
        <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${borderClasses}`}>
          Student Details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <p><b>Name:</b> {data.visitor?.name}</p>
          <p><b>Email:</b> {data.visitor?.email}</p>
          <p><b>Fees:</b> ₹{data.fees}</p>
          <p><b>Status:</b> 
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              data.visitor?.status === "active"
                ? "bg-green-100 text-green-700"
                : data.visitor?.status === "inactive"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}>
              {data.visitor?.status}
            </span>
          </p>
          <p><b>Phone:</b> {data.visitor?.phone}</p>
          <p><b>Course:</b> {courses.find(c => c._id === data.visitor?.coures)?.name || "No Course"}</p>
          <p><b>Date:</b> {new Date(data.date).toLocaleDateString()}</p>
        </div>

        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              theme === "dark"
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentForm({ form, setForm, courses, onSubmit, theme }) {
  const inputThemeClasses = theme === "dark"
    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
    : "bg-white text-black border-gray-300";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        placeholder="Name"
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
        required
      />

      <input
        placeholder="Email"
        type="email"
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
        required
      />

      <input
        placeholder="Phone"
        value={form.phone || ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
        required
      />

      <select
        value={form.course || ""}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
        className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
        required
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Fees"
        value={form.fees || ""}
        onChange={(e) => setForm({ ...form, fees: e.target.value })}
        className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
        required
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700">
        Save
      </button>
    </form>
  );
}

function Modal({ children, title, close, theme }) {
  const themeClasses = theme === "dark"
    ? "bg-gray-800 text-white"
    : "bg-white text-black";

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className={`w-full max-w-md p-6 rounded-xl shadow-xl ${themeClasses}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button
          onClick={close}
          className={`mt-4 w-full py-2 rounded ${
            theme === "dark"
              ? "bg-gray-600 text-white hover:bg-gray-700"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}