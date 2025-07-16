import express from 'express'
import { signin, signup, google, signout, store, getOrdersByCustomerId, allitems } from '../controllers/auth.firebase.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/signup", signup)//register
router.post("/signin", signin)//login
router.post("/google", google)
router.get('/signout', signout)

router.post("/store", verifyToken, store)
router.get("/user/:id", getOrdersByCustomerId)//for data fetch user id
router.get("/users/items", allitems)

export default router