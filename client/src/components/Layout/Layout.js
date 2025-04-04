import React from 'react';
import Footer from './Footer';
import Header from './Header';
import {Helmet} from "react-helmet";
import {Toaster} from 'react-hot-toast';

const Layout = ({children,title="Default Title",description='Mern Stack Project',keywords='mern,react,ndoe,mongo,ecommerce',author='Ravesso'})=>{
    return (
        <div>
           <Helmet>
                <meta charSet="utf-8" />
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                
            </Helmet>
           <Header/>
           <main style={{minHeight:'70vh'}}>
            <Toaster/>
             {children}</main>
            <Footer/>
        </div>
    )
};

export default Layout;