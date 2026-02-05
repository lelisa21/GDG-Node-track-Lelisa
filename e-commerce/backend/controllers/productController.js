const Product = require("../models/ProductModel")
const mongoose = require("mongoose");

const getAllProducts = async (req ,res) => {
    const product = await Product.find({}).sort({createdAt: -1})
    res.status(200).json(product);
}

const getProduct = async (req , res) => {
    const {id} = req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({error: "No such product"})
   }
    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({error : "No such product"})
    }

    res.status(200).json(product);
}
const createProduct = async (req , res)=> {
    const {name, description, price, stock , category , imageUrl, rating} =  req.body;

    const emptyFields = [];
    if(!name) emptyFields.push("name");
    if(!description) emptyFields.push("description");
    if(price === undefined) emptyFields.push("price");
    if(stock === undefined) emptyFields.push("stock");
    if(!category) emptyFields.push("category");

    
    if(emptyFields.length > 0){
        return res.status(400).json({error : "please fill in all fields" , emptyFields})
    }
    try {
      const product  = await Product.create({name, description, price , stock , category , imageUrl, rating});

      res.status(201).json(product);
    } catch (error) {
       res.status(400).json({error:error.message})
    }
}

const deleteProduct = async (req , res) => {
     const {id} = req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({error: "No such product"})
   }
   const product = await Product.findOneAndDelete({_id:id})
   if(!product){
        return res.status(404).json({error : "No such product"})
    }

    res.status(200).json(product);
}

const updateProduct = async (req , res) => {
     const {id} = req.params;
   if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({error: "No such product"})
   }
   const product = await Product.findOneAndUpdate({_id:id} , {
    ...req.body
   }, {new:true});
   
   if(!product){
        return res.status(404).json({error : "No such product"})
    }

    res.status(200).json(product);
}

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
}
