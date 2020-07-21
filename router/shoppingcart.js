const express = require("express");

const router = express.Router();


router.get("/shoppingcart/generateUniqueId",require("../controller/shoppingcart").uniqueid);
router.post("/shoppingcart/add",require("../controller/shoppingcart").addproductcart);
router.get("/shoppingcart/:cart_id",require("../controller/shoppingcart").getid);
router.put("/shoppingcart/update/:item_id",require("../controller/shoppingcart").updating);
router.delete("/shoppingcart/empty/:cart_id",require("../controller/shoppingcart").deleting);
router.get("/shoppingcart/totalAmount/:cart_id",require("../controller/shoppingcart").totalcost);
router.delete("/shoppingcart/removeProduct/:item_id",require("../controller/shoppingcart").removingprod);
router.get("/shoppingcart/saveForLater/:item_id",require("../controller/shoppingcart").savelater);
router.get("/shoppingcart/getSaved/:cart_id",require("../controller/shoppingcart").getsaved);
router.get("/shoppingcart/moveToCart/:item_id",require("../controller/shoppingcart").movetoproduct);




module.exports= router;