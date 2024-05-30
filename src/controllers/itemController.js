const { Item, Bid } = require("../models");
const { validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.getItems = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const items = await Item.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
    });
    res.json(items);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.createItem = [
  upload.single("image"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description, starting_price, end_time } = req.body;
    const image_url = req.file ? req.file.path : null;
    try {
      const item = new Item({
        name,
        description,
        starting_price,
        current_price: starting_price,
        end_time,
        image_url,
      });
      await item.save();
      res.json(item);
    } catch (err) {
      res.status(500).send("Server error");
    }
  },
];

exports.updateItem = async (req, res) => {
  const { name, description, starting_price, end_time } = req.body;
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    if (item.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    item.name = name || item.name;
    item.description = description || item.description;
    item.starting_price = starting_price || item.starting_price;
    item.end_time = end_time || item.end_time;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    if (item.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    await item.destroy();
    res.json({ msg: "Item deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.getBidsForItem = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { item_id: req.params.itemId },
      order: [["created_at", "DESC"]],
    });
    res.json(bids);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.placeBid = async (req, res) => {
  const { bid_amount } = req.body;
  try {
    const item = await Item.findByPk(req.params.itemId);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    if (new Date(item.end_time) < new Date()) {
      return res.status(400).json({ msg: "Auction has ended" });
    }
    if (bid_amount <= item.current_price) {
      return res
        .status(400)
        .json({ msg: "Bid amount must be higher than current price" });
    }
    const bid = new Bid({
      item_id: item.id,
      user_id: req.user.id,
      bid_amount,
    });
    await bid.save();
    item.current_price = bid_amount;
    await item.save();
    // Notify other users about the new bid via WebSocket
    req.io.emit("bid", { item_id: item.id, current_price: bid_amount });
    res.json(bid);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
