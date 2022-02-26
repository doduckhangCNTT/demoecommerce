import React, { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PaypalButton from './PaypalButton';

const Cart = () => {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [total, setTotal] = useState(0);
  const [token] = state.token;
  // const [callBack, setCallBack] = state.userAPI.callback;

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.quantity * item.price;
      }, 0);

      setTotal(total);
    };
    getTotal();
  }, [cart]);

  // lưu lại các sự thay đổi trên mỗi sản phẩm trong giỏ hàng lên database
  const addToCart = async (cart) => {
    await axios.patch(
      '/user/addCart',
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const increment = (id) => {
    // Tim cai item muon tang so luong
    cart.forEach((item) => {
      if (id === item._id) {
        item.quantity += 1;
      }
    });
    setCart([...cart]);
    addToCart(cart);
  };

  const decrement = (id) => {
    // Tim cai item muon tang so luong
    cart.forEach((item) => {
      if (id === item._id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });
    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm('You have removed this a product')) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };

  const tranSuccess = async (payment) => {
    // console.log(payment);
    const { paymentID, address } = payment;

    await axios.post(
      '/api/payment',
      { cart, paymentID, address },
      { headers: { Authorization: token } }
    );

    setCart([]);
    addToCart([]);
    // setCallBack(!callBack);
    alert('You have successfully place on order.');
  };

  if (cart.length === 0) {
    return (
      <h2 style={{ textAlign: 'center', fontSize: '5rem' }}>Cart Empty</h2>
    );
  }

  return (
    <div>
      {cart.map((product) => (
        <div className='detail cart' key={product._id}>
          <img src={product.images} alt='' />
          <div className='box-detail'>
            <h2>{product.title}</h2>

            <span>$ {product.price * product.quantity}</span>
            <p>{product.description}</p>
            <p>{product.content}</p>

            <div className='amount'>
              <button onClick={() => decrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}>+</button>
            </div>

            <div className='delete' onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}

      <div className='total'>
        <h3>Total: {total}</h3>
        {/* <Link to='#!'>Payment</Link> */}
        <PaypalButton total={total} tranSuccess={tranSuccess} />
      </div>
    </div>
  );
};

export default Cart;
