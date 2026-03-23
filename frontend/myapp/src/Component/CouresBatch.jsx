import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdDelete, MdEdit, MdCheckCircle, MdCancel, MdVisibility } from "react-icons/md";

const CouresBatch = () => {
  const [viewTheme, setViewTheme] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [show, setShow] = useState([]);
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState(null);
  const [skillSearch, setSkillSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  useEffect(() => {
    fetchTheme();
    handeldata();
    axios.get("http://localhost:4040/batch/allbatch").then(res => {
      setAllSkills(res.data);
      setSkills(res.data);
    });
    axios.get("http://localhost:4040/course/findall").then(res => {
      setAllCourses(res.data);
      setCourses(res.data);
    });
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

  const handeldata = async () => {
    try {
      const result = await axios.get("http://localhost:4040/couresbatch/findall");
      setShow(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handeledit = (mapping) => {
    setEditData(mapping);
    setIsOpen(true);
  };

  const handeldelete = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:4040/couresbatch/delete/${id}`);
      alert("data delete successfully");
      handeldata();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const payload = {
        batch: editData.batch.map(s => s._id),
        courses: editData.courses.map(c => c._id)
      };
      await axios.patch(`http://localhost:4040/couresbatch/update/${id}`, payload);
      alert("Mapping updated");
      setIsOpen(false);
      handeldata();
    } catch (err) {
      console.log(err);
    }
  };

  const addSkill = (skill) => {
    if (!selectedSkills.find(s => s._id === skill._id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillSearch("");
    setShowSkillDropdown(false);
  };

  const removeSkill = (id) => {
    setSelectedSkills(selectedSkills.filter(s => s._id !== id));
  };

  const addCourse = (course) => {
    setSelectedCourses(course);
    setCourseSearch("");
    setShowCourseDropdown(false);
  };

  const removeCourse = () => {
    setSelectedCourses(null);
  };

  const handleSubmit = async () => {
    const payload = {
      batch: selectedSkills.map(s => s._id),
      courses: selectedCourses ? [selectedCourses._id] : []
    };

    try {
      await axios.post("http://localhost:4040/couresbatch/", payload);
      alert("Mapping saved successfully");
      setSelectedSkills([]);
      setSelectedCourses(null);
      setOpen(false);
      handeldata();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error saving mapping");
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
    : "bg-gray-100 text-black";

  const tableRowClasses = viewTheme === "dark"
    ? "border-gray-700 hover:bg-gray-800"
    : "border-gray-200 hover:bg-gray-50";

  const borderClasses = viewTheme === "dark"
    ? "border-gray-700"
    : "border-gray-300";

  const buttonClasses = viewTheme === "dark"
    ? "bg-blue-700 text-white hover:bg-blue-800"
    : "bg-blue-600 text-white hover:bg-blue-700";

  const cancelButtonClasses = viewTheme === "dark"
    ? "bg-gray-600 text-white hover:bg-gray-700"
    : "bg-gray-400 text-white hover:bg-gray-500";

  const chipClasses = viewTheme === "dark"
    ? {
        batch: "bg-blue-900 text-blue-300",
        course: "bg-green-900 text-green-300"
      }
    : {
        batch: "bg-blue-100 text-blue-700",
        course: "bg-green-100 text-green-700"
      };

  return (
    <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Batch & Course Mapping
        </h2>
        <button
          onClick={() => setOpen(true)}
          className={`px-4 py-2 rounded ${buttonClasses}`}
        >
          Add Mapping
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          <div className={`relative p-6 rounded-xl shadow-xl w-[90%] max-w-md space-y-4 ${cardThemeClasses}`}>
            <h2 className="text-2xl font-bold">Batch & Course Mapping</h2>

            <div>
              <p className={`font-semibold mb-1 ${viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Select Batch
              </p>

              <div className={`border rounded p-2 flex flex-wrap gap-2 ${borderClasses}`}>
                {selectedSkills.map(skill => (
                  <span
                    key={skill._id}
                    className={`${chipClasses.batch} px-2 py-1 rounded flex items-center gap-1`}
                  >
                    {skill.batchName}
                    <button onClick={() => removeSkill(skill._id)} className="font-bold">×</button>
                  </span>
                ))}

                <input
                  value={skillSearch}
                  onFocus={() => setShowSkillDropdown(true)}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  placeholder="Click to select Batch"
                  className={`outline-none flex-1 bg-transparent ${inputThemeClasses}`}
                />
              </div>

              {showSkillDropdown && (
                <div className={`border mt-1 rounded max-h-40 overflow-y-auto ${borderClasses} ${cardThemeClasses}`}>
                  {skills
                    .filter(s => s.batchName?.toLowerCase().includes(skillSearch.toLowerCase()))
                    .map(skill => (
                      <div
                        key={skill._id}
                        onClick={() => addSkill(skill)}
                        className={`p-2 cursor-pointer ${viewTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                      >
                        {skill.batchName}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div>
              <p className={`font-semibold mb-1 ${viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Select Courses
              </p>

              <div className={`border rounded p-2 flex flex-wrap gap-2 ${borderClasses}`}>
                {selectedCourses && (
                  <span
                    key={selectedCourses._id}
                    className={`${chipClasses.course} px-2 py-1 rounded flex items-center gap-1`}
                  >
                    {selectedCourses.name}
                    <button onClick={removeCourse} className="font-bold">×</button>
                  </span>
                )}

                <input
                  value={courseSearch}
                  onFocus={() => setShowCourseDropdown(true)}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Click to select courses"
                  className={`outline-none flex-1 bg-transparent ${inputThemeClasses}`}
                />
              </div>

              {showCourseDropdown && (
                <div className={`border mt-1 rounded max-h-40 overflow-y-auto ${borderClasses} ${cardThemeClasses}`}>
                  {courses
                    .filter(c => c.name?.toLowerCase().includes(courseSearch.toLowerCase()))
                    .map(course => (
                      <div
                        key={course._id}
                        onClick={() => addCourse(course)}
                        className={`p-2 cursor-pointer ${viewTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                      >
                        {course.name}
                      </div>
                    ))}
                </div>
              )}
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
                onClick={handleSubmit}
                className={`px-5 py-2 rounded-lg ${buttonClasses}`}
              >
                Save Mapping
              </button>
            </div>
          </div>
        </div>
      )}

      {show.length === 0 ? (
        <div className={`text-center py-10 text-lg ${viewTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          No mapping data found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`min-w-full border rounded-lg ${borderClasses}`}>
            <thead className={tableHeaderClasses}>
              <tr>
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Batch</th>
                <th className="border px-4 py-2 text-left">Courses</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {show.map((x, index) => (
                <tr key={x._id} className={`border-b ${tableRowClasses}`}>
                  <td className="border px-4 py-2">{index + 1}</td>

                  <td className="border px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {x.batch?.map(s => (
                        <span
                          key={s._id}
                          className={`inline-block ${chipClasses.batch} px-2 py-1 rounded text-sm`}
                        >
                          {s.batchName}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="border px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {x.courses?.map(c => (
                        <span
                          key={c._id}
                          className={`inline-block ${chipClasses.course} px-2 py-1 rounded text-sm`}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="border px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handeledit(x)}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && editData && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0  bg-opacity-50 z-40"
          />

          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl shadow-lg z-50 w-[520px] ${cardThemeClasses}`}>
            <h2 className="text-xl font-bold mb-4">Edit Mapping</h2>

            <p className={`font-semibold mb-1 ${viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Batch
            </p>
            <div className={`border rounded p-2 flex flex-wrap gap-2 mb-3 ${borderClasses}`}>
              {editData.batch?.map(skill => (
                <span
                  key={skill._id}
                  className={`${chipClasses.batch} px-2 py-1 rounded flex items-center gap-1`}
                >
                  {skill.batchName}
                  <button
                    onClick={() =>
                      setEditData({
                        ...editData,
                        batch: editData.batch.filter(s => s._id !== skill._id)
                      })
                    }
                    className="font-bold"
                  >×</button>
                </span>
              ))}

              <select
                onChange={(e) => {
                  const selected = allSkills.find(s => s._id === e.target.value);
                  if (selected && !editData.batch?.find(s => s._id === selected._id)) {
                    setEditData({
                      ...editData,
                      batch: [...(editData.batch || []), selected]
                    });
                  }
                }}
                className={`outline-none bg-transparent ${inputThemeClasses}`}
              >
                <option value="">+ Add Batch</option>
                {allSkills.map(s => (
                  <option key={s._id} value={s._id}>{s.batchName}</option>
                ))}
              </select>
            </div>

            <p className={`font-semibold mb-1 ${viewTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Courses
            </p>
            <div className={`border rounded p-2 flex flex-wrap gap-2 mb-4 ${borderClasses}`}>
              {editData.courses?.map(course => (
                <span
                  key={course._id}
                  className={`${chipClasses.course} px-2 py-1 rounded flex items-center gap-1`}
                >
                  {course.name}
                  <button
                    onClick={() =>
                      setEditData({
                        ...editData,
                        courses: editData.courses.filter(c => c._id !== course._id)
                      })
                    }
                    className="font-bold"
                  >×</button>
                </span>
              ))}

              <select
                onChange={(e) => {
                  const selected = allCourses.find(c => c._id === e.target.value);
                  if (selected && !editData.courses?.find(c => c._id === selected._id)) {
                    setEditData({
                      ...editData,
                      courses: [...(editData.courses || []), selected]
                    });
                  }
                }}
                className={`outline-none bg-transparent ${inputThemeClasses}`}
              >
                <option value="">+ Add Course</option>
                {allCourses.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 rounded ${cancelButtonClasses}`}
              >
                Cancel
              </button>

              <button
                onClick={() => handleUpdate(editData._id)}
                className={`px-4 py-2 rounded ${buttonClasses}`}
              >
                Update
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CouresBatch;