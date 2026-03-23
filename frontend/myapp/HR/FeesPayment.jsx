import { useEffect, useState } from "react";
import axios from "axios";

export default function FeesPayment() {

    const token = localStorage.getItem("token");

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
        fetchFees();
    }, []);

    const fetchFees = async () => {
        const res = await axios.get(
            "http://localhost:4040/fees/findall",
            //   { headers: { Authorization: `Bearer ${token}` } }
        );

        setFeesData(res.data);
        console.log(res.data)
        fetchPaymentCounts(res.data);
    };
const openHistory = async (id) => {

    console.log("Fetching history for fee ID:", id);
   
  const res = await axios.get(`http://localhost:4040/payment/findone/${id}`);
  console.log("hfghjhgfdfgh",res.data);
  
  setHistory(Array.isArray(res.data) ? res.data : []);
  setShowHistory(true);
};
// console.log("history",history);


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

    return (
        <div className="ml-58 mt-10 p-6 bg-gray-100 min-h-screen">

            <h1 className="text-2xl font-bold mb-6">
                Student Fees Management
            </h1>


            <div className="bg-white shadow-xl rounded-xl overflow-hidden">

                <table className="w-full">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="p-3">Student</th>
                            <th className="p-3">Course</th>
                            {/* <th className="p-3">Batch</th> */}
                            <th className="p-3">Total</th>
                            <th className="p-3">Paid</th>
                            <th className="p-3">Remaining</th>
                            <th className="p-3">Times Paid</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Due Date</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {feesData.map(fee => (
                            <tr key={fee._id} className="border-b hover:bg-gray-50">

                                <td className="p-3">
                                    {fee.student?.visitor?.name}
                                </td>

                                <td className="p-3">
                                    {fee.course?.coursename}
                                </td>

                                {/* <td className="p-3">
                  {fee.batch?.batchName || "-"}
                </td> */}

                                <td className="p-3 font-semibold">
                                    ₹{fee.courseprice}
                                </td>

                                <td className="p-3 text-green-600">
                                    ₹{fee.amountpaid}
                                </td>

                                <td className="p-3 text-red-600">
                                    ₹{fee.remainingamount}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => openHistory(fee._id)}
                                        className="text-blue-500 hover:underline font-semibold"
                                    >
                                        {paymentCount[fee._id] || 0}
                                    </button>
                                </td>

                                <td className="p-3">
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

                                <td className="p-3">
                                    {fee.duedate
                                        ? new Date(fee.duedate).toLocaleDateString()
                                        : "-"}
                                </td>

                                <td className="p-3">
                                    <button
                                        onClick={() => {
                                            setEditData(fee);
                                            setShowEdit(true);
                                        }}
                                        className="text-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openHistory(fee._id)}
                                        className="text-purple-600 ml-2"
                                    >
                                        History
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* EDIT POPUP */}
            {showEdit && editData && (
                <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center ">

                    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">

                        <h2 className="text-xl font-bold mb-4">
                            Update Payment
                        </h2>

                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Total Amount</label>
                                <input
                                    value={editData.courseprice}
                                    readOnly
                                    className="w-full border px-3 py-2 rounded bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Amount Paying Now</label>
                                <input
                                    type="number"
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Remaining Amount</label>
                                <input
                                    type="number"
                                    value={Math.max(0, editData.courseprice - editData.amountpaid)}
                                    disabled
                                    className="w-full border px-3 py-2 rounded bg-gray-100 font-semibold text-red-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Next Due Date</label>
                                <input
                                    type="date"
                                    value={nextDueDate}
                                    onChange={(e) => setNextDueDate(e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEdit(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            
            {showHistory && (
                <div className="fixed inset-0 flex justify-center items-center  bg-opacity-40 z-50">
                    <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Payment History</h2>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {history && history.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="border p-2 text-left">Payment #</th>
                                            <th className="border p-2 text-left">Payment Date</th>
                                            <th className="border p-2 text-right">Amount Paid</th>
                                            <th className="border p-2 text-right">Total Collected</th>
                                            <th className="border p-2 text-right">Remaining</th>
                                            <th className="border p-2 text-left">Next Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((h, index) => (
                                            <tr key={h._id} className="hover:bg-gray-50">
                                                <td className="border p-2 font-semibold">{index + 1}</td>
                                                <td className="border p-2">{new Date(h.paymentDate).toLocaleDateString()}</td>
                                                <td className="border p-2 text-right text-green-600 font-semibold">₹{h.paidAmount}</td>
                                                <td className="border p-2 text-right text-blue-600 font-semibold">₹{h.amountPaid || h.paidAmount}</td>
                                                <td className="border p-2 text-right text-red-600 font-semibold">₹{h.remaining}</td>
                                                <td className="border p-2 text-orange-600">{h.nextDueDate?.slice(0, 10)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-lg">No payment history available</p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowHistory(false)}
                                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold"
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