import {React, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';

const ForgotPassword = () => {
    let [email,setEmail]=useState('');
    let [answer,setAnswer]=useState('');
    let [newPassword,setNewPassword]=useState('');
    const navigate = useNavigate();

    const handleSubmit =async (e)=>{
        e.preventDefault();
        try{
            const res=await axios.post
            (`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
                {email,answer,newPassword}
            );
            if(res && res.data.success){
                toast.success(res.data.message);
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
   <Layout title={'Forgot Password-Ravesso'}>
    <div className='form-container'>
        <h1>Reset Password</h1>
       <form onSubmit={handleSubmit}>
     
  <div className="mb-3">
    <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter your email' value={email} onChange={(e)=> setEmail(e.target.value)} required />
  </div>

  <div className="mb-3">
    <input type="text" className="form-control" id="exampleInputAnswer" placeholder='Enter your Teacher Name' value={answer} onChange={(e)=> setAnswer(e.target.value)}  required/>
  </div>
  <div className="mb-3">
    <input type="password" className="form-control" id="exampleInputNewPassword" placeholder='Enter your New Password' value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}  required/>
  </div>
 <div className='mb-3'>
 <button type="submit" className="btn btn-primary" >Set Password</button>
 </div>
 
</form>
    </div>
   </Layout>
  )
}

export default ForgotPassword;
