import React, { useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
// import DropIn from "braintree-web-drop-in-react";
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Razorpay from 'razorpay';

const CartPage = () => {
    const [cart,setCart]=useCart();
    const [auth,setAuth]=useAuth();
    const [clientToken,setClientToken]=useState("");
    const [instance,setInstance]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    const totalPrice=()=>{
        try{
            let total=0;
            cart?.map((item)=>
            (
                total = total + item.price
            ));
            return total;
            // return total.toLocaleString('en-US',{
            //     style:'currency',
            //     currency:'INR'
            // });

        }catch(err){
            console.log(err);

        }
    }

    const removeCartItem = (pid)=>{
        try{
            let myCart=[...cart];
            let index=myCart.findIndex((item)=>item._id===pid);
            myCart.splice(index,1);
            setCart(myCart);
            localStorage.setItem('cart',JSON.stringify(myCart));
        }catch(err){
            console.log(err);
        }
    }

    //token
    // const getToken=async()=>{
    //     try{
    //         const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
    //         setClientToken(data?.clientToken)
    //     }catch(err){
    //         console.log(err);
    //     }
    // }

    // useEffect(()=>{
    //     getToken();
    // },[auth?.token]);

    // const handlePayment=async()=>{
    //     try{
    //         setLoading(true);
    //         const {nonce}=await instance.requestPaymentMethod();
    //         console.log('Nonce:', nonce);
    //         const {data}=await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,{
    //             nonce,cart,
    //         });
    //         setLoading(false);
    //         localStorage.removeItem("cart");
    //         setCart([]);
    //         navigate("/dashboard/user/orders");
    //         toast.success("Payment Completed Successfully");

    //     }catch(err){
    //        console.log(err);
    //        setLoading(false);
    //     }
    // }
    const initiateRazorpayPayment = async () => {
        try {
            setLoading(true);

            // Create an order on the backend
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/payment/create-order`, {
                amount: totalPrice() * 100, // Amount in paise
                cart,
            });
            console.log(data.order.id);
            console.log(data.key_id);
            const options = {
                key: data.key_id, // Your Razorpay Key ID
                amount: data.order.amount, // Amount in paise
                currency: 'INR',
                name: 'Your E-Commerce Store',
                description: 'Payment for your order',
                order_id: data.order.id, // Order ID generated on the backend
                handler: async function (response) {
                    // Verify payment on the backend
                    const { data: verificationData } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/payment/verify-order`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        cart,
                    });

                    if (verificationData.success) {
                        toast.success('Payment Successful!');
                        localStorage.removeItem('cart');
                        setCart([]);
                        navigate('/dashboard/user/orders');
                    } else {
                        toast.error('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: auth?.user?.name,
                    email: auth?.user?.email,
                    contact: auth?.user?.phone || '9999999999',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
            
        } catch (err) {
            console.log(err);
            toast.error('Payment Failed');
        } finally {
            setLoading(false);
        }
    };
   


  return (
    <Layout>
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>

                <h1 className='text-center p-2 mb-1'>
                    {`Hello ${auth?.token && auth?.user?.name}`}
                </h1>

                <h4 className='text-center'>
                    {cart?.length >= 1 ? `You have ${cart.length} item(s) in your cart ${auth?.token ? " " : "Please login to checkout"}` : 
                    "Your Cart is Empty"}
                </h4>
            </div>
        </div>

        <div className='row'>
            <div className='col-md-8'>
                    {
                        cart?.map(p=>(
                            <div className='row mb-2 p-3 card flex-row'>
                                <div className='col-md-4'>
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} 
                                className="card-img-top" alt={p.name} 
                                height={'100px'} width='100px'/>
  
                                </div>
                                <div className='col-md-8'>
                                    <p>{p.name}</p>
                                    <p>{p.description.substring(30)}...</p>
                                    <p>Price: ₹{p.price}</p>
                                    <button className='btn btn-danger' onClick={()=>removeCartItem(p._id)}>Remove</button>
                                </div>
                            </div>
                        ))
                    }
            </div>
            <div className='col-md-4 text-center'>
                <h2>Cart Summary</h2>
                <p>Total | Checkout | Payment</p>
                <hr/>
                <h4>Total : {totalPrice()}</h4>
                {auth?.user && auth?.user?.address ? (
                    <>
                        <div className='mb-3'>
                            <h4>Current Address</h4>
                            <h5>{auth?.user?.address}</h5>
                            <button className='btn btn-outline-warning' 
                            onClick={()=>{
                                navigate('/dashboard/user/profile')
                            }}>Update Address</button>
                        </div>
                    </>
                ):(
                    <div className='mb-3'>
                        {
                            auth?.token?(
                                    <button className='btn btn-outline-warning'
                                    onClick={()=>navigate('/dashboard/user/profile')}>Update Address</button>

                            ):(
                                <button className='btn btn-warning'
                                    onClick={()=>navigate('/login',{
                                        state:'/cart',
                                    })}>Please Login to checkout</button>
                            )
                        }
                    </div>
                )}

                {/* <div className='mt-2'>

                    {!clientToken || !cart?.length?
                    (""):(
                        <>
                             <DropIn
                    options={{
                        authorization:clientToken,
                        paypal:{
                            flow:"vault",
                        },
                    }}
                    onInstance={(instance)=>setInstance(instance)}
                    /> */}

                    {/* <button className='btn btn-primary' 
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}

                     > {loading ? "Processing ...." : "Make Payment"}
                     </button> */}
                        {/* </>

                    )}

                </div> */}

                    <button
                                    className="btn btn-primary"
                                    onClick={initiateRazorpayPayment}
                                    disabled={loading || !auth?.user?.address}
                                >
                                    {loading ? 'Processing...' : 'Make Payment'}
                                </button>

            </div>
        </div>

        </div>
    </Layout>
  )
}

export default CartPage
