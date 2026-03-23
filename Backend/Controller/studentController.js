const studentmodel = require("../Model/StudentModel");
const User =require("../Model/userModel")
const bycrypt = require("bcrypt");
const nodemailer = require("nodemailer");
let oldotp= 0;
function generatePassword(length = 4) {
  const chars =
    "0123456789";
  let password = "";
  for (let i = 0; i <length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}
exports.addstudent = async (req, res) => {
  try {
    const { name, email, phone, course, fees } = req.body;
    // console.log(req.body);
    

    if (!name || !email || !phone || !course || !fees) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({message:"user already exist"})
    }
        const password = generatePassword(6);   
            const salt = await bycrypt.genSalt(10);
                const hashedPassword = await bycrypt.hash(password, salt);
    const existingStudent = await studentmodel.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already exists"
      });
    }
     const transporter=nodemailer.createTransport({
                service:"gmail",
                auth: {
                    user: process.env.SENT_EMAIL,
                    pass: process.env.SENT_PASS,
                }
            });
    const info = await transporter.sendMail({
  from: '"HR Team | Task Manager" <hariomsharmah822822@gmail.com>',
  to: email,
  subject: "🎉 Welcome to Task Manager",
  html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
    
    <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:#16a34a; padding:20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size:22px;">
          🎉 Welcome to Task Manager
        </h1>
      </div>

      <!-- Body -->
      <div style="padding:24px; color:#374151;">
        <p style="font-size:16px; margin-bottom:16px;">
          Hello <strong>${name}</strong> 👋,
        </p>

        <p style="font-size:15px; margin-bottom:20px;">
          You have been successfully added to our system. Below are your account details:
        </p>

        <!-- User Info -->
        <div style="border:1px solid #e5e7eb; border-radius:6px; padding:16px; background:#f9fafb;">
          <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>👤 Name:</strong> ${name}
          </p>
          <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>📧 Email:</strong> ${email}
          </p>
           <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>� Password</strong> ${password}
          </p>
          <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>📞 Phone:</strong> ${phone}
          </p>
          <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>🎭 Role:</strong> student
          </p>
        </div>

        <p style="font-size:14px; margin-top:16px;">
          For security reasons, your password is not shown here. Please login and change your password after first login.
        </p>

        <!-- Button -->
        <div style="text-align:center; margin-top:24px;">
          <a href="http://localhost:3000/login"
            style="display:inline-block; padding:12px 24px; background:#16a34a; color:#ffffff; text-decoration:none; font-size:14px; border-radius:6px;">
            Login to Dashboard
          </a>
        </div>

        <p style="font-size:13px; color:#6b7280; margin-top:24px;">
          If you have any questions, feel free to contact the HR team.
        </p>
      </div>

      <!-- Footer -->
      // <div style="background:#f3f4f6; padding:16px; text-align:center; font-size:12px; color:#6b7280;">
      //   © 2026 Task Manager | All rights reserved.
      // </div>
    </div>

  </body>
  </html>
  `
});

    const newStudent = await studentmodel.create({
      name,
      email,
      phone,
      course,
      fees
    });
     const user=new User({
                name:name,
                email:email,
                phone:phone,
                password:hashedPassword,
                roll:"student"
            })
            await user.save()
    res.status(201).json({
      message: "Student added successfully",
      student: newStudent
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.onesudent=async(req,res)=>{
    try {
        const {id}=req.params
        const onedata=await studentmodel.findById(id).populate("visitor")
        return res.status(200).json(onedata)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
exports.allstudent=async(req,res)=>{
    try {
        const alldata=await studentmodel.find().populate("course").populate("batch").populate("visitor")
        return res.status(200).json(alldata)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
exports.deletestudent=async(req,res)=>{
    try {
        const {id}=req.params
        console.log(id);
        const studentdelete=await studentmodel.findByIdAndUpdate(id,{
 status:"deleted"
})
        return res.status(200).json(studentdelete)
    }
        catch (error) {
            res.status(400).json({error:error.message})
    }
}
exports.updatestudent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedstudent = await studentmodel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    if (!updatedstudent) {
      return res.status(404).json({ message: "student not found" });
    }
    res.status(200).json(updatedstudent);
  }
    catch (error) {
        res.status(400).json({error:error.message})
    }
}
exports.activestudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await studentmodel.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const updated = await studentmodel.findByIdAndUpdate(
      id,
      { isactive: !student.isactive },
      { new: true }
    );

    res.status(200).json(updated);

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};



exports.getStudentsByBatchParam = async (req, res) => {
  try {
    const { batchId } = req.params; 
    
    const students = await studentmodel.find({ batch: batchId })
      .populate("user")
      .populate("course")
      .populate("batch");
      
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};