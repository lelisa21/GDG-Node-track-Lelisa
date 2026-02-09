import mongoose from "mongoose";
const Schema = mongoose.Schema
const productSchema = new Schema({
    name:{
        type:String,
        required:[true , 'Product name is required'],
        trim: true,
        maxLength:[100, "Name cannot exceed 100 characters!"]
    },
    description:{
        type:String,
        required:[true , "product description is required"],
    },
    price:{
        type:Number,
        required:[true, "provide price of product"],
        min:[0, "price must be positive"],
        get: value => Math.round(value * 100) /100
    },
    stock:{
        type:Number,
        required:[true , "Stock number is required"],
        min:[0, "Stock cannot be negative"],
        default:0
    },
    category:{
        type:String,
        required:[true, "Catagory is required"],
        enum:{
            values:["electronics" , "fashion" , "beauty", "health" , "home" , "food" , "books" , "other"],
        message:`{VALUE} is not a valid catagory`
    }},
    imageUrl:{
        type:String,
        default: "https://www.pinterest.com/pin/1337074888578744/"
    },
    rating:{
        type:Number,
        default:0,
        min:0,
        max:5,
        set: v => Math.round(v * 10)/10
    },
    isActive:{
        type:Boolean,
        default:true
    }}, {timestamps:true,toJSON:{getters:true} , toObject:{getters:true}}
)
const Product = mongoose.model("Product" , productSchema)

export default Product;
