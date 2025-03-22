import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import formidable from "express-formidable";
import bodyParser from 'body-parser';
import path from 'path';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { fileURLToPath } from "url";

dotenv.config();

//dbconfig
connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// const {validateWebhookSignature} = require('razorpay/dist/utilsw/razorpay-utils');
// const methodOverride = require("method-override");
// const Razorpay = require('razorpay');
// const bodyParser = require('body-parser');
// const path = require('path');
// const fs = require('fs');

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// app.use(formidable());

//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)
app.use(express.static(path.join(__dirname,"public")));

// const razorpay = new Razorpay({
//     key_id:rzp_test_FxMyQljozOxk8u,
//     key_secret:JFZb7CdVNBH5RGOexBfv8PYe,
// });

//rest api
app.get('/',(req,res)=>{
    res.send({
        message:'Welcome to ecommerce app'
    })
})

const port =process.env.port || 8080;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});


// installing morgan colors mongoose dotenv