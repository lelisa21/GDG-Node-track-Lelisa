import Product from "../models/ProductModel.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getProducts = async(req, res) => {
    try {
        const {category , minPrice, maxPrice, search, page = 1, limit = 10,  sort="createdAt" , order = "desc"} = req.query;
    
        const filter = {isActive:true};
        if(category)  filter.category = category;

        const parsedMinPrice = Number(minPrice);
        const parsedMaxPrice = Number(maxPrice);

        if(!Number.isNaN(parsedMinPrice) || !Number.isNaN(parsedMaxPrice)) {
            filter.price = {}
            if(!Number.isNaN(parsedMinPrice)) filter.price.$gte  = parsedMinPrice;
            if(!Number.isNaN(parsedMaxPrice)) filter.price.$lte  = parsedMaxPrice;
        }

        if(search?.trim()) {
            const term = search.trim();
            filter.$or = [
                { name: { $regex: term, $options: "i" } },
                { description: { $regex: term, $options: "i" } }
            ];
        }

        const sortMap = {
            newest: { createdAt: -1 },
            priceLow: { price: 1 },
            priceHigh: { price: -1 },
            topRated: { rating: -1 }
        };

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortQuery = sortMap[sort] || { [sort]: sortOrder };

        const [products , total] = await Promise.all([
            Product.find(filter).sort(sortQuery)
            .skip(skip).limit(limitNumber),
            Product.countDocuments(filter)
        ]);

        const categories = await Product.distinct("category" , {isActive:true});
        res.json(ApiResponse.paginated({
            products,
            filters:{categories, minPrice: parsedMinPrice, maxPrice: parsedMaxPrice}
        },pageNumber, limitNumber, total))

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
