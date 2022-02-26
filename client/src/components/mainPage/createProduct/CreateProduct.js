import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import Loading from '../utils/loading/Loading';

const initialState = {
  product_id: '',
  title: '',
  price: 0,
  description:
    'Lorem Ipsum, Lorem Ipsum 💗If you feel good, please subscribe and donate to help us out. Thanks!💗',
  content:
    'Lorem Ipsum, Lorem Ipsum 💗If you feel good, please subscribe and donate to help us out. Thanks!💗 Lorem Ipsum, Lorem Ipsum 💗If you feel good, please subscribe  ',
  category: '',
  _id: '',
};

const CreateProduct = () => {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const navigate = useNavigate();
  const params = useParams();

  const [products, setProducts] = state.productsAPI.products;
  const [callback, setCallback] = state.productsAPI.callback;
  useEffect(() => {
    if (params.id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === params.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [params.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert('You are not a admin');

      // Lấy cái file mình gửi lên
      const file = e.target.files[0];
      console.log(file);
      // Kiểm tra gửi lên có thỏa mãn điều kiện
      if (!file) {
        return alert('File is not exists');
      }

      if (file.size > 1024 * 1024) {
        return alert('File is too large');
      }

      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return alert('File format not incorrect');
      }
      // Tạo đối tượng để có thể lưu giữ file gửi lên
      let formData = new FormData();
      formData.append('file', file);

      setLoading(true);
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: token,
        },
      });
      // console.log(res);
      setLoading(false);
      setImages(res.data);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) {
        return alert('You must be an admin');
      }
      setLoading(true);
      await axios.post(
        '/api/destroy',
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      return alert('You must be an admin');
    }
    if (!images) {
      return alert('Not have image upload');
    }
    if (onEdit) {
      await axios.put(
        `/api/products/${product._id}`,
        { ...product, images },
        {
          headers: { Authorization: token },
        }
      );
    } else {
      await axios.post(
        '/api/products',
        { ...product, images },
        {
          headers: { Authorization: token },
        }
      );
    }
    setCallback(!callback);
    setImages(false);
    setProduct(initialState);
    navigate('/');
  };

  const styleUpload = {
    display: images ? 'block' : 'none',
  };

  return (
    <div className='create_product'>
      <div className='upload'>
        <input type='file' name='file' id='file_up' onChange={handleUpload} />
        {loading ? (
          <div id='file_img'>
            {console.log('loading')}
            <Loading />
          </div>
        ) : (
          <div id='file_img' style={styleUpload}>
            <img src={images ? images.url : ''} alt='' />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <label htmlFor='product_id'>Product ID</label>
          <input
            type='text'
            name='product_id'
            id='product_id'
            required
            value={product.product_id}
            onChange={handleChangeInput}
            disabled={onEdit}
          />
        </div>

        <div className='row'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            name='title'
            id='title'
            required
            value={product.title}
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            name='price'
            id='price'
            required
            value={product.price}
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='description'>Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            required
            value={product.description}
            rows='5'
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='content'>Content</label>
          <textarea
            type='text'
            name='content'
            id='content'
            required
            value={product.content}
            rows='7'
            onChange={handleChangeInput}
          />
        </div>

        <div className='row'>
          <label htmlFor='categories'>Categories: </label>
          <select
            name='category'
            value={product.category}
            onChange={handleChangeInput}
          >
            <option value=''>Please select a category</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type='submit'>{onEdit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default CreateProduct;
