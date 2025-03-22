import React, { useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';


const CategoryProduct = () => {
    const [products,setProducts]=useState([]);
    const [category,setCategory]=useState('');
    const params=useParams();
    const navigate=useNavigate();
    const [cart,setCart]=useCart();

    const getProductByCat=async()=>{
        try{
            const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        }catch(err){
            console.log(err);

        }
    }

    useEffect(()=>{
        getProductByCat();
    },[]);

  return (
    <Layout>
        <div className='container'>
            <h3 className='text-center'>{category?.name}</h3>
            <p className='text-center'>({products?.length} products found)</p>
                  <div className='row container'>
                  <div className='d-flex flex-wrap'>
            {products?.map(p=>(
               <div className="card m-2" style={{width: '18rem'}} key={p._id}>
  <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
  <div className="card-body">
    <h5 className="card-title">{p.name}</h5>
    <p className="card-text">{p.description.substring(0,35)}...</p>
     <p className="card-text">₹ {p.price}</p>
    <button className='btn btn-primary ms-2' 
    onClick={()=>navigate(`/product/${p.slug}`)}>more details</button>
    <button className='btn btn-secondary ms-2'
    onClick={()=>{setCart([...cart,p]);
      localStorage.setItem('cart',JSON.stringify([...cart,p]));
      toast.success("Item added to cart");
    }} >Add to Cart</button>
  </div>
</div>

            ))}
            </div>
            </div>
        </div>
    </Layout>
  ) 
}

export default CategoryProduct
