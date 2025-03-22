import express from 'express';
import {registerController , loginController,testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController } from '../controllers/authController.js'; 
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
//route object
const router = express.Router()

//routing
//register || method post
router.post('/register',registerController);

//login
router.post('/login',loginController);

//forgot password
router.post('/forgot-password',forgotPasswordController)

//test
router.get('/test',requireSignIn ,isAdmin, testController)


//protected user route
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

//protected admin route
router.get('/admin-auth',requireSignIn,isAdmin, (req,res)=>{
    res.status(200).send({ok:true});
});

//update profile
router.put('/profile',requireSignIn,updateProfileController)


//orders
router.get('/orders',requireSignIn,getOrdersController)

//all-orders
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController)

export default router;



