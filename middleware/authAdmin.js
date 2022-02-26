const Users = require('../models/userModel');

const authAdmin = async (req, res, next) => {
  try {
    // tim user theo id
    const user = await Users.findOne({
      _id: req.user.id,
    });
    if (user.role === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Admin resource access denied' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = authAdmin;
