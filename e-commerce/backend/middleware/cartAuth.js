const mongoose = require("mongoose")

const cartAuth = (req , res , next) => {
  const userId = req.headers["x-user-id"];

  if(!userId) return res.status(401).json({error:"user ID required in headers"})

    if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({error:"invalid user ID"});

    req.user = {_id:userId};
    next();
}
module.exports = cartAuth;
