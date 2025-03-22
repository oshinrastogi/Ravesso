import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async(req,res)=>{
    try{
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                message:"name is required"
            })
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"category already exist"
            })
        }
        const category = await new categoryModel({
            name,slug:slugify(name)
        }).save();
        res.status(201).send({
            success:true,
            message:"new category created",
            category,
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"error in category"
        })
    }
};


export const updateCategoryController =  async(req,res)=>{
    try{
        const {name} = req.body;
        const {id} = req.params;
        const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"Category Updated",
            category
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"Error while updating category"
        })
    }
};


export const categoryController=async(req,res)=>{
    try{
        const category=await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"All categories List",
            category,
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"Error while fetching all categories"
        })
    }
};


export const singleCategoryController = async(req,res)=>{
    try{
        const {slug} = req.params;
        const category=await categoryModel.findOne({slug});
        res.status(200).send({
            success:true,
            message:"Single Category got Successfully",
            category,
        })
        
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"Error while getting single categories"
        })
    }
};

export const deleteCategoryController=async(req,res)=>{
    try{
        const {id} = req.params;
        const category=await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Category deleted Successfully",
        })
        
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"Error while deleting single categories"
        })
    }
};

