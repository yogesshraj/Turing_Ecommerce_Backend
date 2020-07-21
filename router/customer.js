const express =require("express");
const middleware = require("../middleware/middleware")
const middleware_2 = require("../middleware/middleware_2")

const router = express.Router()

router.post("/customers",require("../controller/customer").signup)
router.post("/customers/login",require("../controller/customer").login)
router.put("/customers",middleware,require("../controller/customer").update);
router.get("/customers",middleware_2,require("../controller/customer").customerdet);
router.put("/customers/address",middleware_2,require("../controller/customer").customeraddr);
router.put("/customers/creditCard",middleware_2,require("../controller/customer").credit_cards);




module.exports = router