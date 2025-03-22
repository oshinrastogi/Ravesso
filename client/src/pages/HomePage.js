import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Checkbox,Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';

const HomePage = ()=>{
    const [products,setProducts]=useState();
    const [categories,setCategories]=useState();
    const [checked,setChecked]=useState([]);
    const [radio,setRadio]=useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
    const [cart,setCart] = useCart();


     //get all category
  const getAllCategory=async()=>{
    try{
      const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
      if(data?.success){
        setCategories(data?.category);
      }
    }
    catch(err){
      console.log(err);   }
  }

  useEffect(()=>{
    getAllCategory();
    getTotal();
  },[]);

    //get all products
    const getAllProducts=async()=>{
        try{
            setLoading(true);
            const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        }catch(err){
            setLoading(false);
            console.log(err);
            toast.error("something went wrong");

        }
    }

    //get tatal count
    const getTotal=async()=>{
        try{
            const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
            setTotal(data?.total);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        if(page===1)return;
        loadMore();
    },[page]);

    //load more
    const loadMore=async()=>{
        try{
            setLoading(true);
            const {data}=await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products,...data?.products]);
            handleFilter();
        }catch(err){
            console.log(err);
            setLoading(false);
        }
    }
 
 

    //filter by category
    const handleFilter=(value,id)=>{
        let all=[...checked];
        if(value){
            all.push(id)
        }else{
            all=all.filter((c)=> 
            c!==id
            )
        }
        setChecked(all);
    };

       //lifecycle method
       useEffect(()=>{
        if(!checked.length && !radio.length) getAllProducts();
       
     },[checked.length,radio.length]);
 
     useEffect(()=>{
         if(checked.length || radio.length) filterProduct();
      },[checked,radio]);

         //get filetred products
    const filterProduct=async()=>{
        try{
            const {data}=await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`,{checked,radio});
            setProducts(data?.products);
        }catch(err){
            console.log(err);
        }
    }


    return (
        <Layout title={'All Products - Best Offers'}>
            <div className='row mt-3'>
                <div className='col-md-3'>
                    <h4 className='text-center'>Filter By category</h4>
                    <div className='d-flex flex-column'>
                        {categories?.map((c)=>(
                            <Checkbox key={c._id} onChange={(e)=>handleFilter(e.target.checked,c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>

                    <h4 className='text-center'>Filter By Price</h4>
                    <div className='d-flex flex-column mt-4'>
                       <Radio.Group onChange={(e)=>setRadio(e.target.value)}>
                          {Prices.map((p)=>(
                            <div key={p._id}>
                            <Radio value={p.array}>{p.name}</Radio>
                            </div>
                          ))}
                       </Radio.Group>
                    </div>

                    <div className='d-flex flex-column mt-4'>
                      <button className='btn btn-danger' 
                      onClick={()=>window.location.reload()}>
                        Reset Filters
                      </button>
                    </div>


                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Products</h1>
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
            <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div>

                </div>
            </div>
        </Layout>
    );
};

export default HomePage;

