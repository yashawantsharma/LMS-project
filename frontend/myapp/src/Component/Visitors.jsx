import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Power, RotateCcw, RefreshCcw } from "lucide-react";

export default function Visitors() {
  const token = localStorage.getItem("token");
  const [viewTheme, setViewTheme] = useState("");

  const [visitors, setVisitors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showConvertPopup, setShowConvertPopup] = useState(false);
  const [studentdata, setStudentData] = useState({
    courseprice: "",
    paymenttype: "",
    paymentmode: "",
    amountpaid: 0,
    duedate: "",
    coures: "",
    batch: "",
    batchStartDate: "",
    photo: null,
    addressProof: null,
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    notes: ""
  });
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    coures: "",
    status: "new",
    source: "website"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchTheme();
    fetchAll();
    batchAll();
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

  const batchAll = async () => {
    try {
      const batchRes = await axios.get("http://localhost:4040/batch/allbatch");
      setBatches(batchRes.data);
    } catch (err) {
      setError("Failed to load batches");
    }
  };

  useEffect(() => {
    filterData();
  }, [visitors, search, showTrash, sortField]);

  const convertstudent = async () => {
    try {
      const formData = new FormData();
      formData.append("courseprice", studentdata.courseprice);
      formData.append("paymenttype", studentdata.paymenttype);
      formData.append("paymentmode", studentdata.paymentmode);
      formData.append("amountpaid", studentdata.amountpaid);
      formData.append("duedate", studentdata.duedate);
      formData.append("course", selectedVisitor.coures?._id || selectedVisitor.coures);
      formData.append("batch", studentdata.batch);
      formData.append("batchStartDate", studentdata.batchStartDate);
      formData.append("addressLine", studentdata.addressLine);
      formData.append("city", studentdata.city);
      formData.append("state", studentdata.state);
      formData.append("pincode", studentdata.pincode);
      formData.append("notes", studentdata.notes);

      if (studentdata.photo) {
        formData.append("photo", studentdata.photo);
      }

      if (studentdata.addressProof) {
        formData.append("addressProof", studentdata.addressProof);
      }

      await axios.post(
        `http://localhost:4040/visitor/convertstudent/${selectedVisitor._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setShowConvertPopup(false);
      setStudentData({
        courseprice: "",
        paymenttype: "",
        paymentmode: "",
        amountpaid: 0,
        duedate: "",
        coures: "",
        batch: "",
        batchStartDate: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        notes: "",
        photo: null,
        addressProof: null
      });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to convert visitor");
    }
  };

  const fetchAll = async () => {
    try {
      const visRes = await axios.get("http://localhost:4040/visitor/allvisitor");
      setVisitors(visRes.data);

      const courseRes = await axios.get(
        "http://localhost:4040/course/findall",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(courseRes.data);
    } catch (err) {
      setError("Failed to load visitors");
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let data = [...visitors];
    data = data.filter(v => showTrash ? !v.isActive : v.isActive);

    if (search) {
      data = data.filter(v =>
        v.name?.toLowerCase().includes(search.toLowerCase()) ||
        v.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) =>
      a[sortField]?.toString().localeCompare(b[sortField]?.toString())
    );

    setFilteredVisitors(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4040/visitor/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddPopup(false);
      fetchAll();
      setForm({
        name: "",
        email: "",
        phone: "",
        coures: "",
        status: "new",
        source: "website"
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add visitor");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:4040/visitor/updatevisitor/${selectedVisitor._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditPopup(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update visitor");
    }
  };

  const toggleStatus = async (id, current) => {
    try {
      await axios.post(
        `http://localhost:4040/visitor/activevisitor/${id}`,
        { isActive: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAll();
    } catch (err) {
      setError("Failed to update status");
    }
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

  const convertButtonClasses = viewTheme === "dark"
    ? "bg-green-700 text-white hover:bg-green-800"
    : "bg-green-600 text-white hover:bg-green-700";

  return (
    <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
      <h1 className="text-2xl font-bold mb-6">
        Visitors Management
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
          placeholder="Search visitor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`border px-4 py-2 rounded-lg w-64 ${inputThemeClasses}`}
        />

        <button
          onClick={() => setShowAddPopup(true)}
          className={`px-4 py-2 rounded-lg ${addButtonClasses}`}
        >
          + Add Visitor
        </button>
      </div>

      <div className={`rounded-xl shadow-lg overflow-x-auto ${cardThemeClasses}`}>
        <table className="min-w-full">
          <thead className={tableHeaderClasses}>
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className={`text-center py-6 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Loading...
                </td>
              </tr>
            ) : filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan="7" className={`text-center py-6 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  No visitors found
                </td>
              </tr>
            ) : (
              filteredVisitors.map(visitor => (
                <tr key={visitor._id} className={`border-b ${tableRowClasses}`}>
                  <td className="px-4 py-3">{visitor.name}</td>
                  <td className="px-4 py-3">{visitor.email}</td>
                  <td className="px-4 py-3">{visitor.phone}</td>
                  <td className="px-4 py-3">{visitor.coures?.name || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      visitor.status === "new" ? "bg-blue-100 text-blue-700" :
                      visitor.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                      visitor.status === "interested" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {visitor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{visitor.source}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedVisitor(visitor);
                          setForm(visitor);
                          setShowEditPopup(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVisitor(visitor);
                          setForm(visitor);
                          setShowConvertPopup(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Convert to Student"
                      >
                        <RefreshCcw size={18} />
                      </button>
                      <button
                        onClick={() => toggleStatus(visitor._id, visitor.isActive)}
                        className={visitor.isActive ? "text-green-600 hover:text-green-800" : "text-gray-600 hover:text-gray-800"}
                        title={visitor.isActive ? "Deactivate" : "Restore"}
                      >
                        {visitor.isActive ? <Power size={18} /> : <RotateCcw size={18} />}
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
        <VisitorPopup
          title="Add Visitor"
          form={form}
          setForm={setForm}
          courses={courses}
          onSubmit={handleAdd}
          onClose={() => setShowAddPopup(false)}
          theme={viewTheme}
          inputThemeClasses={inputThemeClasses}
          cardThemeClasses={cardThemeClasses}
        />
      )}

      {showEditPopup && (
        <VisitorPopup
          title="Edit Visitor"
          form={form}
          setForm={setForm}
          courses={courses}
          onSubmit={handleEdit}
          onClose={() => setShowEditPopup(false)}
          theme={viewTheme}
          inputThemeClasses={inputThemeClasses}
          cardThemeClasses={cardThemeClasses}
        />
      )}

      {showConvertPopup && (
        <ConvertPopup
          studentdata={studentdata}
          setStudentData={setStudentData}
          batches={batches}
          courses={courses}
          convertstudent={convertstudent}
          onClose={() => setShowConvertPopup(false)}
          theme={viewTheme}
          inputThemeClasses={inputThemeClasses}
          cardThemeClasses={cardThemeClasses}
        />
      )}
    </div>
  );
}

function VisitorPopup({ title, form, setForm, courses, onSubmit, onClose, theme, inputThemeClasses, cardThemeClasses }) {
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
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className={`w-full max-w-md rounded-xl p-6 shadow-xl ${cardThemeClasses}`}>
        <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${borderClasses}`}>{title}</h2>

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
            value={form.coures || ""}
            onChange={(e) => setForm({ ...form, coures: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
          >
            <option value="">Select Course</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={form.status || "new"}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="not interested">Not Interested</option>
          </select>

          <select
            value={form.source || "website"}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
          >
            <option value="website">Website</option>
            <option value="social media">Social Media</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>

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

function ConvertPopup({ studentdata, setStudentData, batches, courses, convertstudent, onClose, theme, inputThemeClasses, cardThemeClasses }) {
  const buttonClasses = theme === "dark"
    ? "bg-green-700 text-white hover:bg-green-800"
    : "bg-green-600 text-white hover:bg-green-700";

  const cancelButtonClasses = theme === "dark"
    ? "bg-gray-600 text-white hover:bg-gray-700"
    : "bg-gray-300 text-black hover:bg-gray-400";

  const borderClasses = theme === "dark"
    ? "border-gray-700"
    : "border-gray-200";

  const labelClasses = theme === "dark"
    ? "text-gray-300"
    : "text-gray-600";

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className={`w-full max-w-xl rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${cardThemeClasses}`}>
        <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${borderClasses}`}>
          Convert to Student
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            convertstudent();
          }}
          className="space-y-4"
        >
          <select
            value={studentdata.paymenttype || ""}
            onChange={(e) => setStudentData({ ...studentdata, paymenttype: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
            required
          >
            <option value="">Select Payment Type</option>
            <option value="full">Full</option>
            <option value="installment">Installment</option>
          </select>

          <select
            value={studentdata.paymentmode || ""}
            onChange={(e) => setStudentData({ ...studentdata, paymentmode: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
            required
          >
            <option value="">Payment Mode</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Amount Paid"
              value={studentdata.amountpaid || ""}
              onChange={(e) => setStudentData({ ...studentdata, amountpaid: e.target.value })}
              className={`border px-3 py-2 rounded ${inputThemeClasses}`}
              required
            />
            <input
              type="number"
              placeholder="Course Price"
              value={studentdata.courseprice || ""}
              onChange={(e) => setStudentData({ ...studentdata, courseprice: e.target.value })}
              className={`border px-3 py-2 rounded ${inputThemeClasses}`}
              required
            />
          </div>

          <p className={`text-sm ${labelClasses}`}>
            Remaining: {(studentdata.courseprice || 0) - (studentdata.amountpaid || 0)}
          </p>

          <input
            type="date"
            value={studentdata.duedate || ""}
            onChange={(e) => setStudentData({ ...studentdata, duedate: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
          />

          <input
            type="date"
            placeholder="Batch Start Date"
            value={studentdata.batchStartDate || ""}
            onChange={(e) => setStudentData({ ...studentdata, batchStartDate: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
          />

          <select
            value={studentdata.batch || ""}
            onChange={(e) => setStudentData({ ...studentdata, batch: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
            required
          >
            <option value="">Select Batch</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>
                {b.batchName}
              </option>
            ))}
          </select>

          <div>
            <p className={`text-sm mb-1 ${labelClasses}`}>Photo</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setStudentData({ ...studentdata, photo: e.target.files[0] })}
              className={`w-full border rounded px-3 py-2 ${inputThemeClasses}`}
            />
          </div>

          <div>
            <p className={`text-sm mb-1 ${labelClasses}`}>Address Proof</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setStudentData({ ...studentdata, addressProof: e.target.files[0] })}
              className={`w-full border rounded px-3 py-2 ${inputThemeClasses}`}
            />
          </div>

          <input
            placeholder="Address Line"
            value={studentdata.addressLine || ""}
            onChange={(e) => setStudentData({ ...studentdata, addressLine: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="City"
              value={studentdata.city || ""}
              onChange={(e) => setStudentData({ ...studentdata, city: e.target.value })}
              className={`border px-3 py-2 rounded ${inputThemeClasses}`}
            />
            <input
              placeholder="State"
              value={studentdata.state || ""}
              onChange={(e) => setStudentData({ ...studentdata, state: e.target.value })}
              className={`border px-3 py-2 rounded ${inputThemeClasses}`}
            />
            <input
              placeholder="Pincode"
              value={studentdata.pincode || ""}
              onChange={(e) => setStudentData({ ...studentdata, pincode: e.target.value })}
              className={`border px-3 py-2 rounded ${inputThemeClasses}`}
            />
          </div>

          <textarea
            placeholder="Notes"
            value={studentdata.notes || ""}
            onChange={(e) => setStudentData({ ...studentdata, notes: e.target.value })}
            className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
            rows="3"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${cancelButtonClasses}`}
            >
              Close
            </button>

            <button
              type="submit"
              className={`px-4 py-2 rounded ${buttonClasses}`}
            >
              Convert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}