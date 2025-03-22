import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const [product,setProduct]=useState({});
    const params=useParams();
    const [similarProduct,setSimilarProduct]=useState([]);
    const [cart,setCart]=useCart();

    const navigate=useNavigate();
    const getProduct=async()=>{
        try{
            const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id,data?.product.category?._id);
        }catch(err){
                console.log(err);
        }
    }

    useEffect(()=>{
        console.log(product);
        console.log(params.slug);
        if(params.slug) getProduct();
    },[params?.slug]);

    const getSimilarProduct=async(pid , cid)=>{
        try{
            const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setSimilarProduct(data?.products);
        }catch(err){
            console.log(err);
        }
    }

  return (
    <Layout title= "Detail">
        <div className='row container mt-4'>
            <div className='col-md-6 '>
            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`} 
            className="card-img-top" 
            alt={product.name} 
            height={'300px'}/>
            </div>
            <div className='col-md-6'>
                <h3 className='text-center'>Product Details</h3>
                <h5>Name: {product?.name}</h5>
                <h5>Description: {product?.description}</h5>
                <h5>price: ₹{product?.price}</h5>
                <h5>Category: {product?.category?.name}</h5>
                
                <button className='btn btn-secondary '
    onClick={()=>{setCart([...cart,product]);
      localStorage.setItem('cart',JSON.stringify([...cart,product]));
      toast.success("Item added to cart");
    }} >Add to Cart</button>

            </div>
            <div className="row container">
        <h5 className='mt-3'>Similar Products</h5 >
        {similarProduct.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {similarProduct?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }}>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p?._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text"> $ {p.price}</p>
                <button className='btn btn-primary ms-2' 
    onClick={()=>navigate(`/product/${p.slug}`)}>more details</button>
                <button className='btn btn-secondary '
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

export default ProductDetail
