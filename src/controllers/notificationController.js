// src/controllers/notificationController.js
const { Notification } = require("../models");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.markRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    );
    res.json({ msg: "Notifications marked as read" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
