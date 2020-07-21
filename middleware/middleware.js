const jwt = require("jsonwebtoken");

module.exports=function middleware(req,res,next) {
    var authentication = jwt.verify(req.headers.authorization,"secretkey");
    if (authentication.email===req.body.email){
        next();
    }else{
        res.status(404).send("Access Denied");
    }
}