const {Skill,Course} = require("../Model/skillModel")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodemailer = require("nodemailer");

exports.addcoures=async(req,res)=>{
     try {
            const {name,duration,price,mode,description,instructor}=req.body
            console.log(req.body);
            
            if(!(name&&duration&&price&&mode&&description&&instructor)){
                return res.status(400).json({message:"all fild are required"})
            }
            const findname=await Course.findOne({name})
           if (findname) {
                return res.status(400).json({ massage: "name are allready axist" })
           }
           const data={name,duration,price,mode,description,instructor,skills:[]};
           const server=new Course(data)
           await server.save()
           res.status(200).json({message:"add coures successfully"},server)
        } catch (error) {
            res.status(400).json({error:error.message})
        }
}


exports.allcoures=async(req,res)=>{
    try {
        const alldata=await Course.find()
        res.status(200).json(alldata)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}


exports.onecoures=async(req,res)=>{
    try {
        const {id}=req.params
        const findone=await Course.findById(id)
        res.status(200).json(findone)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

exports.deletecoures=async(req,res)=>{
    try {
        const {id}=req.params
        console.log(id);
        
        const findone=await Course.findByIdAndUpdate(id,{
 status:"deleted"
})
        res.status(200).json(findone)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

exports.updatecoures=async(req,res)=>{
    try {
        const data=req.body
       
        
        const {id}=req.params
        const updatedata=await Course.findByIdAndUpdate(id,data)
         console.log(updatedata);

        res.status(200).json(updatedata)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

exports.restore=async(req,res)=>{
    try {
         await Course.findByIdAndUpdate(req.params.id, {
    status: "active"
  });

  res.send({ message: "Restored successfully" });
        
    } catch (error) {
        
    }
}