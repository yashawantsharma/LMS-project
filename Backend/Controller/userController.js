const user = require("../Model/userModel")
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')
const secretkey = process.env.JWT_SECRET


let otpgenerato = (digit = 4) => {
    let num = '0123456789'
    let otp = ''
    for (let i = 1; i <= digit; i++) {
        otp += num[Math.floor(Math.random() * 10)]
    }
    return otp;
}


function generatePassword(length = 6) {
    const chars = "0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
}

exports.adduser = async (req, res) => {
    try {
        const { name, email, phone, gender, role } = req.body
        // console.log(">>>>>>>>", email);

        if (!(name && email && phone && gender && role)) {
            return res.status(400).json({ massage: "all input are required" });
        }
        const userdata = await user.findOne({ email })
        console.log(">>>>>>>>>>>findOne", userdata);

        if (userdata) {
            return res.status(400).json({ massage: "email are allready axist" });
        }
        const password = generatePassword()
        console.log(password);

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt);
        const data = { name, email, phone, password: hash, gender, role }
        console.log(data)
        const server = new user(data)
        await server.save()
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
        return res.status(201).json(server, info.massage);
    } catch (error) {
        return res.status(400).json({ error: error.massage })
    }
}





exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json("all input are required");
        }

        const finduser = await user.findOne({ email });
        if (!finduser) {
            return res.status(400).json({ message: "please signup first" });
        }

        const isMatch = await bcrypt.compare(password, finduser.password);

        if (isMatch) {
            const token = jwt.sign(
                { id: finduser._id, role: finduser.role },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                message: "Login successfully",
                token: token,
                user: {
                    id: finduser._id,
                    name: finduser.name,
                    email: finduser.email,
                    role: finduser.role 
                }
            });
        } else {
            return res.status(400).json({ message: "invalid email or password" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



exports.findone = async (req, res) => {
    try {
        const { id } = req.params
        const oneuser = await user.findById(id)
        return res.status(200).json(oneuser)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


exports.passforget = async (req, res) => {
    try {
        const { email, newpassword, confrompassword, otp } = req.body
        if (!(email && newpassword && confrompassword && otp)) {
            return res.status(400).json("all input are required")
        }
        if (newpassword !== confrompassword) {
            return res.status(400).json({ message: "consfrompassword not match" })
        }
        const forgetdata = await user.findOne({ email })
        if (!forgetdata) {
            return res.status(400).json({ message: "please signup first" })
        }
        if (forgetdata.resetOtp !== otp) {
            return res.status(400).json({ massage: "Invalid OTP" });
        }
        if (forgetdata.otpExpire < Date.now()) {
            return res.status(400).json({ massage: "expired OTP" });
        }
        if (email !== forgetdata.email) {
            return res.status(400).json({ message: "invelide email" })
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = await bcrypt.hashSync(newpassword, salt)
        forgetdata.password = hash;
        forgetdata.resetOtp = undefined;
        forgetdata.otpExpire = undefined;
        await forgetdata.save();
        return res.status(200).json("successfully")
    } catch (error) {
        return res.status(400).json({ error: error.massage })
    }
}




exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ massage: "Email required" });
        }
        const findemail = await user.findOne({ email })
        if (!findemail) {
            return res.status(400).json({ massage: "Please signup first" });
        }

        const otp = otpgenerato()
        findemail.resetOtp = otp;
        findemail.otpExpire = Date.now() + 5 * 60 * 1000;
        await findemail.save();
        console.log("OTP:", otp);
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
            subject: "forget OTP",
            text: `Hello your OTP this ${otp}`,
        });
        console.log("Message sent:", info.messageId);
        return res.status(200).json({ massage: "OTP send successfully" }, info.messageId)
    } catch (error) {
        return res.status(400).json({ error: error.massage })
    }
}



exports.passreset = async (req, res) => {
    try {
        const { email, oldpassword, newpassword, confrompassword } = req.body
        if (!(email && oldpassword && newpassword && confrompassword)) {
            return res.status(400).json({ message: "all input aer required" });
        }
        const resetdata = await user.findOne({ email })
        if (!resetdata) {
            return res.status(400).json({ message: "invalid email " })
        }
        const dbpasword = resetdata.password
        const isMatch = await bcrypt.compare(oldpassword, dbpasword)
        if (!isMatch) {
            return res.status(400).json({ message: "oldpassword is no match" })
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






exports.updatetheme = async (req, res) => {
    try {
        const { theme } = req.body;

        if (!["light", "dark"].includes(theme)) {
            return res.status(400).json({ message: "Invalid theme value" });
        }

        const themedata = await user.findByIdAndUpdate(req.user._id, { theme });


        return res.status(200).json({
            message: "Theme updated successfully",
            theme: themedata.theme,
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};



exports.theme = async (req, res) => {
    try {
        const userData = await user.findById(req.user._id).select("theme");

        return res.status(200).json({
            success: true,
            theme: userData.theme,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
