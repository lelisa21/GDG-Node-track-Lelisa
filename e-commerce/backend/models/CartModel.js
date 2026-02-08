import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:[true , "product reference is required"]
    },
    quantity:{
        type:Number,
        required: [true , "you have to enter quantity"],
        min:[1 , "atleast 1 quantity must be added"],
        max:[99 , "quantity cannot exceed 99"]
    },
}, {_id:false});


const cartSchema  = new Schema({
    sessionId:{
        type:String,
        required:true,
        index:true
    },
    items:[cartItemSchema],
    lastUpdated:{
        type:Date,
        default:Date.now
    }
}, {timestamps:true,
    statics:{
        async findBySession(sessionId){
            return this.findOneAndUpdate(
               { sessionId},
               {lastUpdated:Date.now()},
               {upsert:true , new:true,setDefaultsOnInsert:true}
            ).populate("items.product")
        }
    }
});

// to ensure unique product in a cart
cartSchema.pre("save" , function(next){
    const seen = new Map();
    this.items = this.items.filter(item => {
        const key = item.product.toString();
        if(seen.has(key)){
            seen.get(key).quantity += item.quantity;
            return false;
        }
        seen.set(key , item);
        return true;
    });
    next();
});
const Cart = mongoose.model("Cart" , cartSchema);

export default Cart;
