const Category = require('../models/categoryModel');
const Products = require('../models/productModel');

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      // Nếu role = 1 ==> admin
      // admin mới có quyền create, update, delete category

      const { name } = req.body;
      const category = await Category.findOne({ name });
      // category đã tồn tại trong database
      if (category) {
        return res
          .status(400)
          .json({ success: false, message: 'This category already exists' });
      }
      // category chưa tồn tại trong database --> tạo mới category
      const newCategory = new Category({ name });
      await newCategory.save();
      res.json({ success: true, message: 'Created a category' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      // Xoa category thi phai xoa cac san pham co category do trc moi duoc
      const products = await Products.findOne({ category: req.params.id });
      if (products)
        return res.status(400).json({
          message: 'Please delete product with a relationship',
        });

      await Category.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Deleted a Category' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findByIdAndUpdate({ _id: req.params.id }, { name });

      res.json({ success: true, message: 'Updated a Category' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = categoryCtrl;
