const express = require("express");

const router = express.Router();

router.get("/shipping/regions",require("../controller/shipping").shipregion);
router.get("/shipping/regions/:shipping_region_id",require("../controller/shipping").shipregionid);


module.exports = router;