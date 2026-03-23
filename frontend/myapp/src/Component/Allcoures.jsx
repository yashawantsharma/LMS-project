import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdDelete, MdEdit, MdCheckCircle, MdCancel, MdVisibility } from "react-icons/md";

const Allcoures = () => {
  const navigate = useNavigate()
  const [viewTheme, setViewTheme] = useState("");
  const [show, setShow] = useState([])
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    mode: "online",
    description: "",
    instructor: "",
    skills: []
  });

  useEffect(() => {
    fetchTheme();
    axios.get("http://localhost:4040/skill/findall")
      .then(res => setAllSkills(res.data));
    handeldata()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post("http://localhost:4040/course/", formData)
      alert("course added successfully")
      handeldata()
      setOpen(false)
      setFormData({
        name: "",
        duration: "",
        price: "",
        mode: "online",
        description: "",
        instructor: "",
        skills: []
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillSelect = (skillId) => {
    if (formData.skills.includes(skillId)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(id => id !== skillId)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillId]
      });
    }
  };

  const [allSkills, setAllSkills] = useState([]);

  const handeldata = async () => {
    try {
      const result = await axios.get("http://localhost:4040/course/findall")
      setShow(result.data)
    } catch (error) {
      console.log(error);
    }
  }

  const handleView = (course) => {
    setViewData(course);
    setViewOpen(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      if (tab === "active") {
        await axios.put(`http://localhost:4040/course/delete/${id}`);
        alert("Moved to Trash");
      } else {
        await axios.patch(`http://localhost:4040/course/restore/${id}`);
        alert("Restored to Active");
      }
      handeldata();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const result = await axios.patch(`http://localhost:4040/course/update/${id}`, selectedCourse)
      alert("update successfully")
      handeldata()
      setIsOpen(false)
    } catch (error) {
      console.log(error);
    }
  }

  const [tab, setTab] = useState("active");
  
  const showhandel = show.filter(emp =>
    tab === "active"
      ? emp.status === "active"
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
    : "bg-gray-100 text-black";

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
    : "bg-gray-300 text-black hover:bg-gray-400";

  const trashButtonClasses = viewTheme === "dark"
    ? "bg-red-700 text-white"
    : "bg-red-600 text-white";

  const addButtonClasses = viewTheme === "dark"
    ? "bg-green-700 text-white hover:bg-green-800"
    : "bg-green-600 text-white hover:bg-green-700";

  return (
    <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Course Management
        </h2>

        <button
          onClick={() => setOpen(true)}
          className={`px-4 py-2 rounded ${addButtonClasses}`}
        >
          ➕ Add Course
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTab("active")}
          className={`px-4 py-2 rounded ${
            tab === "active"
              ? activeButtonClasses
              : inactiveButtonClasses
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setTab("trash")}
          className={`px-4 py-2 rounded ${
            tab === "trash"
              ? trashButtonClasses
              : inactiveButtonClasses
          }`}
        >
          Trash
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-[9999]">
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          <div className={`relative p-6 rounded-xl shadow-xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto ${cardThemeClasses}`}>
            <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${borderClasses}`}>
              Add Course
            </h2>

            <div className="space-y-3">
              <input
                name="name"
                placeholder="Course Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${inputThemeClasses}`}
              />

              <input
                name="duration"
                placeholder="Duration (months)"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${inputThemeClasses}`}
              />

              <input
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${inputThemeClasses}`}
              />

              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${inputThemeClasses}`}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <textarea
                name="description"
                placeholder="Course Description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${inputThemeClasses}`}
                rows="3"
              />

              <input
                name="instructor"
                placeholder="Instructor Name"
                value={formData.instructor}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${inputThemeClasses}`}
              />

              <div>
                <p className={`font-semibold mb-2 ${viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Select Skills
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded ${borderClasses}">
                  {allSkills.map(skill => (
                    <label key={skill._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill._id)}
                        onChange={() => handleSkillSelect(skill._id)}
                        className="accent-indigo-600"
                      />
                      <span className={viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        {skill.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setOpen(false)}
                className={`px-4 py-2 rounded ${
                  viewTheme === "dark"
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-gray-400 text-white hover:bg-gray-500"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded ${addButtonClasses}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className={`min-w-full border rounded-lg ${borderClasses}`}>
          <thead className={tableHeaderClasses}>
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Duration</th>
              <th className="border px-3 py-2">Price</th>
              <th className="border px-3 py-2">Mode</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {showhandel.length === 0 ? (
              <tr>
                <td colSpan="7" className={`text-center py-6 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  No courses found
                </td>
              </tr>
            ) : (
              showhandel.map((x, index) => (
                <tr key={x._id} className={`text-center border-b ${tableRowClasses}`}>
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{x.name}</td>
                  <td className="border px-3 py-2">{x.duration} months</td>
                  <td className="border px-3 py-2">₹{x.price}</td>
                  <td className="border px-3 py-2 capitalize">{x.mode}</td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        x.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {x.status}
                    </span>
                  </td>

                  <td className="border px-3 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(x)}
                        className="text-gray-600 hover:text-gray-800"
                        title="View"
                      >
                        <MdVisibility size={20} />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCourse(x);
                          setIsOpen(true);
                        }}
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Edit"
                      >
                        <MdEdit size={20} />
                      </button>

                      <button
                        onClick={() => handleDelete(x._id)}
                        className="text-red-600 hover:text-red-800"
                        title={tab === "active" ? "Move to Trash" : "Restore"}
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
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
          onClose={() => setViewOpen(false)}
          theme={viewTheme}
        />
      )}

      {isOpen && selectedCourse && (
        <EditModal
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          onUpdate={handleUpdate}
          onClose={() => setIsOpen(false)}
          theme={viewTheme}
          inputThemeClasses={inputThemeClasses}
          cardThemeClasses={cardThemeClasses}
        />
      )}
    </div>
  )
}

function ViewModal({ data, onClose, theme }) {
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
          Course Details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <p><b>Name:</b> {data.name}</p>
          <p><b>Duration:</b> {data.duration} months</p>
          <p><b>Price:</b> ₹{data.price}</p>
          <p><b>Mode:</b> {data.mode}</p>
          <p><b>Instructor:</b> {data.instructor || "N/A"}</p>
          <p><b>Status:</b> 
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              data.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {data.status}
            </span>
          </p>
        </div>

        {data.description && (
          <div className="mt-4">
            <p><b>Description:</b></p>
            <p className="mt-1">{data.description}</p>
          </div>
        )}

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

function EditModal({ selectedCourse, setSelectedCourse, onUpdate, onClose, theme, inputThemeClasses, cardThemeClasses }) {
  const buttonClasses = theme === "dark"
    ? "bg-blue-700 text-white hover:bg-blue-800"
    : "bg-blue-600 text-white hover:bg-blue-700";

  const cancelButtonClasses = theme === "dark"
    ? "bg-gray-600 text-white hover:bg-gray-700"
    : "bg-gray-300 text-black hover:bg-gray-400";

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-opacity-50 z-40" />
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl shadow-lg z-50 w-96 ${cardThemeClasses}`}>
        <h2 className="text-xl font-bold mb-4">Update Course</h2>

        <input
          value={selectedCourse.name || ""}
          onChange={(e) => setSelectedCourse({ ...selectedCourse, name: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
          placeholder="Course Name"
        />

        <input
          value={selectedCourse.duration || ""}
          onChange={(e) => setSelectedCourse({ ...selectedCourse, duration: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
          placeholder="Duration (months)"
        />

        <input
          value={selectedCourse.price || ""}
          onChange={(e) => setSelectedCourse({ ...selectedCourse, price: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
          placeholder="Price"
        />

        <select
          value={selectedCourse.mode || "online"}
          onChange={(e) => setSelectedCourse({ ...selectedCourse, mode: e.target.value })}
          className={`w-full mb-4 p-2 border rounded ${inputThemeClasses}`}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${cancelButtonClasses}`}
          >
            Cancel
          </button>

          <button
            onClick={() => onUpdate(selectedCourse._id)}
            className={`px-4 py-2 rounded ${buttonClasses}`}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default Allcoures;