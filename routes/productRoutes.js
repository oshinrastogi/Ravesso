import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createProductController, deleteProductController, getProductController, 
    getSingleProductController, productCategoryController, productCountcontroller,
     productFiltersController, productListController, productPhotoController, 
     relatedProductController, searchProductController, updateProductController, 
     paymentController , verifyController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

// routes
//create-product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);

//update-product
router.put('/update-product/:id',requireSignIn,isAdmin,updateProductController);

//getproduct
router.get('/get-product', getProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController);


//single product
router.get('/get-product/:slug',getSingleProductController);

//delete product
router.delete('/delete-product/:pid',requireSignIn,isAdmin,deleteProductController);

//filter product
router.post('/product-filters',productFiltersController);

//count product
router.get('/product-count',productCountcontroller);

//product per page
router.get('/product-list/:page',productListController)

//search product
router.get('/search/:keyword',searchProductController);

//similar product
router.get('/related-product/:pid/:cid',relatedProductController);

//category wise product
router.get('/product-category/:slug',productCategoryController)


//payements routes
//token
// router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/payment/create-order',requireSignIn,paymentController)

//verification
router.post('/payment/verify-order',requireSignIn,verifyController)

export default router;