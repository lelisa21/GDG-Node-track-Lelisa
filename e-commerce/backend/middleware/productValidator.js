
module.exports = (req , res, next) => {
    const {name , price , stock} = req.body;
    if(!name) return res.status(400).json({error:"name is required!"});
    if(price < 0) return res.status(400).json({error:"price must be positive"});
    if(stock < 0) return res.status(400).json({error:"stock cannot be negative "});
next();
}
