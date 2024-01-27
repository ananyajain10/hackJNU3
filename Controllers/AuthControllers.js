import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import "dotenv/config.js";

export const registerUser = async(req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;

    const newUser = new UserModel(req.body);
    const {username, email, phone} = req.body;

    try{
       const oldUser = await UserModel.findOne({ "$or": [ { username: username }, { email: email }, {phone: phone}] });

        if(oldUser){
            return res.status(400).json({message:"user already exists"});
        }



        const user = await newUser.save();
        const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 

export const loginUser = async(req, res) => {
    const {username, password} = req.body;

    try{
        const user = await UserModel.findOne({username: username});

        if(user){
            const validity = await bcrypt.compare(password, user.password);

            if(!validity){
                return res.status(400).json({message:"invalid credentials"});
            }  else {
                const token = jwt.sign(
                  { username: user.username, id: user._id },
                  process.env.JWTKEY,
                  { expiresIn: "1h" }
                );
                res.status(200).json({ user, token });
              }
        } else {
            res.status(404).json("User not found");
          }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const inMemoryDB = {};
export const sendOtp = async (req, res) => {
    const { email } = req.body;
    const generatedOTP = Math.floor(100000 + Math.random() * 900000);
     inMemoryDB[email] ={
        email: email,
        otp : generatedOTP

     }
     console.log(inMemoryDB);
    try {

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ananyajain866@gmail.com',
                pass: `${process.env.pass}`
            }
        });
        let mailOptions = {

            to: email,
            subject: "OTP HERE, GET VERIFIED SOON!",
            text: "YOUR VERIFICATION OTP: " + generatedOTP

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error" + error)
            }
            else {
                console.log("email send to:" + mailOptions.to, info.response)
            }
        })


        res.status(200).json("otp send");

    } catch (error) {
        res.status(500).json(error);
    }
}

export const verifyOtp = async (req, res) => {
    const { email, enteredOtp} = req.body;

    try {

        

        if(inMemoryDB[email] && inMemoryDB[email].otp == enteredOtp){
            //delete inMemoryDB[email];
            console.log(enteredOtp);
            res.status(200).json({ success: true, message: 'OTP verified successfully' });
        } else {
            // console.log(enteredOtp);
            // console.log(inMemoryDB[email].otp );
           res.status(401).json({ error: 'Incorrect OTP' });
        }

       
    } catch (error) {
       res.status(500).json(error);
    }
}

export const updateUser = async (req, res) => {
  const id = req.params.id;
  // console.log("Data Received", req.body)
  const { _id, password } = req.body;
  
  if (id === _id) {
    try {
      // if we also have to update password then password will be bcrypted again
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      // have to change this
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWTKEY,
        { expiresIn: "1h" }
      );
      console.log({user, token})
      res.status(200).json({user, token});
    } catch (error) {
      console.log("Error agya hy")
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can update only your own Account.");
  }
};