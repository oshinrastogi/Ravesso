import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios';
import toast from 'react-hot-toast';
import {Select} from 'antd';
import {  useNavigate,useParams } from 'react-router-dom';
const {Option} =Select;

const UpdateProduct = () => {
    const [categories,setCategories]=useState([]);
    const [category,setCategory]=useState([]);
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const [price,setPrice]=useState('');
    const [photo,setPhoto]=useState('');
    const [quantity,setQuantity]=useState('');
    const [shipping,setShipping]=useState('');
    const [id,setId]=useState('');
    const navigate=useNavigate();
    const params=useParams();

    const handleUpdate=async(e)=>{
      e.preventDefault();
      try{
        const productData = new FormData();
        productData.append('name',name);
        productData.append('description',description);
        photo && productData.append('photo',photo);
        productData.append('price',price);
        productData.append('category',category);
        productData.append('shipping',shipping);
        productData.append('quantity',quantity);
        const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,productData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if(data?.success){
          toast.success("Product Updated successfully");
          navigate('/dashboard/admin/products');
        }
        else{
          toast.error(data?.message);
        }
  
      }catch(err){
        console.log(err);
        toast.error(`something went wrong while updating ${name}`);
      }
  
    }

    //get single product

    const getSingleProduct=async()=>{
        try{
            const {data}= await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setName(data?.product?.name);
            setDescription(data?.product?.description);
            setPrice(data?.product?.price);
            setQuantity(data?.product.quantity);
            setShipping(data?.product?.shipping);
            setCategory(data.product.category._id);
            setId(data?.product._id);

        }catch(err){
            console.log(err);
            toast.error("something went wrong");
        }

    }
     //get all category
     const getAllCategory=async()=>{
      try{
        const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
        if(data?.success){
          setCategories(data?.category);
        }
      }
      catch(err){
        console.log(err);
        toast.error("something went wrong in getting categories");    }
    }
  
    useEffect(()=>{
      getAllCategory();
    },[]);

    useEffect(()=>{
        getSingleProduct();
        //eslint-disable-next-line
    },[]);

     //delete a product
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are You Sure want to delete this product ? ");
      if (!answer) return;
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`
      );
      console.log(id);
      toast.success("Product DEleted Succfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  
  return (
    <Layout title={'Dashboard-update Product'}>
    <div className='container-fluid m-3 p-3'>
   <div className='row'>
     <div className='col-md-3' >
       <AdminMenu/>
     </div>
     <div className='col-md-9' >
     <h1>update product</h1>
     <div className='m-1 w-75'>
       <Select 
         bordered={false}
        placeholder='Select a category'
         size='large'
          showSearch 
       className='form-select mb-3' 
       onChange={(value)=>{setCategory(value)}}
        value={category}>
         {categories?.map((c)=>(
           <Option key={c._id} value={c._id}>
             {c.name}
           </Option>
         ))}
       </Select>
       <div className='mb-3'>
         <label className='btn btn-outline-secondary col-md-12'>
           {photo ? photo.name : 'Upload Photo'}
           <input 
           type='file'
           name='photo'
           accept='image/*'
           onChange={(e)=>setPhoto(e.target.files[0])}
           hidden
           />
         </label>

         <div className='mb-3'>
           {photo ? (
             <div className='text-center'>
               <img src={URL.createObjectURL(photo)} 
               alt='Loading image' height={'200 px'}
               className='img img-responsive m-3'/>
             </div>
           ): (
            <div className='text-center'>
            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`} 
            alt='Loading image' height={'200 px'}
            className='img img-responsive m-3'/>
          </div>
           )}
         </div>

         <div className='mb-3'>
           <input 
           type='text'
           value={name}
           placeholder='write a name'
           className='form-control'
           onChange={(e)=>setName(e.target.value)}
           />
         </div>

         <div className='mb-3'>
           <input 
           type='text'
           value={price}
           placeholder='write the Price'
           className='form-control'
           onChange={(e)=>setPrice(e.target.value)}
           />
         </div>

         <div className='mb-3'>
           <textarea
           value={description}
           placeholder='write the Description'
           className='form-control'
           onChange={(e)=>setDescription(e.target.value)}
           />
         </div>

         <div className='mb-3'>
           <input 
           type='number'
           value={quantity}
           placeholder='write the Quantity'
           className='form-control'
           onChange={(e)=>setQuantity(e.target.value)}
           />
         </div>

         <div className='mb-3'>
         <Select 
         bordered={false}
        placeholder='Shpping Status'
         size='large'
          showSearch 
       className='form-select mb-3' 
       onChange={(value)=>{setShipping(value)}}
       value={shipping? "yes" : "no"} >
           <Option value='1'> Yes </Option>
           <Option value='0'> No </Option>
       </Select>
         </div>

         <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>

       </div>
     </div>
     </div>
   </div>
  </div>
</Layout>
  )
}

export default UpdateProduct
