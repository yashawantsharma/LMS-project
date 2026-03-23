import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdDelete, MdEdit, MdCheckCircle, MdCancel, MdVisibility } from "react-icons/md";

const Allskill = () => {
  const [viewTheme, setViewTheme] = useState("");
  const [show, setShow] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    fetchTheme();
    showdata();
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

  const showdata = async () => {
    try {
      const result = await axios.get("http://localhost:4040/skill/findall")
      setShow(result.data || [])
    } catch (error) {
      console.log(error);
    }
  }
  
  const navigate = useNavigate()

  const handeldelete = async (id) => {
    try {
      const result = await axios.put(`http://localhost:4040/skill/delete/${id}`)
      alert("data trash successfully")
      const result1 = await axios.get("http://localhost:4040/skill/findall")
      setShow(result1.data || [])
    } catch (error) {
      console.log(error);
    }
  }

  const handelupdate = async (id) => {
    try {
      const result = await axios.patch(`http://localhost:4040/skill/update/${id}`, selectedSkill)
      alert("update successfully")
      const result1 = await axios.get("http://localhost:4040/skill/findall")
      setShow(result1.data || [])
      setIsOpen(false)
    } catch (error) {
      console.log(error);
    }
  }

  const [fromdata, setFromdata] = useState({
    name: "",
    duration: "",
    price: "",
    mode: ""
  })
  
  const handelsubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post("http://localhost:4040/skill/", fromdata)
      alert("skill add successfully")
      setOpen(false)
      setFromdata({
        name: "",
        duration: "",
        price: "",
        mode: ""
      })
      showdata()
    } catch (error) {
      console.log(error);
    }
  }

  const [tab, setTab] = useState("active");

  const showhandel = show.filter(emp =>
    tab === "active" || tab === "inactive"
      ? emp.status === "active" || emp.status === "inactive"
      : emp.status === "deleted"
  );

  const handleView = (employee) => {
    setViewData(employee);
    setViewOpen(true);
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
    : "border-gray-200 hover:bg-gray-100";

  const buttonClasses = viewTheme === "dark"
    ? "bg-blue-700 text-white hover:bg-blue-800"
    : "bg-blue-600 text-white hover:bg-blue-700";

  const cancelButtonClasses = viewTheme === "dark"
    ? "bg-gray-600 text-white hover:bg-gray-700"
    : "bg-gray-400 text-white hover:bg-gray-500";

  const activeButtonClasses = viewTheme === "dark"
    ? "bg-green-700 text-white"
    : "bg-green-600 text-white";

  const inactiveButtonClasses = viewTheme === "dark"
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
    : "bg-gray-300 text-black hover:bg-gray-400";

  const trashButtonClasses = viewTheme === "dark"
    ? "bg-red-700 text-white"
    : "bg-red-600 text-white";

  return (
    <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Skills Management
        </h2>

        <button
          onClick={() => setOpen(true)}
          className={`px-4 py-2 rounded ${buttonClasses}`}
        >
          ➕ Add Skill
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
        <div className="fixed inset-0 flex items-center justify-centerbg-opacity-50 z-[9999]">
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          <div className={`relative p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4 ${cardThemeClasses}`}>
            <h2 className={`text-2xl font-bold border-b pb-4 ${viewTheme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
              Add New Skill
            </h2>

            <div className="flex flex-col space-y-1">
              <label className={`text-sm font-medium ${viewTheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Skill Name
              </label>
              <input
                type="text"
                value={fromdata.name}
                onChange={(e) => setFromdata({ ...fromdata, name: e.target.value })}
                placeholder="e.g. React JS"
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${inputThemeClasses}`}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className={`text-sm font-medium ${viewTheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Duration (Months)
              </label>
              <input
                type="number"
                value={fromdata.duration}
                onChange={(e) => setFromdata({ ...fromdata, duration: e.target.value })}
                placeholder="e.g. 3"
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${inputThemeClasses}`}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className={`text-sm font-medium ${viewTheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Price (₹)
              </label>
              <input
                type="number"
                value={fromdata.price}
                onChange={(e) => setFromdata({ ...fromdata, price: e.target.value })}
                placeholder="e.g. 5000"
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${inputThemeClasses}`}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className={`text-sm font-medium ${viewTheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Mode
              </label>
              <select
                value={fromdata.mode}
                onChange={(e) => setFromdata({ ...fromdata, mode: e.target.value })}
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${inputThemeClasses}`}
              >
                <option value="">Select Mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setOpen(false)}
                className={`px-5 py-2 rounded-lg ${cancelButtonClasses}`}
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={handelsubmit}
                className={`px-5 py-2 rounded-lg ${buttonClasses}`}
              >
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className={`min-w-full border rounded-lg ${viewTheme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
          <thead className={tableHeaderClasses}>
            <tr>
              <th className="rounded px-4 py-2">Skill Name</th>
              <th className= "rounded px-4 py-2">Duration</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Mode</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {showhandel.length === 0 ? (
              <tr>
                <td colSpan="6" className={`rounded text-center py-6 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  No skills found
                </td>
              </tr>
            ) : (
              showhandel.map((x) => (
                <tr key={x._id} className={`border ${tableRowClasses}`}>
                  <td className=" rounded px-4 py-2 font-medium">{x.name}</td>
                  <td className=" rounded px-4 py-2">{x.duration} months</td>
                  <td className=" rounded px-4 py-2">₹{x.price}</td>
                  <td className="rounded px-4 py-2 capitalize">{x.mode}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      x.status === "active"
                        ? "bg-green-100 text-green-700"
                        : x.status === "inactive"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}>
                      {x.status}
                    </span>
                  </td>

                  <td className="px-4 py-2">
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
                          setSelectedSkill(x);
                          setIsOpen(true);
                        }}
                        className="text-yellow-500 hover:text-yellow-600"
                        title="Edit"
                      >
                        <MdEdit size={20} />
                      </button>

                      <button
                        onClick={() => handeldelete(x._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
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

      {isOpen && selectedSkill && (
        <EditModal
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          onUpdate={handelupdate}
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

  const statusClasses = data.status === "active"
    ? "bg-green-100 text-green-700"
    : data.status === "inactive"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0  bg-opacity-50" onClick={onClose} />
      <div className={`relative p-6 rounded-xl shadow-xl w-[90%] max-w-md ${themeClasses}`}>
        <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${borderClasses}`}>
          Skill Details
        </h2>

        <div className="space-y-3">
          <p><b>Name:</b> {data.name}</p>
          <p><b>Duration:</b> {data.duration} months</p>
          <p><b>Price:</b> ₹{data.price}</p>
          <p><b>Mode:</b> {data.mode}</p>
          <p>
            <b>Status:</b> 
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusClasses}`}>
              {data.status}
            </span>
          </p>
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

function EditModal({ selectedSkill, setSelectedSkill, onUpdate, onClose, theme, inputThemeClasses, cardThemeClasses }) {
  const buttonClasses = theme === "dark"
    ? "bg-blue-700 text-white hover:bg-blue-800"
    : "bg-blue-600 text-white hover:bg-blue-700";

  const cancelButtonClasses = theme === "dark"
    ? "bg-gray-600 text-white hover:bg-gray-700"
    : "bg-gray-300 text-black hover:bg-gray-400";

  return (
    <>
      <div onClick={onClose} className="fixed inset-0  bg-opacity-50 z-40" />
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl shadow-lg z-50 w-96 ${cardThemeClasses}`}>
        <h2 className="text-xl font-bold mb-4">Update Skill</h2>

        <input
          type="text"
          value={selectedSkill.name || ""}
          onChange={(e) => setSelectedSkill({ ...selectedSkill, name: e.target.value })}
          className={`w-full mb-3 px-3 py-2 border rounded ${inputThemeClasses}`}
          placeholder="Skill name"
        />

        <input
          type="number"
          value={selectedSkill.duration || ""}
          onChange={(e) => setSelectedSkill({ ...selectedSkill, duration: e.target.value })}
          className={`w-full mb-3 px-3 py-2 border rounded ${inputThemeClasses}`}
          placeholder="Duration (months)"
        />

        <input
          type="number"
          value={selectedSkill.price || ""}
          onChange={(e) => setSelectedSkill({ ...selectedSkill, price: e.target.value })}
          className={`w-full mb-3 px-3 py-2 border rounded ${inputThemeClasses}`}
          placeholder="Price"
        />

        <select
          value={selectedSkill.mode || ""}
          onChange={(e) => setSelectedSkill({ ...selectedSkill, mode: e.target.value })}
          className={`w-full mb-4 px-3 py-2 border rounded ${inputThemeClasses}`}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${cancelButtonClasses}`}
          >
            Cancel
          </button>

          <button
            onClick={() => onUpdate(selectedSkill._id)}
            className={`px-4 py-2 rounded ${buttonClasses}`}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default Allskill;