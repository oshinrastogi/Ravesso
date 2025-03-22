import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from 'fs';
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import dotenv from 'dotenv';
dotenv.config();
import orderModel from "../models/orderModel.js";
import Razorpay from "razorpay";
const { validateWebhookSignature } = Razorpay;

//payment gateway
// var gateway = new braintree.BraintreeGateway({
//     environment: braintree.Environment.Sandbox,
//     merchantId: process.env.BRAINTREE_MERCHANT_ID,
//     publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//     privateKey: process.env.BRAINTREE_PRIVATE_KEY,

//   });

dotenv.config();

var razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
});

export const createProductController = async(req,res)=>{
    try{
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;

        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:"name is required"});
            case !description:
                return res.status(500).send({error:"description is required"});
            case !price:
                return res.status(500).send({error:"price is required"});
            case !category:
                return res.status(500).send({error:"category is required"});
            case !quantity:
                return res.status(500).send({error:"quantity is required"});
            case photo && photo.size>1000000:
                return res
                .status(500)
                .send({error:"photo with size less 1MB is required"})
        }
        const products= new productModel({...req.fields,slug:slugify(name)});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType= photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:"product created successfully",
            products,
    })
        
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"error in creating product"
        })
    }
};

export const getProductController = async(req,res)=>{
    try{
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1}) ;
        res.status(200).send({
            success:true,
            totalCount :products.length,
            message:"All Products",
            products,
        })

    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err:err.message,
            message:"error in getting product"
        })
    }
};


export const getSingleProductController=async(req,res)=>{
    try{
        const product = await productModel
        .findOne({slug:req.params.slug}).
        select('-photo')
        .populate('category');
        res.status(200).send({
            success:true,
            message:"successfully got single product",
            product,
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"error in getting single product"
        })
    }
}

export const productPhotoController=async(req,res)=>{
    try{
        const product = await productModel
        .findById(req.params.pid)
        .select('photo')
        if (product.photo.data){
            res.set('Content-type',product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"error in getting photo"
        })
    }

};

export const deleteProductController=async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success:true,
            message:"product deleted successfully"
        });

    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"error in getting photo"
        })
    }
}

export const updateProductController=async(req,res)=>{
    try{
        const {name,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
        console.log(req.params);


        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:"name is required"});
            case !description:
                return res.status(500).send({error:"description is required"});
            case !price:
                return res.status(500).send({error:"price is required"});
            case !category:
                return res.status(500).send({error:"category is required"});
            case !quantity:
                return res.status(500).send({error:"quantity is required"});
            case photo && photo.size>1000000:
                return res
                .status(500)
                .send({error:"photo with size less 1MB is required"})
        }
        const products= await productModel.findByIdAndUpdate(req.params.id,
            {...req.fields,slug:slugify(name)},{new:true}
        )
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType= photo.type;
        }
        console.log(products);
        await products.save();
        res.status(201).send({
            success:true,
            message:"product updated successfully",
            products,
    })
        
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            err,
            message:"error in updating product"
        })
    }
}


export const productFiltersController=async(req,res)=>{
    try{
        const {checked,radio}=req.body;
        let args={}
        if(checked.length>0)args.category=checked;
        if(radio.length)args.price={ $gte: radio[0], $lte:radio[1]};
        const products=await productModel.find(args);
        res.status(200).send({
            success:true,
            message:"Showing products as per Filters",
            products,
        })
    }catch(err){
        console.log(err);
        res.status(400).send({
            success:false,
            message:'Error while Filtering',
            err,
        })
    }
}

export const productCountcontroller=async(req,res)=>{
    try{
        const total=await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            total
        })
    }catch(err){
        console.log(err);
        res.status(400).send({
            messsage:"error in product count",
            err,
            success:false
        })

    }
}


export const productListController=async(req,res)=>{
    try{
        const perPage=6;
        const page=req.params.page? req.params.page : 1;
        const products=await productModel
        .find({})
        .select('-photo')
        .skip((page-1)*perPage)
        .limit(perPage)
        .sort({createdAt:-1});
        res.status(200).send({
            success:true,
            products,
        })
    }catch(error){
        console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
    }
}

//serach product
export const searchProductController=async(req,res)=>{
    try{
        const {keyword}=req.params;
        const result = await productModel.find({
            $or:[
                {name:{$regex: keyword, $options:'i'}},
                {description:{$regex:keyword, $options:'i'}}
            ]
        }).select('-photo')
        res.json(result)
        console.log(result)
    }catch(error){
        console.log(error);
    res.status(400).send({
      success: false,
      message: "error while searching",
      error,
    });
    }
}


export const relatedProductController=async(req,res)=>{
    try{
        const {pid,cid}=req.params;
        const products=await productModel.find({
            category:cid,
            _id:{$ne:pid},
        }).select('-photo').limit(3).populate('category');
        res.status(200).send({
            success:true,
            products,
        })
    }catch(error){
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while searching related product",
      error,
    });
    }
};


export const productCategoryController=async(req,res)=>{
    try{
        const category = await categoryModel.findOne({slug:req.params.slug});
        const products = await productModel.find({category}).populate('category');
        res.status(200).send({
            success:true,
            message:"products fetched successfully",
            category,
            products,
        });
    }catch(error){
        console.log(error);
        res.status(400).send({
          success: false,
          message: "error while getting category product",
          error,
        });
        };
};

//payment gateway api
//token
// export const braintreeTokenController=async(req,res)=>{
//     try{
//         gateway.clientToken.generate({},function(err,response){
//             if(err){
//                 res.status(500).send(err);
//             }else{
//                 res.send(response);
//             }
//         })

//     }catch(err){
//         console.log(err);
//     }
// }

//payment
// export const braintreePaymentController=async(req,res)=>{
//     try{
//         const {cart,nonce}=req.body;
//         let total=0
//         cart.map((i)=>{
//             total+=i.price;
//         })
//         let newTransaction = gateway.transaction.sale({
//             amount:total,
//             paymentMethodNonce: nonce,
//             options:{
//                 submitForSettlement:true,
//             },
//         },
//     function(err,result){
//         if(result){
//             const order=new orderModel({
//                 products:cart,
//                 payment:result,
//                 buyer:req.user._id,

//             }).save()
//             res.json({ok:true})
//         }else{
//             res.status(500).send(err)
//         }
//     }
// )
//     }catch(err){
//         console.log(err);
//     }

// }

// Create Razorpay Order
export const paymentController = async (req, res) => {
    try {
        console.log('Razorpay Key ID:',razorpay.key_id);
        console.log('Razorpay Key Secret:',razorpay.key_secret);
        const { amount } = req.body; // Amount in paise (e.g., ₹100 = 10000 paise)
        console.log(amount);

        const options = {
            amount: amount, // Amount in paise
            currency: 'INR',
            receipt: `order_rcpt_${Math.floor(Math.random() * 100000)}`, // Unique receipt ID
        };

        // Create order
        // console.log("ji");

        const order = await razorpay.orders.create(options);

            console.log(order.id);
        res.status(200).json({
            success: true,
            order,
            key_id:process.env.RAZORPAY_KEY_ID,
        });

    } catch (err) {
        // console.log("ji");
        console.error('Error creating Razorpay order:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to create Razorpay order',
        });
    }
};

// Verify Razorpay Payment
export const verifyController = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        // Create the expected signature
        const secret = razorpay.key_secret;
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        // const expectedSignature = crypto
        //     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        //     .update(body.toString())
        //     .digest('hex');
        // expectedSignature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);

        // Compare signatures

        const isValidSignature = validateWebhookSignature(body,razorpay_signature,secret);
        if(isValidSignature){
            // const orders =readData();
            const order = new orderModel({
                products: req.body.cart, // Assuming cart is sent in the request
                payment: {
                    razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature,
                },
                buyer: req.user._id, // Assuming user ID is available in req.user
            });
            await order.save();

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
            });

        }

        // if (expectedSignature === razorpay_signature) {
        //     // Payment verified successfully
        //     // Save order details to the database
        //     const order = new orderModel({
        //         products: req.body.cart, // Assuming cart is sent in the request
        //         payment: {
        //             razorpay_payment_id,
        //             razorpay_order_id,
        //             razorpay_signature,
        //         },
        //         buyer: req.user._id, // Assuming user ID is available in req.user
        //     });
        //     await order.save();

        //     res.status(200).json({
        //         success: true,
        //         message: 'Payment verified successfully',
        //     });
        // } 
        else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    } catch (err) {
        console.error('Error verifying Razorpay payment:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
        });
    }
};