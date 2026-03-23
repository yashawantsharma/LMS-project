const {Skill,Course} = require("../Model/skillModel")
console.log(Skill);
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodemailer = require("nodemailer");



exports.addskill=async(req,res)=>{
    try {
        const {name,duration,price,mode}=req.body
        console.log(req.body);
        
        if(!(name&&duration&&price&&mode)){
            return res.status(400).json({message:"all fild are required"})
        }
        const findname=await Skill.findOne({name})
       if (findname) {
            return res.status(400).json({ massage: "skill are allready axist" })
       }
       const data={name,duration,price,mode};
       const server=new Skill(data)
       await server.save()
       res.status(200).json({message:"add skill successfully"},server)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}


exports.oneskill=async(req,res)=>{
    try {
        const {id}=req.params
        const onedata=await Skill.findById(id)
        return res.status(200).json(onedata)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

exports.allskill=async(req,res)=>{
    try {
        const alldata=await Skill.find()
        return res.status(200).json(alldata)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}


exports.deleteskill=async(req,res)=>{
    try {
        const {id}=req.params
        console.log(id);
        
        const skilldelete=await Skill.findByIdAndUpdate(id,{
 status:"deleted"
})
        return res.status(200).json(skilldelete)
    } catch (error) {
          res.status(400).json({error:error.message})
    }
}


exports.updateskill=async(req,res)=>{
    try {
        const data=req.body
         const { id } = req.params
         const updatedata = await Skill.findByIdAndUpdate(id, data)
        
        return res.status(200).json(updatedata)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}