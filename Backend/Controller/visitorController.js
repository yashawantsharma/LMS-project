const visitorsmodel = require("../Model/visitorModel.js");
const studentmodel = require("../Model/StudentModel.js");
const usermodel = require("../Model/userModel.js");
const feeshmodel = require("../Model/feesModel.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const creareimage=require("../Utility/cloud").uploadImage
const otp = 0;
function generateOTP(Lenth = 4) {
    const chars = "0123456789";
    let OTP = "";
    for (let i = 0; i < Lenth; i++) {
        OTP += chars.charAt(Math.floor(Math.random() * chars.length));

    }
    return OTP;
}

exports.addvisitor = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ message: "all field are required" })
        }
        const password = generateOTP(6);
        const transporter = nodemailer.createTransport({
            service: "gmail",
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
        const existingVisitor = await visitorsmodel.findOne({ email });
        if (existingVisitor) {
            return res.status(400).json({ message: "visitor already exists" })
        }
        const visitor = new visitorsmodel(req.body);
        await visitor.save();

        res.status(201).json({ message: "visitor added successfully", visitor });
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};
exports.onevisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const visitorData = await visitorsmodel.findById(id).populate("course");
        if (!visitorData) {
            return res.status(404).json({ message: "visitor not found" })
        }
        res.status(200).json(visitorData);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};
exports.allvisitor = async (req, res) => {
    try {
        const allvisitor = await visitorsmodel.find().populate("coures");
        res.status(200).json(allvisitor);
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};
exports.deletevisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const visitorDelete = await visitorsmodel.findByIdAndDelete(id);
        if (!visitorDelete) {
            return res.status(404).json({ message: "visitor not found" })
        }
        res.status(200).json({ message: "visitor deleted successfully", visitorDelete });
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};
exports.updatevisitor = async (req, res) => {
    try {
        const { id } = req.params;

        const data = req.body;
        const visitorUpdate = await visitorsmodel.findByIdAndUpdate(id, data, { new: true });
        if (!visitorUpdate) {
            return res.status(404).json({ message: "visitor not found" })
        }
        res.status(200).json({ message: "visitor updated successfully", visitorUpdate });
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};
exports.activevisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const visitor = await visitorsmodel.findById(id);
        if (!visitor) {
            return res.status(404).json({ message: "visitor not found" })
        }
        const updated = await visitorsmodel.findByIdAndUpdate(id, { isActive: !visitor.isActive }, { new: true });
        res.status(200).json({ message: "visitor status updated successfully", updated });
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// exports.convertstudent = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const visitor = await visitorsmodel.findById(id);
//         if (!visitor) {
//             return res.status(404).json({ message: "Visitor not found" });
//         }
//             const password = generateOTP(6);
//                         const transporter=nodemailer.createTransport({
//                 service:"gmail",
//                 auth: {
//                     user: process.env.USER_EMAIL,
//                     pass: process.env.USER_PASS,
//                 }
//                     });
//     const info = await transporter.sendMail({
//   from: '"HR Team | Task Manager" <' + process.env.USER_EMAIL + '>',
//   to: visitor.email,
//     subject: "Welcome you are now a student",
//     html: `<h2>Welcome ${visitor.name}</h2>
//             <h3>Congratulations! You have been converted to a student.</h3>
//             <p>Your account has been created successfully.</p>
//            <p>Your  email is: <strong>${visitor.email}</strong></p>
//             <p>Your temporary password is: <strong>${password}</strong></p>
//             <p>Please login and change your password.</p>`
//     });
//          const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//          const existingUser = await usermodel.findOne({email});
//         if(existingUser){
//             return res.status(400).json({message:"user already exists"})
//         }
//          const userData = {
//             name: visitor.name,
//             email: visitor.email,
//             phone: visitor.phone,
//             password: hashedPassword,
//             role: "student",
//         };
//         const user = new usermodel(userData);
//         await user.save();
//         const studentData = {

//             visitorId: id
//         };
//         const student = new studentmodel(studentData);
//         await student.save();
//         await visitorsmodel.findByIdAndDelete(id);
//         res.status(200).json({ message: "Visitor converted to student successfully", student });
//     }
//     catch(error){
//         res.status(400).json({error:error.message})
//     }
// };



// exports.convertstudent = async (req, res) => {
//     console.log(">>>convertstudent called with data:", req.body);
//     try {

//         const { id } = req.params;

//         // Unwrap studentdata from request body
//         const studentdata = req.body.studentdata || req.body;

//         const {
//             courseprice,
//             paymenttype,
//             paymentmode,
//             amountpaid,
//             duedate,
//             course,
//             batch,
//             batchStartDate,
//             addressLine,
//             city,
//             state,
//             pincode,
//             notes
//         } = studentdata;
//         const photo = req.files?.photo?.[0]?.path || null;
//         const addressProof = req.files?.addressProof?.[0]?.path || null;

//         const visitor = await visitorsmodel.findById(id);
//         if (!visitor) {
//             return res.status(404).json({ message: "Visitor not found" });
//         }
//         console.log(">>>visitor data:", visitor);

//         let user = await usermodel.findOne({
//             email: visitor.email
//         });

//         // ensure we have a valid name (fallback to request/body/email local-part)
//         const fallbackName = (studentdata && studentdata.name) || (visitor.email && visitor.email.split('@')[0]) || `Student${Date.now()}`;
//         const userName = visitor.name || fallbackName;

//         // If user already exists, update it instead of creating new one
//         if (user) {
//             console.log(">>>user already exists, updating existing user");
//             user = await usermodel.findByIdAndUpdate(
//                 user._id,
//                 {
//                     name: userName,
//                     email: visitor.email,
//                     phone: visitor.phone,
//                     role: "student"
//                 },
//                 { new: true }
//             );
//         } else {
//             console.log(">>>creating new user");

//             const password = generateOTP(6);
//             const transporter = nodemailer.createTransport({
//                 service: "gmail",
//                 auth: {
//                     user: process.env.SENT_EMAIL,
//                     pass: process.env.SENT_PASS,
//                 }
//             });
//             const info = await transporter.sendMail({
//                 from: '"HR Team | Task Manager" <' + process.env.SENT_EMAIL + '>',
//                 to: visitor.email,
//                 subject: "Welcome to convert student",
//                 html: `<h2>Welcome ${visitor.name}</h2>
//             <p>Your account has been created successfully.</p>
//             <p>Your  email is: <strong>${visitor.email}</strong></p>
//             <p>Your temporary password is: <strong>${password}</strong></p>
//             <p>Please login and change your password.</p>`
//             });
//             const hashedPassword = await bcrypt.hash(password, 10);

//             user = await usermodel.create({
//                 name: userName,
//                 email: visitor.email,
//                 phone: visitor.phone,
//                 password: hashedPassword,
//                 role: "student"
//             });
//         }
//         console.log(">>>user created/updated:", user);

//         const student = await studentmodel.create({
//             visitor: visitor._id,
//             user: user._id
//         });

//         const paid = Number(amountpaid) || 0;
//         const price = Number(courseprice) || 0;
//         const remainingamount = price - paid;

//         // Use visitor's course if not provided in request
//         const finalCourse = course || visitor.coures;

//         const feesData = {
//             student: student._id,
//             course: finalCourse,
//             courseprice: price,
//             paymenttype,
//             paymentmode,
//             amountpaid: paid,
//             remainingamount,
//             status: paid === price ? "paid" : paid > 0 ? "partial" : "unpaid",
//             duedate
//         };

//         // Only add batch if provided
//         if (batch) {
//             feesData.batch = batch;
//         }

//         await feeshmodel.create(feesData);

//         await visitorsmodel.findByIdAndUpdate(id, {
//             status: "converted",
//             isActive: false
//         });

//         res.status(200).json({
//             message: "Visitor converted successfully",
//             data: { user, student }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: error.message
//         });
//     }
// };


exports.convertstudent = async (req, res) => {
  console.log(">>>convertstudent called with data:", req.body);

  try {
    const { id } = req.params;

    const studentdata = req.body.studentdata || req.body;

    const {
      courseprice,
      paymenttype,
      paymentmode,
      amountpaid,
      duedate,
      course,
      batch,
      batchStartDate,
      addressLine,
      city,
      state,
      pincode,
      notes,
      name
    } = studentdata;

    // files
    const file =req.files
        // console.log(file);
        const data1 =await  creareimage(file)
        const finalimage=data1[0].url;
    // const photo = req.files?.photo?.[0]?.path || null;
    // const addressProof = req.files?.addressProof?.[0]?.path || null;

    const visitor = await visitorsmodel.findById(id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    // user check
    let user = await usermodel.findOne({ email: visitor.email });

    const fallbackName =
      name ||
      visitor.name ||
      visitor.email?.split("@")[0] ||
      `Student${Date.now()}`;

    if (user) {
      user = await usermodel.findByIdAndUpdate(
        user._id,
        {
          name: fallbackName,
          phone: visitor.phone,
          role: "student"
        },
        { new: true }
      );
    } else {
      const password = generateOTP(6);

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await usermodel.create({
        name: fallbackName,
        email: visitor.email,
        phone: visitor.phone,
        password: hashedPassword,
        role: "student"
      });
       await user.save()

      // send mail (optional)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SENT_EMAIL,
          pass: process.env.SENT_PASS,
        }
      });

      await transporter.sendMail({
        from: `"HR Team" <${process.env.SENT_EMAIL}>`,
        to: visitor.email,
        subject: "Welcome Student",
        html: `
          <h2>Welcome ${fallbackName}</h2>
          <p>Email: ${visitor.email}</p>
          <p>Password: ${password}</p>
        `
      });
    }

    // payment calc
    const price = Number(courseprice) || 0;
    const paid = Number(amountpaid) || 0;
    const remainingamount = Math.max(price - paid, 0);
    const finalCourse = course || visitor.coures;

    // create student with extra fields
    const student = await studentmodel.create({
      visitor: visitor._id,
      user: user._id,
      course: finalCourse,
      batch,
      batchStartDate,
      addressLine,
      city,
      state,
      pincode,
      notes,
      photo:finalimage,
      addressProof:finalimage
    });

    // fees record
    await feeshmodel.create({
      student: student._id,
      course: finalCourse,
      batch,
      courseprice: price,
      paymenttype,
      paymentmode,
      amountpaid: paid,
      remainingamount,
      status:
        paid === price
          ? "paid"
          : paid > 0
          ? "partial"
          : "unpaid",
      duedate
    });

    // update visitor
    await visitorsmodel.findByIdAndUpdate(id, {
      status: "converted",
      isActive: false
    });

    res.status(200).json({
      message: "Visitor converted successfully",
      data: { user, student }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};