const express  = require("express");

const router = express.Router();

router.get("/tax",require("../controller/tax").tax)
router.get("/tax/:tax_id",require("../controller/tax").taxid)

module.exports = router
