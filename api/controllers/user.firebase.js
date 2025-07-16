import User from "../models/user.firebase.js"
import Item from "../models/item.firebase.js"
import { errorHandler } from "../utils/error.js"
import Admin from "../models/admin.firebase.js"
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
        message: 'API is working'
    })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can update only your account!'))
    }
    
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const updateData = {
            username: req.body.username || user.username,
            email: req.body.email || user.email,
            password: req.body.password || user.password,
            profilePicture: req.body.profilePicture || user.profilePicture,
        };

        const updatedUser = await user.update(updateData);
        const { password, ...rest } = updatedUser;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can delete only your account'));
    }
    
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        await user.delete();
        res.status(200).json('User has been deleted....');
    } catch (error) {
        next(error);
    }
}

export const test1 = (req, res) => {
    res.json({
        message: 'API is working'
    });
}

export const updateItem = async (req, res) => {
    try {
        const { id, ...rest } = req.body;
        
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).send({ success: false, message: "Item not found" });
        }

        const updatedItem = await item.update(rest);
        res.send({ success: true, message: "Updated successfully", data: updatedItem });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}

export const deleteItem = async (req, res, next) => {
    let itemId = req.params.id;
    console.log(itemId);
    
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        await item.delete();
        res.status(200).json('The item has been deleted');
    } catch (error) {
        next(error);
    }
}

export const getItem = async (req, res) => {
    const id = req.params.id;

    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).send({ success: false, message: "Item not found" });
        }

        res.send({ success: true, message: "Item fetched successfully", data: item });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};
