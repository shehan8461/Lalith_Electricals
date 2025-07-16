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

// User items routes (protected)
router.get("/items", verifyToken, getUserItems)
router.post("/item/create", verifyToken, createItem)
router.get("/item/:id", verifyToken, getItem)
router.post("/item/update/:id", verifyToken, updateItem)
router.delete("/item/delete/:id", verifyToken, deleteItem)

export default router