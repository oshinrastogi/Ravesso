import {React, useState,useEffect } from 'react'
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../context/auth';

const Profile = () => {
   let [name,setName]=useState('');
      let [email,setEmail]=useState('');
      let [password,setPassword]=useState('');
      let [phone,setPhone]=useState('');
      let [address,setAddress]=useState('');
      const navigate = useNavigate();
      const [auth,setAuth]=useAuth();

      const handleUpdate=async(e)=>{
        e.preventDefault();
        try{
          const {data}=await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`,{
            name,email,password,phone,address,
          });
          if(data?.error){
            toast.error(data?.error);
          }else{
            setAuth({...auth,user:data?.updatedUser});
            let ls=localStorage.getItem('auth');
            ls=JSON.parse(ls);
            ls.user=data.updatedUser;
            localStorage.setItem('auth',JSON.stringify(ls));
          }
          toast.success("profile updated successfully")
        }catch(err){
          console.log(err);
          toast.error("Something went wrong");

        }

      }

      useEffect(()=>{
        const {name,email,phone,address,answer}=auth?.user;
        setName(name);
        setEmail(email);
        setAddress(address);
        setPhone(phone);
      },[auth?.user])



  return (
    <Layout title={'Dashboard'}>
    <div className='container-fluid m-3 p-3'>
     <div className='row'>
       <div className='col-md-3' >
         <UserMenu/>
       </div>
       <div className='form-container col-md-9'>
        <h1>User Profile</h1>
       <form onSubmit={handleUpdate}>
       <div className="mb-3">
    <input type="text" className="form-control" id="exampleInputName" placeholder='Enter your Name' value={name} onChange={(e)=> setName(e.target.value)} required/>
  </div>
  <div className="mb-3">
    <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter your email' value={email} onChange={(e)=> setEmail(e.target.value)} required disabled />
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
 
  <button type="submit" className="btn btn-primary">Update</button>
</form>

    </div>
     </div>
    </div>
 </Layout>
  )
}

export default Profile
