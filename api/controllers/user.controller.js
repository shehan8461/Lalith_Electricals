import User from "../models/user.model.js"
import Item from "../models/item.model.js"
import { errorHandler } from "../utils/error.js"
import Admin from "../models/admin.model.js"
import bcryptjs from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const test=(req,res)=>{
    res.json({
        message:'API is working'
    })
}

export const updateUser=async (req,res,next)=>{
    if(req.user.id!==req.params.id){
        return next(errorHandler(401,'you can update only your account!'))

    }
    try{
        if(req.body.password){
            req.body.password=bcryptjs.hashSync(req.body.password,10)
        }

        const updateUser=await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    pasword:req.body.password,
                    profilePicture:req.body.profilePicture,
                },
            },
            {new:true}
        );
        const {password, ...rest}=updateUser._doc;
        res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}

export const deleteUser=async(req,res,next)=>{
    if(req.user.id !==req.params.id){
        return next(errorHandler(401,'you can delete only ypur account'));

    }try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user has been deleted....')
    }catch(error){
        next(error)

    }
}





//





export const test1 = (req, res) => {
    res.json({
        message: 'API is working'
    });
}


export const updateItem =async(req,res)=>{
    const {id,...rest}=req.body
    const data=await Item.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
}

export const deleteItem = async (req, res, next) => {
    let petId = req.params.id;
    try {
        const item = await Item.findById(petId);
        if (!item) return res.status(404).json({ message: 'Order not found' });
        // List all file fields you want to delete
        const fileFields = [
            'profilePicture',
            'alternateProfilePicture',
            'thirdProfilePicture',
            'fourthProfilePicture',
            'productVideo'
        ];
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        fileFields.forEach(field => {
            const fileUrl = item[field];
            if (fileUrl && (fileUrl.includes('/Images/') || fileUrl.includes('/Videos/'))) {
                // Remove host if present
                let relPath = fileUrl.replace(/^https?:\/\/[\w\.:\-]+/, '');
                // Remove leading slash if present
                if (relPath.startsWith('/')) relPath = relPath.slice(1);
                const filePath = path.join(__dirname, '../../', relPath);
                fs.unlink(filePath, err => {
                    if (err) console.error(`Failed to delete file: ${filePath}`, err);
                });
            }
        });
        await Item.findByIdAndDelete(petId);
        res.status(200).json('The Order and files have been deleted');
    } catch (error) {
        next(error);
    }
}




export const getItem= async (req, res) => {
    const id = req.params.id;

    try {
        const discount = await Item.findById(id);

        if (!discount) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        res.send({ success: true, message: "User fetched successfully", data: discount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};






