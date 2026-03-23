import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDarkMode, MdLightMode, MdLogout, MdLock, MdHome, MdSave, MdClose, MdPhone, MdEmail, MdPerson } from "react-icons/md";

export default function Profile() {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aditpopup, setAditPopup] = useState(false);
  const [viewTheme, setViewTheme] = useState("");
  const [updatedata, setUpdateData] = useState({
    name: "",
    email: "",
    phone: "",
    theme: "light",
  });

  const id = localStorage.getItem("userid");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTheme();
    fetchUser();
  }, []);

  useEffect(() => {
    if (userdata) {
      setUpdateData({
        name: userdata.name || "",
        email: userdata.email || "",
        phone: userdata.phone || "",
        theme: userdata.theme || "light",
      });
    }
  }, [userdata]);

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

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:4040/users/oneuser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserdata(res.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleResetPassword = () => {
    navigate("/reset");
  };

  const profileadit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4040/users/update/${id}`,
        updatedata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Profile updated successfully");
      setAditPopup(false);
      fetchUser();
      if (updatedata.theme !== userdata.theme) {
        fetchTheme();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
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

  const labelClasses = viewTheme === "dark"
    ? "text-gray-300"
    : "text-gray-700";

  const mutedTextClasses = viewTheme === "dark"
    ? "text-gray-400"
    : "text-gray-500";

  const borderClasses = viewTheme === "dark"
    ? "border-gray-700"
    : "border-gray-200";

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className={mutedTextClasses}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${themeClasses}`}>
      <div className={`w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden ${cardThemeClasses}`}>
        <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg border-4 ${
              viewTheme === "dark" ? "bg-indigo-700 border-gray-800" : "bg-indigo-600 border-white"
            } text-white`}>
              {userdata?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="pt-20 pb-6 px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-1">{userdata?.name}</h2>
            <p className={`flex items-center justify-center gap-1 ${mutedTextClasses}`}>
              <MdEmail className="inline" /> {userdata?.email}
            </p>
            <span className={`inline-block mt-2 px-4 py-1 text-sm rounded-full ${
              viewTheme === "dark" ? "bg-indigo-900 text-indigo-300" : "bg-indigo-100 text-indigo-600"
            } capitalize`}>
              {userdata?.roll || "user"}
            </span>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 rounded-lg ${viewTheme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
            <div className="flex items-center gap-3">
              <MdPhone className={`text-xl ${viewTheme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
              <div>
                <p className={`text-sm ${mutedTextClasses}`}>Phone</p>
                <p className="font-medium">{userdata?.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {viewTheme === "dark" ? (
                <MdDarkMode className={`text-xl ${viewTheme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
              ) : (
                <MdLightMode className={`text-xl ${viewTheme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
              )}
              <div>
                <p className={`text-sm ${mutedTextClasses}`}>Theme Preference</p>
                <p className="font-medium capitalize">{userdata?.theme || "light"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setAditPopup(true)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition border ${
                viewTheme === "dark"
                  ? "border-indigo-600 text-indigo-400 hover:bg-indigo-900 hover:bg-opacity-20"
                  : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <MdEdit size={18} />
              Update Profile
            </button>

            <button
              onClick={handleResetPassword}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition border ${
                viewTheme === "dark"
                  ? "border-yellow-600 text-yellow-400 hover:bg-yellow-900 hover:bg-opacity-20"
                  : "border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              }`}
            >
              <MdLock size={18} />
              Reset Password
            </button>

            <button
              onClick={() => navigate("/")}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition ${
                viewTheme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-700 text-white hover:bg-gray-800"
              }`}
            >
              <MdHome size={18} />
              Back to Dashboard
            </button>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition bg-red-600 text-white hover:bg-red-700"
            >
              <MdLogout size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {aditpopup && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-xl p-6 ${cardThemeClasses}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Update Profile</h3>
              <button
                onClick={() => setAditPopup(false)}
                className={`p-1 rounded-full hover:bg-gray-200 ${viewTheme === "dark" ? "hover:bg-gray-700" : ""}`}
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); profileadit(); }} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${labelClasses}`}>
                  <MdPerson className="inline mr-1" /> Full Name
                </label>
                <input
                  type="text"
                  value={updatedata.name}
                  onChange={(e) => setUpdateData({...updatedata, name: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${inputThemeClasses}`}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${labelClasses}`}>
                  <MdEmail className="inline mr-1" /> Email Address
                </label>
                <input
                  type="email"
                  value={updatedata.email}
                  onChange={(e) => setUpdateData({...updatedata, email: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${inputThemeClasses}`}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${labelClasses}`}>
                  <MdPhone className="inline mr-1" /> Phone Number
                </label>
                <input
                  type="text"
                  value={updatedata.phone}
                  onChange={(e) => setUpdateData({...updatedata, phone: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${inputThemeClasses}`}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${labelClasses}`}>
                  {viewTheme === "dark" ? <MdDarkMode className="inline mr-1" /> : <MdLightMode className="inline mr-1" />}
                  Theme Preference
                </label>
                <select
                  value={updatedata.theme}
                  onChange={(e) => setUpdateData({...updatedata, theme: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${inputThemeClasses}`}
                >
                  <option value="light">Light Mode ☀️</option>
                  <option value="dark">Dark Mode 🌙</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <MdSave size={18} />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setAditPopup(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${
                    viewTheme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  <MdClose size={18} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}