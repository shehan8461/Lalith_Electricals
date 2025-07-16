import User from "../models/user.firebase.js";
import Item from "../models/item.firebase.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

//register
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    
    try {
        // Check if user already exists
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
            return next(errorHandler(400, 'User with this email already exists'));
        }
        
        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername) {
            return next(errorHandler(400, 'Username already taken'));
        }

        const hashPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashPassword });
        
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
}

//login 
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        const validUser = await User.findByEmail(email);
        if (!validUser) return next(errorHandler(404, 'User not found'));
        
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));
        
        const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser;

        const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(rest);

    } catch (error) {
        next(error);
    }
}

//item register
export const store = async (req, res, next) => {
    const {
        Name, date, Description, Title,
        profilePicture,
        alternateProfilePicture,
        thirdProfilePicture,
        fourthProfilePicture,
        productVideo,
        featured,
        onSale
    } = req.body;

    // Get userId from authenticated user
    const userId = req.user.id;

    // Validate required fields
    if (!userId) {
        return next(errorHandler(400, 'User not authenticated'));
    }
    if (!Name) {
        return next(errorHandler(400, 'Name is required'));
    }
    if (!Title) {
        return next(errorHandler(400, 'Title is required'));
    }
    if (!Description) {
        return next(errorHandler(400, 'Description is required'));
    }

    //create auto id for orderid
    function idGen(userId) {
        const randomString = Math.random().toString(36).substring(2, 10);
        const id = 'ORD' + randomString + userId;
        return id;
    }
    const petId = idGen(userId);

    try {
        // Check if item with this petId already exists
        const existingItem = await Item.findByPetId(petId);
        if (existingItem) {
            return next(errorHandler(400, 'Item with this ID already exists'));
        }

        const newItem = new Item({
            petId, 
            userId, 
            Name, 
            date, 
            Description, 
            Title,
            profilePicture, 
            alternateProfilePicture, 
            thirdProfilePicture,
            fourthProfilePicture, 
            productVideo, 
            featured, 
            onSale
        });
        
        await newItem.save();
        res.status(202).json({ message: "Item created successfully" });
    } catch (error) {
        next(error);
    }
}

//get items by userid
export const getOrdersByCustomerId = async (req, res, next) => {
    try {
        const customerId = req.params.id;
        const orders = await Item.findByUserId(customerId);
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//all items
export const allitems = async (req, res, next) => {
    try {
        const orders = await Item.findAll();
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const google = async (req, res, next) => {
    try {
        const user = await User.findByEmail(req.body.email);

        if (user) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            const { password: hashedPassword, ...rest } = user;
            const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);

            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() +
                    Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo,
            });
            
            await newUser.save();
            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
            const { password: hashedPassword2, ...rest } = newUser;
            const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
}

export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json('Signout Success');
}
