import express from 'express'
import { getAllItems, getItemById } from '../controllers/user.firebase.js';

const router = express.Router();

// Public routes (no authentication required)
router.get("/items", getAllItems)
router.get("/item/:id", getItemById)

export default router
