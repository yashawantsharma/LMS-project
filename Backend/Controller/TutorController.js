const tutorsmodel = require("../Model/TutorModel")
const userModel = require("../Model/userModel");
const nodemailer = require("nodemailer");
const bycrypt = require("bcrypt");
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
exports.addtutor = async (req, res) => {
  try {
    const { name, email, phone, course,salary,experience } = req.body;
    console.log(req.body);
    if (!name || !email || !phone ) {
        return res.status(400).json({message:"all field are required"})
    }
    const password = generatePassword(6);
   
    const existingTutor = await tutorsmodel.findOne({ email });
    if (existingTutor) {
      return res.status(400).json({
        message: "Tutor already exists"
      });
    }
    console.log(">>>data",req.body);
        const transporter=nodemailer.createTransport({
                service:"gmail",
                auth: {
                    user: process.env.SENT_EMAIL,
                    pass: process.env.SENT_PASS,
                }       
                 });
    const info = await transporter.sendMail({
  from: '"HR Team | Task Manager" <' + process.env.SENT_EMAIL + '>',
  to: email,
  subject: "Welcome to Task Manager",
  html: `<h2>Welcome ${name}</h2>
         <p>Your account has been created successfully.</p>
           <p>Your  email is: <strong>${email}</strong></p>
         <p>Your temporary password is: <strong>${password}</strong></p>
         <p>Please login and change your password.</p>`
    });
     const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);
    const data = { name, email, phone, course,salary,experience };
    const tutor = new tutorsmodel(data);
    await tutor.save();
        const userData = {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "tutor"
    };
    const user = new userModel(userData);
    await user.save();
    res.status(200).json({ message: "Tutor added successfully", tutor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.onetutor = async (req, res) => {
  try {
    const { id } = req.params;
    const tutorData = await tutorsmodel.findById(id).populate("course");
    return res.status(200).json(tutorData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.alltutor = async (req, res) => {
  try {
    const allData = await tutorsmodel.find().populate("course");
    return res.status(200).json(allData);
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deletetutor = async (req, res) => {
  try {
    const { id } = req.params;
    const tutorDelete = await tutorsmodel.findOneAndDelete(id);
    return res.status(200).json(tutorDelete);
  }
    catch (error) {
    res.status(400).json({ error: error.message });
    }
};

exports.updatetutor = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(">>>update data", data);
    const tutorUpdate = await tutorsmodel.findByIdAndUpdate(id, data, { new: true });
    if (!tutorUpdate) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    res.status(200).json(tutorUpdate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.activetutor = async (req, res) => {
  try {
    const { id } = req.params;
    const tutor = await tutorsmodel.findById(id);
    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found"
      });
    }

    const updated = await tutorsmodel.findByIdAndUpdate(
      id,
      { isactive: !tutor.isactive },
      { new: true }
    );

    res.status(200).json(updated);

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};