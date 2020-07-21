const express = require("express");
const router = express.Router();

router.get("/attributes",require("../controller/attribute").attributes);
router.get("/attributes/:attribute_id",require("../controller/attribute").attributes_id);
router.get("/attributes/values/:attribute_id",require("../controller/attribute").attributes_values);
router.get("/attributes/inProduct/:product_id",require("../controller/attribute").product_id);



module.exports = router;