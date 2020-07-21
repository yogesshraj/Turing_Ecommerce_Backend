const express = require("express");
const middleware_2 = require("../middleware/middleware_2");

const router = express.Router();

router.post("/orders",middleware_2,require("../controller/orders").porder)
router.get("/orders/inCustomer",middleware_2,require("../controller/orders").orderCustomer)
router.get("/orders/:order_id",middleware_2,require("../controller/orders").getall)
router.get("/orders/shortDetail/:order_id",middleware_2,require("../controller/orders").shortdetail)


module.exports =  router;