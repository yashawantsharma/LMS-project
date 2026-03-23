import { useEffect, useState } from "react";
import axios from "axios";

export default function Fees() {
    const token = localStorage.getItem("token");
    const [viewTheme, setViewTheme] = useState("");

    const [feesData, setFeesData] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [payAmount, setPayAmount] = useState("");
    const [nextDueDate, setNextDueDate] = useState("");
    const [paymentCount, setPaymentCount] = useState([]);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        fetchTheme();
        fetchFees();
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

    const fetchFees = async () => {
        const res = await axios.get("http://localhost:4040/fees/findall");
        setFeesData(res.data);
        fetchPaymentCounts(res.data);
    };

    const openHistory = async (id) => {
        const res = await axios.get(`http://localhost:4040/payment/findone/${id}`);
        setHistory(Array.isArray(res.data) ? res.data : []);
        setShowHistory(true);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:4040/payment/", {
            feesId: editData._id,
            amount: Number(payAmount),
            nextDueDate
        });
        setShowEdit(false);
        setPayAmount("");
        setNextDueDate("");
        fetchFees();
    };

    const fetchPaymentCounts = async (feesList) => {
        const counts = {};
        for (let fee of feesList) {
            const res = await axios.get(`http://localhost:4040/payment/findone/${fee._id}`);
            counts[fee._id] = Array.isArray(res.data) ? res.data.length : 0;
        }
        setPaymentCount(counts);
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

    const modalClasses = viewTheme === "dark"
        ? "bg-gray-800 text-white"
        : "bg-white text-black";

    const labelClasses = viewTheme === "dark"
        ? "text-gray-300"
        : "text-gray-700";

    const disabledInputClasses = viewTheme === "dark"
        ? "bg-gray-600 text-white border-gray-600"
        : "bg-gray-100 text-black border-gray-300";

    const editButtonClasses = viewTheme === "dark"
        ? "bg-indigo-700 text-white hover:bg-indigo-800"
        : "bg-indigo-600 text-white hover:bg-indigo-700";

    const cancelButtonClasses = viewTheme === "dark"
        ? "bg-gray-600 text-white hover:bg-gray-700"
        : "bg-gray-300 text-black hover:bg-gray-400";

    const closeButtonClasses = viewTheme === "dark"
        ? "text-gray-400 hover:text-gray-300"
        : "text-gray-500 hover:text-gray-700";

    return (
        <div className={`ml-64 mt-14 p-6 min-h-screen ${themeClasses}`}>
            <h1 className="text-2xl font-bold mb-6">
                Student Fees Management
            </h1>

            <div className={`rounded-xl shadow-xl overflow-hidden ${cardThemeClasses}`}>
                <table className="w-full">
                    <thead className={tableHeaderClasses}>
                        <tr>
                            <th className="p-3 text-left">Student</th>
                            <th className="p-3 text-left">Course</th>
                            <th className="p-3 text-right">Total</th>
                            <th className="p-3 text-right">Paid</th>
                            <th className="p-3 text-right">Remaining</th>
                            <th className="p-3 text-center">Times Paid</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-center">Due Date</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {feesData.length === 0 ? (
                            <tr>
                                <td colSpan="9" className={`text-center py-6 ${viewTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    No fees data found
                                </td>
                            </tr>
                        ) : (
                            feesData.map(fee => (
                                <tr key={fee._id} className={`border-b ${tableRowClasses}`}>
                                    <td className="p-3">
                                        {fee.student?.visitor?.name || fee.student?.name || "N/A"}
                                    </td>

                                    <td className="p-3">
                                        {fee.course?.coursename || fee.course?.name || "N/A"}
                                    </td>

                                    <td className="p-3 font-semibold text-right">
                                        ₹{fee.courseprice}
                                    </td>

                                    <td className="p-3 text-green-600 text-right">
                                        ₹{fee.amountpaid}
                                    </td>

                                    <td className="p-3 text-red-600 text-right">
                                        ₹{fee.remainingamount}
                                    </td>

                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => openHistory(fee._id)}
                                            className={`hover:underline font-semibold ${
                                                viewTheme === "dark" ? "text-blue-400" : "text-blue-600"
                                            }`}
                                        >
                                            {paymentCount[fee._id] || 0}
                                        </button>
                                    </td>

                                    <td className="p-3 text-center">
                                        {fee.status === "paid" ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                                Completed
                                            </span>
                                        ) : fee.status === "partial" ? (
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                                                Partial
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                                                Unpaid
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 text-center">
                                        {fee.duedate
                                            ? new Date(fee.duedate).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditData(fee);
                                                    setShowEdit(true);
                                                }}
                                                className={`hover:underline ${
                                                    viewTheme === "dark" ? "text-indigo-400" : "text-indigo-600"
                                                }`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openHistory(fee._id)}
                                                className={`hover:underline ${
                                                    viewTheme === "dark" ? "text-purple-400" : "text-purple-600"
                                                }`}
                                            >
                                                History
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showEdit && editData && (
                <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
                    <div className={`w-full max-w-md p-6 rounded-xl shadow-xl ${modalClasses}`}>
                        <h2 className={`text-xl font-bold mb-4 border-b pb-2 ${borderClasses}`}>
                            Update Payment
                        </h2>

                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-semibold mb-1 ${labelClasses}`}>
                                    Total Amount
                                </label>
                                <input
                                    value={editData.courseprice}
                                    readOnly
                                    className={`w-full border px-3 py-2 rounded ${disabledInputClasses}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-semibold mb-1 ${labelClasses}`}>
                                    Amount Paying Now
                                </label>
                                <input
                                    type="number"
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                    className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-semibold mb-1 ${labelClasses}`}>
                                    Remaining Amount
                                </label>
                                <input
                                    type="number"
                                    value={Math.max(0, editData.courseprice - editData.amountpaid)}
                                    disabled
                                    className={`w-full border px-3 py-2 rounded font-semibold text-red-600 ${disabledInputClasses}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-semibold mb-1 ${labelClasses}`}>
                                    Next Due Date
                                </label>
                                <input
                                    type="date"
                                    value={nextDueDate}
                                    onChange={(e) => setNextDueDate(e.target.value)}
                                    className={`w-full border px-3 py-2 rounded ${inputThemeClasses}`}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEdit(false)}
                                    className={`px-4 py-2 rounded ${cancelButtonClasses}`}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded ${editButtonClasses}`}
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showHistory && (
                <div className="fixed inset-0 flex justify-center items-center  bg-opacity-50 z-50">
                    <div className={`p-8 rounded-xl w-full max-w-2xl shadow-2xl ${modalClasses}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Payment History</h2>
                            <button
                                onClick={() => setShowHistory(false)}
                                className={`hover:opacity-70 text-2xl font-bold ${closeButtonClasses}`}
                            >
                                ✕
                            </button>
                        </div>

                        {history && history.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead className={viewTheme === "dark" ? "bg-gray-700" : "bg-gray-200"}>
                                        <tr>
                                            <th className={`border p-2 text-left ${borderClasses}`}>#</th>
                                            <th className={`border p-2 text-left ${borderClasses}`}>Payment Date</th>
                                            <th className={`border p-2 text-right ${borderClasses}`}>Amount Paid</th>
                                            <th className={`border p-2 text-right ${borderClasses}`}>Total Collected</th>
                                            <th className={`border p-2 text-right ${borderClasses}`}>Remaining</th>
                                            <th className={`border p-2 text-left ${borderClasses}`}>Next Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((h, index) => (
                                            <tr key={h._id} className={viewTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                                                <td className={`border p-2 font-semibold ${borderClasses}`}>{index + 1}</td>
                                                <td className={`border p-2 ${borderClasses}`}>
                                                    {new Date(h.paymentDate).toLocaleDateString()}
                                                </td>
                                                <td className={`border p-2 text-right text-green-600 font-semibold ${borderClasses}`}>
                                                    ₹{h.paidAmount}
                                                </td>
                                                <td className={`border p-2 text-right text-blue-600 font-semibold ${borderClasses}`}>
                                                    ₹{h.amountPaid || h.paidAmount}
                                                </td>
                                                <td className={`border p-2 text-right text-red-600 font-semibold ${borderClasses}`}>
                                                    ₹{h.remaining}
                                                </td>
                                                <td className={`border p-2 text-orange-600 ${borderClasses}`}>
                                                    {h.nextDueDate?.slice(0, 10)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className={`text-lg ${viewTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                    No payment history available
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowHistory(false)}
                                className={`px-6 py-2 rounded font-semibold ${cancelButtonClasses}`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}