const express  = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile("/home/yogi/yogessh/turing_project/front_end/categories.html")
})

app.use(require("./router/department"));
app.use(require("./router/categories"));
app.use(require("./router/attribute"));
app.use(require("./router/products"));
app.use(require("./router/customer"));
app.use(require("./router/orders"));
app.use(require("./router/shoppingcart"));
app.use(require("./router/tax"));
app.use(require("./router/shipping"));


app.use((req,res,next)=>{
    const error = new Error("Not found");
    error.status = (404);
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.sendStatus(error.status);
})


var port = 4999;
app.listen(port);
console.log("listening at ",port);