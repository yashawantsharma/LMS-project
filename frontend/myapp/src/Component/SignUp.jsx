import axios from 'axios'
import React, { useState } from 'react'

const SignUp = ({ switchToLogin }) => {
    const [signUpInput, setSignUpInput] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        roll:""
    })
    const [error, setError] = useState({})
    const submitform = (e) => {
        e.preventDefault()
        let result = {}
        if (!signUpInput.name) {
            result.name = "name is required"
        }
        if (!signUpInput.email) {
            result.email = "email is required"
        }
        if (!signUpInput.phone) {
            result.phone = "phone is required"
        }
        setError(result)
        if (Object.keys(result).length === 0) {
            const result = axios.post("http://localhost:4040/users/", signUpInput)
            alert("Account is cerated successfully")
        }
    }
    return (
        <div>
            <form className="space-y-3">
                <h2 className="text-xl font-bold text-center">Sign Up</h2>
                <input type="text"
                    value={signUpInput.name}
                    onChange={(e) => setSignUpInput({ ...signUpInput, name: e.target.value })}
                    placeholder="Name"
                    className="w-full p-2 border rounded" />
                {error.name && <p style={{ color: "red" }}>{error.name}</p>}
                <input type="email"
                    value={signUpInput.email}
                    onChange={(e) => setSignUpInput({ ...signUpInput, email: e.target.value })}
                    placeholder="Email"
                    className="w-full p-2 border rounded" />
                {error.email && <p style={{ color: "red" }}>{error.email}</p>}
                <input type="phone"
                    value={signUpInput.phone}
                    onChange={(e) => setSignUpInput({ ...signUpInput, phone: e.target.value })}
                    placeholder="phone"
                    className="w-full p-2 border rounded" />
                {error.phone && <p style={{ color: "red" }}>{error.phone}</p>}

                <input type="text"
                    value={signUpInput.roll}
                    onChange={(e) => setSignUpInput({ ...signUpInput, roll: e.target.value })}
                    placeholder="roll"
                    className="w-full p-2 border rounded" />
                {error.roll && <p style={{ color: "red" }}>{error.roll}</p>}

                <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={signUpInput.gender === "male"}
                            onChange={(e) =>
                                setSignUpInput({ ...signUpInput, gender: e.target.value })
                            }
                        />
                        Male
                    </label>

                    <label className="flex items-center gap-1">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={signUpInput.gender === "female"}
                            onChange={(e) =>
                                setSignUpInput({ ...signUpInput, gender: e.target.value })
                            }
                        />
                        Female
                    </label>
                </div>

                {error.render && <p style={{ color: "red" }}>{error.gender}</p>}



                <button onClick={submitform}
                    className="w-full bg-black text-white py-2 rounded">Create Account</button>
                <p className="text-sm text-center">Already have an account? <span onClick={switchToLogin} className="text-blue-600 cursor-pointer">Login</span></p>
            </form>
        </div>
    )
}

export default SignUp
