import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';
import BtnRender from './BtnRender';

const ProductItem = ({ product, isAdmin, deleteProduct, handleCheck }) => {
  // const [loading, setLoading] = useState(false);

  // const deleteProduct = async () => {
  //   try {
  //     setLoading(true);
  //     // Xoa anh trong Cloudinary truoc
  //     const destroyImg = await axios.post(
  //       '/api/destroy',
  //       { public_id: product.images.public_id },
  //       { headers: { Authorization: token } }
  //     );
  //     const deleteProduct = await axios.delete(`/api/products/${product._id}`, {
  //       headers: { Authorization: token },
  //     });
  //     setLoading(false);
  //     setCallback(!callback);
  //   } catch (error) {
  //     alert(error.response.data.message);
  //   }
  // };

  // const handleCheck = async () => {
  //   console.log(product.checked);
  // };

  // if (loading) {
  //   return <div className=''>{<Loading />}</div>;
  // }
  return (
    <div className='product_card'>
      {isAdmin && (
        <input
          type='checkbox'
          checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <img src={product.images.url} alt='' />

      <div className='product_box'>
        <h2 title={product.title}>{product.title}</h2>
        <span>${product.price}</span>
        <p>{product.description}</p>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
};

export default ProductItem;
