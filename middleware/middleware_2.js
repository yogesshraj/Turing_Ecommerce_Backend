const jwt = require("jsonwebtoken");

module.exports = function middleware(req,res,next){
    let authentication = jwt.verify(req.headers.authorization,"secretkey")
    if (!authentication){
        res.status(404).send("access denied")
    }else if (authentication){
        req.email = authentication.email
        next();
    }
}