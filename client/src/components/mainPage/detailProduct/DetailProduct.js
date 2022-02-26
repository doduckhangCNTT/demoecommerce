import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';

const DetailProduct = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const addCart = state.userAPI.addCart;

  // Chứa thông tin của cái product được chọn
  const [detailProduct, setDetailProduct] = useState([]);

  useEffect(() => {
    console.log('re render');
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) {
          setDetailProduct(product);
        }
      });
    }
  }, [params.id, products]); // Nếu có sự thay đổi 1 trong 2 thì sự thực thi useEffect

  if (detailProduct.length === 0) {
    return null;
  }

  return (
    <>
      <div className='detail'>
        <img src={detailProduct.images.url} alt='' />
        <div className='box-detail'>
          <div className='row'>
            <h2>{detailProduct.title}</h2>
            <h6>#id: {detailProduct.product_id}</h6>
          </div>
          <span>$ {detailProduct.price}</span>
          <p>{detailProduct.description}</p>
          <p>{detailProduct.content}</p>
          <p>Sold: {detailProduct.sold}</p>
          <Link
            to='/cart'
            className='cart'
            onClick={() => addCart(detailProduct)}
          >
            Buy Now
          </Link>
        </div>
      </div>

      <h2>Related Products</h2>
      <div className='products'>
        {products.map((product) => {
          return product.category === detailProduct.category ? (
            <ProductItem key={product._id} product={product} />
          ) : null;
        })}
      </div>
    </>
  );
};

export default DetailProduct;
