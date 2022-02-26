import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import Loading from '../utils/loading/Loading';
import ProductItem from '../utils/productItem/ProductItem';
import Filters from './Filters';
import LoadMore from './LoadMore';

const Products = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [callback, setCallback] = state.productsAPI.callback;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  // Vì làm việc với api lên khi gọi hàm thực thi api thì để vào useEffect để chỉ gọi hàm đó 1 lần duy nhất
  // useEffect(() => {
  //   const getProducts = async () => {
  //     const res = await axios.get('/api/products');
  //     // console.log(res.data.products);
  //     setProducts(res.data.products);
  //   };
  //   getProducts();
  // }, [products, setProducts]);

  // Xu li viec check duoc vao product co id tuong ung
  const handleCheck = async (id) => {
    products.forEach((product) => {
      if (product._id === id) {
        product.checked = !product.checked;
      }
      // Luu lai su thay doi tren product co id nay
      setProducts([...products]);
    });
  };

  const deleteProduct = async (id, public_id) => {
    console.log({ id, public_id });
    try {
      setLoading(true);
      // Xoa anh trong Cloudinary truoc
      const destroyImg = axios.post(
        '/api/destroy',
        { public_id },
        { headers: { Authorization: token } }
      );
      const deleteProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;
      await deleteProduct;
      setCallback(!callback);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) {
        deleteProduct(product._id, product.images.public_id);
      }
    });
  };
  if (loading) {
    return <div className=''>{<Loading />}</div>;
  }

  return (
    <>
      <Filters />
      {isAdmin && (
        <div className='delete-all'>
          <span>Select All</span>
          <input
            type='checkbox'
            name=''
            checked={isCheck}
            onChange={checkAll}
          />
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <div className='products'>
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>

      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
};

export default Products;
