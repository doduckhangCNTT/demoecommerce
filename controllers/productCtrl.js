const Products = require('../models/productModel');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };

    const excludeFields = ['page', 'sort', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Chuyển các query gửi lên thành 1 chuỗi string để mà có thể thay thế 1 số thành phần cần thiết
    let queryStr = JSON.stringify(queryObj);

    // Khi tìm kiếm các giá trị >= <= trên thanh URL thì sd gte lte
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => '$' + match
    );
    console.log('Query String: ', queryStr);
    // Chuyển chuỗi string thành chuỗi JSON và tìm kiếm trong tất cả products thì cái nào nó thỏa mãn điều kiện
    this.query.find(JSON.parse(queryStr));

    // console.log({ queryObj, queryStr });

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      // Nếu chuỗi queryString truyền vào gồm nhiều gt cách nhau bằng dấu "," thì cắt các gt trị và nối bằng khoảng trắng
      // với mục đích là khi truyền chuỗi đó vào sort thì nó có thể đọc các gt và sắp xếp theo thứ tự gt truyền vào
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createAt');
    }
    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    // Số lượng sản phẩm trên 1 trang
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    console.log(page, limit, skip);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      console.log(req.query);
      // Đẩy toàn bộ dữ liệu trong bảng Products vào query, và gửi toàn bộ các query(đằng sau dấu ? trên Url) vào
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;

      res.json({
        status: 'success',
        results: products.length,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images) {
        return res
          .status(404)
          .json({ success: false, message: 'No image upload' });
      }

      const product = await Products.findOne({ product_id });
      if (product) {
        return res
          .status(400)
          .json({ success: false, message: 'Product is already exists' });
      }

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });
      await newProduct.save();

      res.json({
        success: true,
        message: 'Created a Product',
        newProduct: newProduct,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Deleted a Product' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images) {
        return res
          .status(404)
          .json({ success: false, message: 'No image upload' });
      }
      await Products.findByIdAndUpdate(
        { _id: req.params.id },
        {
          product_id,
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );
      res.json({ success: true, message: 'Updated a Product' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = productCtrl;
