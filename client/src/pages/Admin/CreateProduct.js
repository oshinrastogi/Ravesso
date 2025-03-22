import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios';
import toast from 'react-hot-toast';
import {Select} from 'antd';
import {  useNavigate } from 'react-router-dom';
const {Option} =Select;

const CreateProduct = () => {
  
  const [categories,setCategories]=useState([]);
  const [category,setCategory]=useState([]);
  const [name,setName]=useState('');
  const [description,setDescription]=useState('');
  const [price,setPrice]=useState('');
  const [photo,setPhoto]=useState('');
  const [quantity,setQuantity]=useState('');
  const [shipping,setShipping]=useState('');
  const navigate=useNavigate();
  const handleCreate=async(e)=>{
    e.preventDefault();
    try{
      const productData = new FormData();
      productData.append('name',name);
      productData.append('description',description);
      productData.append('photo',photo);
      productData.append('price',price);
      productData.append('category',category);
      productData.append('shipping',shipping);
      productData.append('quantity',quantity);
      const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/create-product`,productData);
      if(data?.success){
        toast.success("Product created successfully");
        navigate('/dashboard/admin/products');
      }
      else{
        toast.error(data?.message);
      }

    }catch(err){
      console.log(err);
      toast.error(`something went wrong while creating ${name}`);
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

  return (
    <Layout title={'Dashboard-Create Product'}>
         <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3' >
            <AdminMenu/>
          </div>
          <div className='col-md-9'>
          <h1>Create product</h1>
          <div className='m-1'>
            <Select 
              bordered={false}
             placeholder='Select a category'
              size='large'
               showSearch 
            className='form-select mb-3' 
            onChange={(value)=>{setCategory(value)}}>
              {categories?.map(c=>(
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
                {photo && (
                  <div className='text-center'>
                    <img src={URL.createObjectURL(photo)} 
                    alt='Showing image' height={'200 px'} className='img img-responsive m-3'/>
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
            onChange={(value)=>{setShipping(value)}}>
                <Option value='1'> Yes </Option>
                <Option value='0'> No </Option>
            </Select>
              </div>

                <button onClick={handleCreate} className='btn btn-primary'>
                  Create

                </button>

            </div>
          </div>
          </div>
        </div>
       </div>
    </Layout>
  )
}

export default CreateProduct
