import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true
  },
  quantity:{
    type:Number,
    required:true,
    min:1
  },
  priceAtPurchase:{
    type:Number,
    required:true,
    min:0
  },
  subtotal:{
    type:Number,
    get:function(){return this.quantity * this.priceAtPurchase}
  }
}, {_id:false});

const orderSchema = new Schema({
    orderNumber: {
        type: String,
        unique: true,
        default: () => {
        const time = Date.now().toString(36).toUpperCase();
        const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        return `ORD-${time}-${rand}`;
        } 
    },
    sessionId:{
        type:String,
        required:true,
        index:true
    },
    customer:{
        name:{type:String , required:[true , "Customer name is Required"], trim:true},
        email:{type:String , required:[true , "Customer email is Required"], trim:true},
        phone:String,
        address:{
            country:{type:String,default:"Ethiopia"},
            city:{type:String , default:"Addis Ababa"}
        }
    },
    items:[orderItemSchema],
    subtotal:{
        type:Number,
        get: function(){
            return this.items.reduce((sum,item) => sum + (item.quantity * item.priceAtPurchase) , 0)
        }
    },
    tax:{
        type:Number,
        default:0,
        min:0
    },
    shipping:{
        type:Number,
        default:0,
        min:0
    },
    total:{
        type:Number,
        get:function(){return this.subtotal + this.tax + this.shipping}
    },
    status:{
        type:String,
        enum:["pending" , "processing", "shipped" , "delivered" , "cancelled"],
        default:"pending"
    },
    notes:String,
    estimatedDelivery:Date 
}, {timestamps:true, toJSON:{getters:true , virtuals:true} , toObject:{getters:true , virtuals:true}});

// virtual formatted order date
orderSchema.virtual("formattedDate").get(function(){
    return this.createdAt.toLocaleDateString('en-US' , {year:"numeric" , month:"long" , day:"numeric"})
})

// pre save to calculate totals
orderSchema.pre("save" , function(next){
    if(this.isModified("items")){
        this.markModified("items")
    }
    next()
});

// static method find order by session
 orderSchema.statics.findBySession = function(sessionId){
    return this.find({sessionId}).sort("-createdAt").populate("items.product")
 };
 
const Order = mongoose.model("Order", orderSchema);

export default Order;
