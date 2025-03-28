import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from 'jsonwebtoken';

export const registerController = async(req,res)=>{
    try{
        const {name,email,password,phone,address,answer}=req.body;
        //validation
        if(!name){
            return res.send({message:"name is required"});
        }
        if(!email){
            return res.send({message:"email is required"});
        }
        if(!password){
            return res.send({message:"password is required"});
        }
        if(!phone){
            return res.send({message:"phone no is required"});
        }
        if(!address){
            return res.send({message:"address is required"});
        }
        if(!answer){
            return res.send({message:"answer is required"});
        }

        //check user
        const existinguser = await userModel.findOne({email});
        //existing user
        if(existinguser){
            return res.status(200).send({
                success:false,
                message:"already resgistered user"
            })
        }

        //register user
        const hashedPassword=await hashPassword(password);
        //save
        const user = await new userModel({name,email,phone,password:hashedPassword,address,answer}).save()

        res.status(201).send({
            success:true,
            message:"user registered successfully",
            user,
        });
    }
    catch(error){
        console.log(error);
        res.send(500).send({
            success:false,
            message:"error in registration",
            error,
        });
    }
};

export const loginController = async(req,res)=>{
    try{
        const {email,password}=req.body;
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'invalid email or password'
            })
        }

        //check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"email is not registered"
            })
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"invalid password"
            })
        }
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d",}
        );
        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token,
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in login",
            error
        })
    }
};

//forgotPasswordController
export const forgotPasswordController=async (req,res)=>{
    try{
        const {email,answer,newPassword}=req.body;
        if(!email){
            res.status(400).send({
                message:"Email is required"
            })
        }
        if(!answer){
            res.status(400).send({
                message:"answer is required"
            })
        }
        if(!newPassword){
            res.status(400).send({
                message:"New Password is required"
            })
        }
        //check
        const user=await userModel.findOne({email,answer});
        console.log(user)
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'wrong Email or answer'
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:'Password Reset Successfully'
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Something went wrong',
            err
        })
    }
}

//test 
export const testController = (req,res)=>{
    res.send("protected route");
}

//update profile
export const updateProfileController=async(req,res)=>{
    try{
        const{name,email,password,phone,address}=req.body;
        const {user}=await userModel.findById(req.user._id);
        //password
        if(password && password.length<4){
            return res.json({error: 'password is required and more than 3 characters'});
        }
        const hashedPassword=password ? await hashPassword(password) : undefined
        const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password:hashedPassword || user.password,
            phone: phone || user.phone,
            address:address|| user.address,
        },{new:true});

        res.status(200).send({
            success:true,
            message:"profile updated successfully",
            updatedUser,
        })

    } catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Something went wrong while updating profile',
            err
        })
    }
}


//orders
export const getOrdersController=async(req,res)=>{
    try{
        const orders=await orderModel.find({buyer:req.user._id})
        .populate("products","-photo")
        .populate("buyer","name");
        res.json(orders);
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:'Something went wrong while getting orders',
            err
        })
    }
}

//all-orders
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        ;
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };


//order status
export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };