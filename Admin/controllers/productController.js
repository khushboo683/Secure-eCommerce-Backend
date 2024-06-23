import Product from '../../models/product.js';
import { BadRequestError, NotFoundError } from '../../utils/error.js';

export const addProduct=async(req,res,next)=>{
    try{
    const { name, price, stock, category,  brand, description} = req.body;
    const product = new Product({
        name,
        price,
        stock,
        category,
        brand,
        description
    })
    await product.save();
    res.success({product,message:'Product added successfully!'});
}catch(err){
    next(err);
}
}

export const getProducts=async(req,res,next)=>{
    try{
      const result = await Product.find({});
      res.success({result})
    }catch(err){
        next(err);
    }
}

export const updateProduct=async(req,res,next)=>{
    try{
      const {productId} = req.params;
      const product = await Product.findByIdAndUpdate(productId,{
        ...req.body
      },{ new: true, runValidators: true })
      if(!product){
        throw new NotFoundError('Product does not exist!');
      }
      await product.save();
      res.success({product,message:'Product updated successfully.'})
    }catch(err){
        next(err);
    }
}

export const deleteProduct=async(req,res,next)=>{
    try{
   const{productId} = req.params;
   const product = await Product.findById(productId);
   if(!product){
    throw new NotFoundError('Product does not exists.')
   }
   await Product.findByIdAndDelete(productId);
   res.success({message:'Product deleted successfully.'})
    }catch(err){
        next(err);
    }
}