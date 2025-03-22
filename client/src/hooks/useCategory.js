import { useState,useEffect } from "react";
import axios from "axios";

export default function useCategory(){
    const [categories,setCategories]=useState();

    //getcat
    const getCategory=async()=>{
        try{
            const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            setCategories(data?.category);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getCategory();
    },[]);

    return categories;
}
