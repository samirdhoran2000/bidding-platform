// src/routes/itemRoutes.js
const express = require("express");
const { check } = require("express-validator");
const itemController = require("../controllers/itemController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", itemController.getItems);
router.get("/:id", itemController.getItem);
router.post(
  "/",
  auth,
  [
    check("name", "Name is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("starting_price", "Starting price is required").isDecimal(),
    check("end_time", "End time is required").not().isEmpty(),
  ],
  itemController.createItem
);
router.put("/:id", auth, itemController.updateItem);
router.delete("/:id", auth, itemController.deleteItem);
router.get("/:itemId/bids", itemController.getBidsForItem);
router.post(
  "/:itemId/bids",
  auth,
  [check("bid_amount", "Bid amount is required").isDecimal()],
  itemController.placeBid
);

module.exports = router;
