import Product from '../../models/product.js';

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