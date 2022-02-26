const Users = require('../models/userModel');
const Payments = require('../models/paymentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { cookie } = require('express/lib/response');
const userCtrl = {
  register: async (req, res) => {
    try {
      // Lấy nội dung mà người dùng register
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Invalid username or email or password',
        });
      }
      const user = await Users.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ success: false, message: 'email already in use' });
      }
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters',
        });
      }

      // Password encryption
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });
      // lưu thông tin người dùng mới vào db
      await newUser.save();

      // tao token để có thể authentication
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 60 * 60 * 24 * 1000, // 7d
      });

      // res.json({ accesstoken });
      res.json({
        success: true,
        message: 'Register successfully',
        accessToken: accesstoken,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid email or password' });
      }

      const user = await Users.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'Email not found' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: 'Password mismatch' });
      }

      // Cung cap accesstoken va refreshtoken
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 60 * 60 * 24 * 1000, // 7d
      });

      res.json({
        success: true,
        message: 'Login successful',
        accesstoken: accesstoken,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
      return res.json({ success: true, message: 'Logged out' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  refreshToken: (req, res) => {
    try {
      // lay token ben tron cookie trc do da luu
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) {
        return res
          .status(400)
          .json({ success: false, message: 'Please login or Register' });
      }
      // Xac thuc token trong rf_token lieu co phai la token minh gui trc do khi user dang ki
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res
            .status(400)
            .json({ success: false, message: 'Please login or Register' });
        }
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ user, accesstoken });
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    // res.json({ rf_token });
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('-password');
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: 'User does not exist.' });
      }

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );
      return res.json({ msg: 'Added to cart' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });
      res.json(history);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};

module.exports = userCtrl;
