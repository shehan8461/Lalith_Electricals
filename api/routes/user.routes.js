import express from 'express'
import { 
    test, 
    updateUser, 
    deleteUser, 
    updateItem, 
    deleteItem, 
    getItem, 
    getUserItems, 
    createItem, 
    getAllItems, 
    getItemById 
} from '../controllers/user.firebase.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Test route
router.get('/', test)

// User routes
router.post("/update", verifyToken, updateUser)
router.delete("/delete", verifyToken, deleteUser)

// User items routes
router.get("/items", verifyToken, getUserItems) // needs auth for req.user.id
router.post("/item/create", verifyToken, createItem) // needs auth for req.user.id
router.get("/item/:id", getItem) // public - no auth needed
router.post("/item/update/:id", updateItem) // public - no auth needed
router.delete("/item/delete/:id", deleteItem) // public - no auth needed

export default router