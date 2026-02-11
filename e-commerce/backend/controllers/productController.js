import Product from "../models/ProductModel.js";
import { ApiResponse } from "../utils/apiResponse.js";

// get all products by page within it's limited statuses
export const getProducts = async(req, res) => {
    try {
        const {category , minPrice, maxPrice, search, page = 1, limit = 10,  sort="createdAt" , order = "desc"} = req.query;
    
        const filter = {isActive:true};
        if(category)  filter.category = category;
        if(minPrice || maxPrice) {
            filter.price = {}
            if(minPrice) filter.price.$gte  = parseFloat(minPrice);
            if(maxPrice) filter.price.$gte  = parseFloat(maxPrice);
        }
        if(search) filter.$text - {$search:search}
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === 'desc' ? -1 : 1;

        const [products , total] = await Promise.all([
            Product.find(filter).sort({[sort]:sortOrder})
            .skip(skip).limit(parseInt(limit)),
            Product.countDocuments(filter)
        ]);

        const catagories = await Product.distinct("category" , {isActive:true});
        res.json(ApiResponse.paginated({
            products,
            filters:{catagories, minPrice, maxPrice}
        },page, limit, total))

    } catch (error) {
        res.status(500).json(ApiResponse.error(error.message));
    }
};

// get single Product
export const  getProduct = async (req ,res) => {
   try {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).json(ApiResponse.error("Product not Found"));

    // find related products
    const related = await Product.find({
        _id:{$ne:product._id},
        category:product.category,
        isActive:true
    }).limit(10);
    res.json(ApiResponse.success({product, related}))
   } catch (error) {
    res.status(400).json(ApiResponse.error(error.message))
   }
};

// create new Product
export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(ApiResponse.success(product , "Product created"))
    } catch (error) {
        res.status(400).json(ApiResponse.error(error.message))
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
       const product = await Product.findByIdAndUpdate(
        req.params.id,
        req,body,
        {new:true , runValidators:true}
       );
       
       if(!product) 
        return res.status(404).json(ApiResponse.error("Product not Found"));
       res.json(ApiResponse.success(product, "product updated"));
    } catch (error) {
        res.status(400).json(ApiResponse.error(error.message))
    }
}

// delete specific product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {isActive:false},
            {new : true}
        );
        if(!product) return res.status(404).json(ApiResponse.error("Product not found"))
        
        res.json(ApiResponse.success(null, "Product Deactivated"));
    } catch (error) {
        res.status(400).json(ApiResponse.error(error.message))
    }
};

export const getProductStats = async (req , res) => {
    try {
        const stats = await Product.aggregate([
            {$match:{isActive:true}},
            {$group:{
                _id:null,
                totalProducts:{$sum:1},
                totalStock:{$sum:"$stock"},
                avgPrice:{$avg:"$price"},
                maxPrice:{$max:"$price"},
                minPrice:{$min: "$price"}
            }}
        ]);

        const catagoryStats = await Product.aggregate([
            {$match:{isActive:true}},
            {$group:{
                _id:"$category",
                count:{$sum: 1},
                avgPrice:{$avg: "$price"}
            }},
            {$sort: {count:-1}}
        ])
        res.json(ApiResponse.success({
            overall:stats[0] || {},
            byCatagory:catagoryStats
        }))
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message))  
    }
}
