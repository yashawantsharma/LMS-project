import { useEffect, useState } from "react";
import axios from "axios";

export default function Alltutors() {
  const token = localStorage.getItem("token");

  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [viewTheme, setViewTheme] = useState("");

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [selectedTutor, setSelectedTutor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    salary: "",
    experience: "",
    course: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTheme();
    fetchTutors();
    fetchCourses();
  }, []);

  useEffect(() => {
    filterData();
  }, [tutors, search, showTrash, sortField]);

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

  const fetchTutors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4040/tutor/findall",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTutors(res.data);
    } catch (err) {
      setError("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:4040/course/findall");
      setCourses(res.data);
    } catch (err) {
      console.log("Error fetching courses:", err);
    }
  };

  const filterData = () => {
    let data = [...tutors];

    data = data.filter(t =>
      showTrash ? !t.isactive : t.isactive
    );

    if (search) {
      data = data.filter(t =>
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) =>
      a[sortField]?.toString().localeCompare(
        b[sortField]?.toString()
      )
    );

    setFilteredTutors(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4040/tutor/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Tutor added successfully");
      setShowAddPopup(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        salary: "",
        experience: "",
        course: ""
      });
      fetchTutors();
    } catch (err) {
      setError("Failed to add tutor");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:4040/tutor/update/${selectedTutor._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditPopup(false);
      fetchTutors();
    } catch (err) {
      setError("Failed to update tutor");
    }
  };

  const toggleStatus = async (id, current) => {
    try {
      await axios.post(
        `http://localhost:4040/tutor/active/${id}`,
        { isactive: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTutors();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const themeClasses = viewTheme === "dark" 
    ? "bg-gray-900 text-white" 
    : "bg-gray-100 text-black";

  const inputThemeClasses = viewTheme === "dark"
    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
    : "bg-white text-black border-gray-300";

  return (
    <div className={`ml-58 mt-10 p-6 min-h-screen ${themeClasses}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Tutors Management
        </h1>
      </div>

      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search tutor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`border px-4 py-2 rounded-lg w-64 ${inputThemeClasses}`}
        />
        
        <button
          onClick={() => setShowAddPopup(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Tutor
        </button>
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowTrash(false)}
          className={`px-4 py-2 rounded-lg ${
            !showTrash
              ? "bg-green-600 text-white"
              : viewTheme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200 text-black"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setShowTrash(true)}
          className={`px-4 py-2 rounded-lg ${
            showTrash
              ? "bg-red-600 text-white"
              : viewTheme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200 text-black"
          }`}
        >
          Trash
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className={`min-w-full border rounded-lg ${
          viewTheme === "dark" ? "border-gray-700" : "border-gray-300"
        }`}>
          <thead className={viewTheme === "dark" ? "bg-gray-700 text-white" : "bg-gray-800 text-white"}>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Salary</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className={`text-center py-4 ${
                  viewTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  Loading...
                </td>
              </tr>
            ) : filteredTutors.length === 0 ? (
              <tr>
                <td colSpan="7" className={`text-center py-4 ${
                  viewTheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  No tutors found
                </td>
              </tr>
            ) : (
              filteredTutors.map(tutor => (
                <tr key={tutor._id} className={`border-b ${
                  viewTheme === "dark" 
                    ? "border-gray-700 hover:bg-gray-800" 
                    : "border-gray-200 hover:bg-gray-50"
                }`}>
                  <td className="px-4 py-3">{tutor.name}</td>
                  <td>{tutor.email}</td>
                  <td>{tutor.phone}</td>
                  <td>₹ {tutor.salary}</td>
                  <td>{tutor.experience}</td>

                  <td>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tutor.isactive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {tutor.isactive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => {
                        setSelectedTutor(tutor);
                        setForm(tutor);
                        setShowEditPopup(true);
                      }}
                      className="text-indigo-600 mr-3 hover:text-indigo-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleStatus(tutor._id, tutor.isactive)}
                      className={tutor.isactive ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}
                    >
                      {tutor.isactive ? "Trash" : "Restore"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddPopup && (
        <Popup
          title="Add Tutor"
          form={form}
          setForm={setForm}
          courses={courses}
          onSubmit={handleAdd}
          onClose={() => {
            setShowAddPopup(false);
            setForm({
              name: "",
              email: "",
              phone: "",
              salary: "",
              experience: "",
              course: ""
            });
          }}
          theme={viewTheme}
        />
      )}

      {showEditPopup && (
        <Popup
          title="Edit Tutor"
          form={form}
          courses={courses}
          setForm={setForm}
          onSubmit={handleEdit}
          onClose={() => {
            setShowEditPopup(false);
            setSelectedTutor(null);
          }}
          theme={viewTheme}
        />
      )}
    </div>
  );
}

function Popup({ title, form, setForm, courses, onSubmit, onClose, theme }) {
  const themeClasses = theme === "dark"
    ? "bg-gray-800 text-white"
    : "bg-white text-black";

  const inputThemeClasses = theme === "dark"
    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
    : "bg-white text-black border-gray-300";

  return (
    <div className="fixed inset-0 k bg-opacity-50 flex justify-center items-center z-50">
      <div className={`w-full max-w-md rounded-xl p-6 shadow-xl ${themeClasses}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>

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
          
          <input
            type="number"
            placeholder="Salary"
            value={form.salary || ""}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
          />
          
          <select
            value={form.course || ""}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          
          <input
            placeholder="Experience"
            value={form.experience || ""}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
          />

          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                theme === "dark" 
                  ? "bg-gray-600 text-white hover:bg-gray-700" 
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}