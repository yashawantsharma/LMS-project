import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Power, RotateCcw } from "lucide-react";

export default function Batch() {
  const token = localStorage.getItem("token");
  const [viewTheme, setViewTheme] = useState("");

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [sortField, setSortField] = useState("batchName");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [student, setStudent] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [form, setForm] = useState({
    batchName: "",
    course: "",
    tutor: "",
    student: "",
    startDate: "",
    endDate: "",
    status: "upcoming"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTheme();
    fetchAll();
    studenthandel();
  }, []);

  useEffect(() => {
    filterData();
  }, [batches, search, showTrash, sortField]);

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

  const studenthandel = async () => {
    try {
      const res = await axios.get("http://localhost:4040/student/findall");
      setStudent(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAll = async () => {
    try {
      const batchRes = await axios.get(
        "http://localhost:4040/batch/allbatch",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBatches(batchRes.data);

      const courseRes = await axios.get(
        "http://localhost:4040/course/findall",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(courseRes.data);

      const tutorRes = await axios.get(
        "http://localhost:4040/tutor/findall",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTutors(tutorRes.data);
    } catch (err) {
      setError("Failed to load batch data");
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let data = [...batches];
    data = data.filter(b => showTrash ? !b.isActive : b.isActive);
    if (search) {
      data = data.filter(b =>
        b.batchName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    data.sort((a, b) =>
      a[sortField]?.toString().localeCompare(b[sortField]?.toString())
    );
    setFilteredBatches(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.batchName || !form.course || !form.tutor || !form.student || form.student === "" || form.student === "0" || !form.startDate || !form.endDate) {
      alert("All fields required");
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      alert("Start date cannot be after end date");
      return;
    }
    try {
      await axios.post(
        "http://localhost:4040/batch/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddPopup(false);
      fetchAll();
      setForm({
        batchName: "",
        course: "",
        tutor: "",
        student: "",
        startDate: "",
        endDate: "",
        status: "upcoming"
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add batch");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4040/batch/updatebatch/${selectedBatch._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditPopup(false);
      fetchAll();
    } catch {
      setError("Failed to update batch");
    }
  };

  const toggleStatus = async (id, current) => {
    try {
      await axios.put(
        `http://localhost:4040/batch/activebatch/${id}`,
        { isActive: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAll();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleEditClick = (batch) => {
    setForm({
      batchName: batch.batchName || "",
      course: batch.course?._id || batch.course || "",
      tutor: batch.tutor?._id || batch.tutor || "",
      student: batch.student?._id || batch.student || "",
      startDate: batch.startDate?.slice(0,10) || "",
      endDate: batch.endDate?.slice(0,10) || "",
      status: batch.status || "upcoming"
    });
    setSelectedBatch(batch);
    setShowEditPopup(true);
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
    : "bg-gray-800 text-white";

  const tableRowClasses = viewTheme === "dark"
    ? "border-gray-700 hover:bg-gray-800"
    : "border-gray-200 hover:bg-gray-50";

  const borderClasses = viewTheme === "dark"
    ? "border-gray-700"
    : "border-gray-300";

  const activeButtonClasses = viewTheme === "dark"
    ? "bg-green-700 text-white"
    : "bg-green-600 text-white";

  const inactiveButtonClasses = viewTheme === "dark"
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
    : "bg-gray-200 text-black hover:bg-gray-300";

  const trashButtonClasses = viewTheme === "dark"
    ? "bg-red-700 text-white"
    : "bg-red-600 text-white";

  const addButtonClasses = viewTheme === "dark"
    ? "bg-indigo-700 text-white hover:bg-indigo-800"
    : "bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
      <h1 className="text-2xl font-bold mb-6">
        Batch Management
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowTrash(false)}
          className={`px-4 py-2 rounded-lg ${
            !showTrash ? activeButtonClasses : inactiveButtonClasses
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setShowTrash(true)}
          className={`px-4 py-2 rounded-lg ${
            showTrash ? trashButtonClasses : inactiveButtonClasses
          }`}
        >
          Trash
        </button>
      </div>

      <div className="flex justify-between mb-6">
        <input
          placeholder="Search batch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`border px-4 py-2 rounded-lg w-64 ${inputThemeClasses}`}
        />
        <button
          onClick={() => setShowAddPopup(true)}
          className={`px-4 py-2 rounded-lg ${addButtonClasses}`}
        >
          + Add Batch
        </button>
      </div>

      <div className={`rounded-xl shadow-lg overflow-x-auto ${cardThemeClasses}`}>
        <table className="min-w-full">
          <thead className={tableHeaderClasses}>
            <tr>
              <th className="px-4 py-3 text-left">Batch</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Tutor</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className={`text-center py-6 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Loading...
                </td>
              </tr>
            ) : filteredBatches.length === 0 ? (
              <tr>
                <td colSpan="8" className={`text-center py-6 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  No batches found
                </td>
              </tr>
            ) : (
              filteredBatches.map(batch => (
                <tr key={batch._id} className={`border-b ${tableRowClasses}`}>
                  <td className="px-4 py-3 font-medium">
                    {batch.batchName}
                  </td>
                  <td className="px-4 py-3">{batch.course?.name || "N/A"}</td>
                  <td className="px-4 py-3">{batch.tutor?.name || "N/A"}</td>
                  <td className="px-4 py-3">{batch.student?.name || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      batch.status === "upcoming" 
                        ? "bg-blue-100 text-blue-700"
                        : batch.status === "ongoing"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(batch.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(batch.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(batch)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => toggleStatus(batch._id, batch.isActive)}
                        className={batch.isActive ? "text-green-600 hover:text-green-800" : "text-gray-600 hover:text-gray-800"}
                        title={batch.isActive ? "Deactivate" : "Restore"}
                      >
                        {batch.isActive ? <Power size={18} /> : <RotateCcw size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddPopup && (
        <BatchPopup
          title="Add Batch"
          form={form}
          setForm={setForm}
          courses={courses}
          tutors={tutors}
          student={student}
          onSubmit={handleAdd}
          onClose={() => setShowAddPopup(false)}
          theme={viewTheme}
          inputThemeClasses={inputThemeClasses}
          cardThemeClasses={cardThemeClasses}
        />
      )}

      {showEditPopup && (
        <BatchPopup
          title="Edit Batch"
          form={form}
          setForm={setForm}
          courses={courses}
          tutors={tutors}
          student={student}
          onSubmit={handleEdit}
          onClose={() => setShowEditPopup(false)}
          theme={viewTheme}
          inputThemeClasses={inputThemeClasses}
          cardThemeClasses={cardThemeClasses}
        />
      )}
    </div>
  );
}

function BatchPopup({ title, form, setForm, courses, student, tutors, onSubmit, onClose, theme, inputThemeClasses, cardThemeClasses }) {
  const buttonClasses = theme === "dark"
    ? "bg-indigo-700 text-white hover:bg-indigo-800"
    : "bg-indigo-600 text-white hover:bg-indigo-700";

  const cancelButtonClasses = theme === "dark"
    ? "bg-gray-600 text-white hover:bg-gray-700"
    : "bg-gray-300 text-black hover:bg-gray-400";

  const borderClasses = theme === "dark"
    ? "border-gray-700"
    : "border-gray-200";

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className={`w-full max-w-md rounded-xl p-6 shadow-xl ${cardThemeClasses}`}>
        <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${borderClasses}`}>{title}</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            placeholder="Batch Name"
            value={form.batchName || ""}
            onChange={(e) => setForm({ ...form, batchName: e.target.value })}
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
            {courses.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={form.tutor || ""}
            onChange={(e) => setForm({ ...form, tutor: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
            required
          >
            <option value="">Select Tutor</option>
            {tutors.map(t => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={form.student || ""}
            onChange={(e) => setForm({ ...form, student: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
            required
          >
            <option value="">Select Student</option>
            {student.map(s => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.startDate || ""}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
            required
          />

          <input
            type="date"
            value={form.endDate || ""}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${cancelButtonClasses}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${buttonClasses}`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}