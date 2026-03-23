import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const navigate = useNavigate();
  const [viewTheme, setViewTheme] = React.useState("");

  const [data, setData] = React.useState({
    email: "",
    oldpassword: "",
    newpassword: "",
    confrompassword: "",
  });

  const [error, setError] = React.useState({});
  const [serverError, setServerError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchTheme();
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

  const datasumit = async (e) => {
    e.preventDefault();
    setServerError("");

    const arr = {};
    if (!data.email) arr.email = "Email is required";
    if (!data.oldpassword) arr.oldpassword = "Old password is required";
    if (!data.newpassword) arr.newpassword = "New password is required";
    if (!data.confrompassword) arr.confrompassword = "Confirm password is required";

    setError(arr);

    if (Object.keys(arr).length === 0) {
      if (data.newpassword !== data.confrompassword) {
        setServerError("New password and confirm password do not match");
        return;
      }

      try {
        setLoading(true);
        const res = await axios.post("http://localhost:4040/users/reset", data);
        alert("Password reset successful");
        setData({
          email: "",
          oldpassword: "",
          newpassword: "",
          confrompassword: "",
        });
        navigate("/login");
      } catch (err) {
        setServerError(err.response?.data?.message || "Password reset failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const themeClasses = viewTheme === "dark" 
    ? "bg-gray-900 text-white" 
    : "bg-gray-100 text-black";

  const cardThemeClasses = viewTheme === "dark"
    ? "bg-gray-800 text-white border-gray-700"
    : "bg-white text-black border-gray-200";

  const inputThemeClasses = viewTheme === "dark"
    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:ring-indigo-400"
    : "bg-white text-black border-gray-300 focus:ring-indigo-500";

  const labelClasses = viewTheme === "dark"
    ? "text-gray-300"
    : "text-gray-600";

  const headingClasses = viewTheme === "dark"
    ? "text-white"
    : "text-gray-800";

  const errorTextClasses = "text-red-400";

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${themeClasses}`}>
      <form
        onSubmit={datasumit}
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 space-y-5 ${cardThemeClasses}`}
      >
        <h2 className={`text-2xl font-bold text-center ${headingClasses}`}>
          Reset Password
        </h2>

        {serverError && (
          <p className={`text-sm text-center ${errorTextClasses}`}>
            {serverError}
          </p>
        )}

        <div>
          <label className={`text-sm ${labelClasses}`}>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className={`w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${inputThemeClasses}`}
            placeholder="Enter your email"
          />
          {error.email && (
            <p className="text-red-500 text-xs mt-1">{error.email}</p>
          )}
        </div>

        <div>
          <label className={`text-sm ${labelClasses}`}>Old Password</label>
          <input
            type="password"
            value={data.oldpassword}
            onChange={(e) => setData({ ...data, oldpassword: e.target.value })}
            className={`w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${inputThemeClasses}`}
            placeholder="Enter old password"
          />
          {error.oldpassword && (
            <p className="text-red-500 text-xs mt-1">{error.oldpassword}</p>
          )}
        </div>

        <div>
          <label className={`text-sm ${labelClasses}`}>New Password</label>
          <input
            type="password"
            value={data.newpassword}
            onChange={(e) => setData({ ...data, newpassword: e.target.value })}
            className={`w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${inputThemeClasses}`}
            placeholder="Enter new password"
          />
          {error.newpassword && (
            <p className="text-red-500 text-xs mt-1">{error.newpassword}</p>
          )}
        </div>

        <div>
          <label className={`text-sm ${labelClasses}`}>Confirm Password</label>
          <input
            type="password"
            value={data.confrompassword}
            onChange={(e) => setData({ ...data, confrompassword: e.target.value })}
            className={`w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${inputThemeClasses}`}
            placeholder="Confirm new password"
          />
          {error.confrompassword && (
            <p className="text-red-500 text-xs mt-1">{error.confrompassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg transition ${
            viewTheme === "dark"
              ? "bg-indigo-700 text-white hover:bg-indigo-800"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default Reset;