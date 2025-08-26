import express from 'express';
import { body, validationResult } from 'express-validator';
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { ProtectRoute } from '../middleware/auth.middleware.js'; // ProtectRoute is a middleware that checks if the user is authenticated
const router = express.Router();

//signup
router.post("/signup",
    [
        body('password', 'Password must be of minimum 6 characters').isLength({ min: 6 }),
        body('email', 'Enter a valid email').isEmail()
    ],
    signup);


//login
router.post("/login",
    [body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be of minimum 6 characters').isLength({ min: 6 })
    ],
    login);

//logout
router.post("/logout", logout);

router.put("/update-profile", ProtectRoute, updateProfile);//PRotectRoute is a middleware that checks if the user is authenticated..we will check if the request have token or not

router.get("/check", ProtectRoute, checkAuth); //basically,checkauth will be used whenever the user refreshes the page..we will check if it is authenticated or not
//based on that we will decide whether to show the login page or the home page

export default router;