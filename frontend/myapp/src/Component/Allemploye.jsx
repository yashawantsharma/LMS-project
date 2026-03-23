import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdDelete, MdEdit, MdCheckCircle, MdCancel, MdVisibility, MdSearch } from "react-icons/md";

const Allemploye = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [show, setshow] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewTheme, setViewTheme] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTheme();
    showalldata();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [show, searchTerm]);

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

  const handleView = (employee) => {
    setViewData(employee);
    setViewOpen(true);
  };

  const showalldata = async () => {
    try {
      const result = await axios.get("http://localhost:4040/employe/findall")
      setshow(result.data);
      setFilteredEmployees(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  const navigate = useNavigate()

  const handleDelete = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4040/employe/delete/${id}`)
      alert("employe delete successfully")
      const result = await axios.get("http://localhost:4040/employe/findall")
      setshow(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = async (id) => {
    await axios.patch(`http://localhost:4040/employe/update/${id}`, selectedData);
    alert("update suceessfully")
    setIsOpen(false);
    showalldata();
  };

  const handleToggle = async (id) => {
    await axios.patch(`http://localhost:4040/employe/toggle/${id}`);
    const result = await axios.get("http://localhost:4040/employe/findall");
    setshow(result.data);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    dob: "",
    gender: "",
    salary: "",
    joinDate: "",
    employmentType: "",
    panNumber: "",
    profileImage: "",
    addharImage: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputValue = new FormData();
    inputValue.append("name", formData.name);
    inputValue.append("email", formData.email);
    inputValue.append("phone", formData.phone);
    inputValue.append("role", formData.role);
    inputValue.append("dob", formData.dob);
    inputValue.append("gender", formData.gender);
    inputValue.append("salary", formData.salary);
    inputValue.append("joinDate", formData.joinDate);
    inputValue.append("employmentType", formData.employmentType);
    inputValue.append("panNumber", formData.panNumber);
    inputValue.append("profileImage", formData.profileImage)
    inputValue.append("addharImage", formData.addharImage);

    try {
      const result = await axios.post("http://localhost:4040/employe/", inputValue)
      alert("add employee successfully")
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        dob: "",
        gender: "",
        salary: "",
        joinDate: "",
        employmentType: "",
        panNumber: "",
        profileImage: "",
        addharImage: ""
      });
      showalldata();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding employee")
    }
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const [tab, setTab] = useState("active");

  const filterEmployees = () => {
    let data = [...show];

    data = data.filter(emp =>
      tab === "active" || tab === "inactive"
        ? emp.status === "active" || emp.status === "inactive"
        : emp.status === "deleted"
    );

    if (searchTerm) {
      data = data.filter(emp =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(data);
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

  return (
    <div className={`ml-58 mt-10 p-6 min-h-screen ${themeClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Employee Management
        </h2>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Employee
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={() => setTab("active")}
          className={`px-4 py-2 rounded ${
            tab === "active"
              ? "bg-green-600 text-white"
              : viewTheme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setTab("trash")}
          className={`px-4 py-2 rounded ${
            tab === "trash"
              ? "bg-red-600 text-white"
              : viewTheme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Trash
        </button>

        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, phone, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputThemeClasses}`}
            />
            <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setOpen(false)}
          />

          <div className={`relative p-6 rounded-xl shadow-xl w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto ${cardThemeClasses}`}>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
              className="space-y-6"
            >
              <h2 className={`text-2xl font-bold border-b pb-4 ${viewTheme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                Employee Registration Form
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${inputThemeClasses}`}
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${inputThemeClasses}`}
                  required
                />

                <input
                  name="phone"
                  type="number"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${inputThemeClasses}`}
                  required
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputThemeClasses}`}
                  required
                >
                  <option value="">Select role</option>
                  <option value="teacher">Teacher</option>
                  <option value="HR">HR</option>
                </select>

                <input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputThemeClasses}`}
                />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputThemeClasses}`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <input
                  name="salary"
                  type="number"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputThemeClasses}`}
                  required
                />

                <input
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputThemeClasses}`}
                />

                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputThemeClasses}`}
                >
                  <option value="">Employment Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                </select>

                <input
                  name="panNumber"
                  placeholder="PAN Number"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${inputThemeClasses}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleFile}
                    className={`w-full border rounded-lg px-3 py-2 ${inputThemeClasses}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Aadhaar Image
                  </label>
                  <input
                    type="file"
                    name="addharImage"
                    onChange={handleFile}
                    className={`w-full border rounded-lg px-3 py-2 ${inputThemeClasses}`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2 rounded-lg ${
                    viewTheme === "dark"
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-gray-400 text-white hover:bg-gray-500"
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className={`min-w-full border rounded-lg ${viewTheme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
          <thead className={tableHeaderClasses}>
            <tr>
              <th className="px-4 py-2">Profile</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Join Date</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Aadhaar</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="11" className={`text-center py-6 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((x, i) => (
                <tr key={i} className={`border-b ${tableRowClasses}`}>
                  <td className="px-4 py-2">
                    <img
                      src={x.profileImage || "https://via.placeholder.com/50"}
                      alt="profile"
                      className="w-12 h-12 rounded-full mx-auto object-cover"
                    />
                  </td>

                  <td className="px-4 py-2">{x.name}</td>
                  <td className="px-4 py-2">{x.phone}</td>
                  <td className="px-4 py-2">{x.role}</td>
                  <td className="px-4 py-2">{x.gender}</td>
                  <td className="px-4 py-2">₹{x.salary}</td>
                  <td className="px-4 py-2">{x.joinDate?.slice(0,10)}</td>
                  <td className="px-4 py-2">{x.employmentType}</td>

                  <td className="px-4 py-2">
                    <img
                      src={x.addharImage || "https://via.placeholder.com/50"}
                      alt="aadhaar"
                      className="w-12 h-12 rounded mx-auto object-cover"
                    />
                  </td>

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
                        onClick={() => handleToggle(x._id)}
                        className={`p-1 rounded ${
                          x.status === "active"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                        title={x.status === "active" ? "Deactivate" : "Activate"}
                      >
                        {x.status === "active"
                          ? <MdCheckCircle size={20} />
                          : <MdCancel size={20} />
                        }
                      </button>

                      <button
                        onClick={() => {
                          setSelectedData(x);
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

      {isOpen && selectedData && (
        <EditModal
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          onUpdate={handleUpdate}
          onClose={() => setIsOpen(false)}
          theme={viewTheme}
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
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`relative p-6 rounded-xl shadow-xl w-[90%] max-w-2xl ${themeClasses}`}>
        <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${borderClasses}`}>
          Employee Details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <p><b>Name:</b> {data.name}</p>
          <p><b>Email:</b> {data.email}</p>
          <p><b>Phone:</b> {data.phone}</p>
          <p><b>Role:</b> {data.role}</p>
          <p><b>Gender:</b> {data.gender}</p>
          <p><b>Salary:</b> ₹{data.salary}</p>
          <p><b>Status:</b> 
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              data.status === "active"
                ? "bg-green-100 text-green-700"
                : data.status === "inactive"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}>
              {data.status}
            </span>
          </p>
          <p><b>PAN:</b> {data.panNumber}</p>
          <p><b>Join Date:</b> {data.joinDate?.slice(0,10)}</p>
          <p><b>Employment Type:</b> {data.employmentType}</p>
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

function EditModal({ selectedData, setSelectedData, onUpdate, onClose, theme }) {
  const themeClasses = theme === "dark"
    ? "bg-gray-800 text-white"
    : "bg-white text-black";

  const inputThemeClasses = theme === "dark"
    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
    : "bg-white text-black border-gray-300";

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl shadow-lg z-50 w-96 ${themeClasses}`}>
        <h2 className="text-xl font-bold mb-4">Edit Employee</h2>

        <input
          placeholder="Name"
          value={selectedData.name || ""}
          onChange={(e) => setSelectedData({ ...selectedData, name: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
        />

        <input
          placeholder="Email"
          type="email"
          value={selectedData.email || ""}
          onChange={(e) => setSelectedData({ ...selectedData, email: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
        />

        <input
          placeholder="Phone"
          value={selectedData.phone || ""}
          onChange={(e) => setSelectedData({ ...selectedData, phone: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
        />

        <select
          value={selectedData.role || ""}
          onChange={(e) => setSelectedData({ ...selectedData, role: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
        >
          <option value="">Select role</option>
          <option value="teacher">Teacher</option>
          <option value="HR">HR</option>
        </select>

        <select
          value={selectedData.gender || ""}
          onChange={(e) => setSelectedData({ ...selectedData, gender: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="date"
          value={selectedData.joinDate?.slice(0, 10) || ""}
          onChange={(e) => setSelectedData({ ...selectedData, joinDate: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
        />

        <input
          type="number"
          placeholder="Salary"
          value={selectedData.salary || ""}
          onChange={(e) => setSelectedData({ ...selectedData, salary: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
        />

        <select
          value={selectedData.employmentType || ""}
          onChange={(e) => setSelectedData({ ...selectedData, employmentType: e.target.value })}
          className={`w-full mb-3 p-2 border rounded ${inputThemeClasses}`}
        >
          <option value="">Employment Type</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
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
            onClick={() => onUpdate(selectedData._id)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default Allemploye