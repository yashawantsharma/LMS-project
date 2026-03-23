import React, { useState } from 'react'
import SignUp from './SignUp';
import Login from './Login';

const Both = () => {
    const [view, setView] = useState("login");
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-100 shadow-lg rounded-2xl bg-white p-6">
                <div className="flex justify-center gap-2 mb-4">
                    <button onClick={() => setView("login")} className={`px-4 py-1 rounded ${view === "login" ? "bg-black text-white" : "bg-gray-200"}`}>Login</button>
                    {/* <button onClick={() => setView("signup")} className={`px-4 py-1 rounded ${view === "signup" ? "bg-black text-white" : "bg-gray-200"}`}>Sign Up</button> */}
                </div>


                {view === "login" ? (
                    <Login switchToSignup={() => setView("signup")} />
                ) : (
                    <SignUp switchToLogin={() => setView("login")} />
                )}
            </div>
        </div>
    )
}

export default Both
