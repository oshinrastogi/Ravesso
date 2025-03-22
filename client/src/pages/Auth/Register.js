import {React, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';

const Register = () => {

    let [name,setName]=useState('');
    let [email,setEmail]=useState('');
    let [password,setPassword]=useState('');
    let [phone,setPhone]=useState('');
    let [address,setAddress]=useState('');
    let [answer,setAnswer]=useState('');
    const navigate = useNavigate();

    const handleSubmit =async (e)=>{
        e.preventDefault();
        try{
            const res=await axios.post
            (`${process.env.REACT_APP_API}/api/v1/auth/register`,
                {name,email,password,phone,address,answer}
            );
            if(res.data.success){
                toast.success(res.data.meassage);
                navigate('/login');
            }
            else{
                toast.error(res.data.message)
            }
        }catch(error){
            console.log(error)
            toast.error("Something went wrong");
        }
    }

  return (
   <Layout title={'Register-Ravesso'}>
    <div className='form-container'>
        <h1>Register Page</h1>
       <form onSubmit={handleSubmit}>
       <div className="mb-3">
    <input type="text" className="form-control" id="exampleInputName" placeholder='Enter your Name' value={name} onChange={(e)=> setName(e.target.value)} required/>
  </div>
  <div className="mb-3">
    <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter your email' value={email} onChange={(e)=> setEmail(e.target.value)} required />
  </div>

  <div className="mb-3">
    <input type="password" className="form-control" id="exampleInputPassword" placeholder='Enter your Password' value={password} onChange={(e)=> setPassword(e.target.value)}  required/>
  </div>
  <div className="mb-3">
    <input type="text" className="form-control" id="exampleInputPhone" placeholder='Enter your Phone' value={phone} onChange={(e)=> setPhone(e.target.value)}  required/>
  </div>
  <div className="mb-3">
    <input type="text" className="form-control" id="exampleInputAddress" placeholder='Enter your Address' value={address} onChange={(e)=> setAddress(e.target.value)} required />
  </div>
  <div className="mb-3">
    <input type="text" className="form-control" id="exampleInputAnswer" placeholder='Enter your Teacher name' value={answer} onChange={(e)=> setAnswer(e.target.value)} required />
  </div>
  <button type="submit" className="btn btn-primary">Register</button>
</form>

    </div>
   </Layout>
  )
}

export default Register;
