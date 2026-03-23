const express = require("express");
const router = express.Router();
const batchController = require("../Controller/batchController");

router.post("/", batchController.addBatch);
router.get("/allbatch", batchController.getAllBatch);
router.get("/onebatch/:id", batchController.getBatchById);
router.delete("/deletebatch/:id", batchController.deleteBatch);
router.put("/updatebatch/:id", batchController.updateBatch);
router.put("/activebatch/:id", batchController.activeBatch);
module.exports = router;