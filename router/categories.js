const express = require("express");

const router = express.Router()

router.get("/categories",require("../controller/categories").categories);
router.get("/categories/:category_id",require("../controller/categories").categoriesid);
router.get("/categories/inProduct/:product_id",require("../controller/categories").productid);
router.get("/categories/inDepartment/:department_id",require("../controller/categories").departmentid);

module.exports = router;