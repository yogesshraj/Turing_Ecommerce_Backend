const express = require("express");
const middleware_2 = require("../middleware/middleware_2")
const router = express.Router();

router.get("/products",require("../controller/products").product);
router.get("/products/search",require("../controller/products").product_query);
router.get("/products/:product_id",require("../controller/products").product_with_id);
router.get("/products/inCategory/:category_id",require("../controller/products").product_category_id)
router.get("/products/inDepartment/:department_id",require("../controller/products").product_department_id);
router.get("/products/:product_id/details",require("../controller/products").product_details)
router.get("/products/:product_id/locations",require("../controller/products").product_location);
router.get("/products/:product_id/reviews",require("../controller/products").review)
router.post("/products/:product_id/reviews",middleware_2,require("../controller/products").reviewpost)

module.exports = router;