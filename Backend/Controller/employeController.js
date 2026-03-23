const employe = require("../Model/employeModel")
const bcrypt=require('bcrypt')
const User =require("../Model/userModel")
const jwt=require('jsonwebtoken')
const nodemailer = require("nodemailer");
const creareimage=require("../Utility/cloud").uploadImage


function generatePassword(length = 6) {
    const chars = "0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
}

exports.addemploye = async (req, res) => {
    try {
        
        const file =req.files
        // console.log(file);
        const data1 =await  creareimage(file)
        const finalimage=data1[0].url;

        const { name, email, phone, dob, role, gender, salary, joinDate, profileImage, employmentType, addharImage, panNumber } = req.body
        // if (!(name && email && phone && dob && role & gender && salary && joinDate && profileImage && employmentType && addharImage && panNumber)) {
        //     return res.status(400).json({ message: "all fild are rquired" })
        // }
        const employedata = await employe.findOne({ email })
        if (employedata) {
            return res.status(400).json({ message: "email are allready axist" });
        }
        const password = generatePassword()
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt);
        const data = { name, email, phone, password: hash, gender, role,dob,salary,joinDate,profileImage:finalimage,employmentType,addharImage:finalimage,panNumber }
        // console.log("hgjdsfjkhjghfgh",data)
        const server = new employe(data)
        await server.save()
         const user=new User({
                        name:name,
                        email:email,
                        phone:phone,
                        password:hash,
                        role:role,
                    })
                    await user.save()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SENT_EMAIL,
                pass: process.env.SENT_PASS,
            },
        });


        const info = await transporter.sendMail({
            from: process.env.SENT_EMAIL,
            to: email,
            subject: "Account Created successfully",
            subject: "Account Created",
            html: `
             <p>Hello <b>${name}</b>,</p>
         
             <p>
               Your account has been created with the following details:
             </p>
         
             <p>
               <b>Email:</b> ${email}<br/>
               <b>Phone:</b> ${phone}<br/>
               <b>Password:</b> ${password}
             </p>
         
             <p>
               Please change your password after login.
             </p>
         
             <p>
               Thanks,<br/>
             </p>
           `,

        });
        // console.log("Message sent:", info.messageId);
        return res.status(201).json({server, info:info.messageId});
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
}


exports.oneemploye=async(req,res)=>{
    try {
        const {id}=req.params
        const oneenpmoye=await employe.findById(id)
        return res.status(200).json(oneenpmoye)
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
}



exports.allemploye=async(req,res)=>{
    try {
        const allemploye=await employe.find()
        return res.status(200).json(allemploye)
    } catch (error) {
        return res.status(400).json({error:error.message})
    }
}




exports.passreset=async(req,res)=>{
    try {
        const {email, oldpassword,newpassword,confrompassword}=req.body
         if (!(email && oldpassword && newpassword && confrompassword)) {
            return res.status(400).json({message:"all input aer required"});
        }
         const resetdata = await user.findOne({ email })
        if (!resetdata) {
            return res.status(400).json({message:"invalid email "})
        }
        const dbpasword = resetdata.password
        const isMatch = await bcrypt.compare(oldpassword, dbpasword)
        if (!isMatch) {
            return res.status(400).json({message:"oldpassword is no match"})
        }
          if (newpassword !== confrompassword) {
            return res.status(400).json("confrompassword no match")
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(newpassword, salt)
        const handel = await user.findOneAndUpdate({ email }, { $set: { password: hash } })
        return res.status(200).json("successfully");
    } catch (error) {
        return res.status(400).json({ error: error.massage })
    }
}


exports.deleteemploye=async(req,res)=>{
    try {
        const {id}=req.params
        // console.log(id);
        
        const findone=await employe.findByIdAndUpdate(id,{
 status:"deleted"
})
        res.status(200).json(findone)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}


exports.updateemploye=async(req,res)=>{
    try {
        const data=req.body
       
        
        const {id}=req.params
        const updatedata=await employe.findByIdAndUpdate(id,data)
        //  console.log(updatedata);

        res.status(200).json(updatedata)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}



exports.toggleStatus = async (req, res) => {
  const { id } = req.params;

  const emp = await employe.findById(id);
  if (!emp) return res.status(404).json({ message: "Not found" });

  emp.status = emp.status === "active" ? "inactive" : "active";
  await emp.save();

  res.json(emp);
};

exports.trashdata=async(req,res)=>{
     const data = await employe.find({ status:"deleted" });
 res.json(data);
}

exports.restore=async(req,res)=>{
     await employe.findByIdAndUpdate(req.params.id,{
   status:"active"
 });
 res.json({message:"Restored"});
}