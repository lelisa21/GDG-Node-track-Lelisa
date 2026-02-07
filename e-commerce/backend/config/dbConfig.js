const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const connectDB = async () => {
   await mongoose.connect(process.env.MONGO_URI).then(() => console.log("mongoDB connected"))
   .catch(error => console.error("mongoDB Connection failed" , error.message))
}

module.exports = connectDB;
