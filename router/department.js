const express  = require("express");

const router  = express.Router();

router.get("/departments",require("../controller/department").getall);
router.get("/departments/:department_id",require("../controller/department").getid);

module.exports = router;