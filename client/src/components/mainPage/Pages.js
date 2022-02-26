import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';

import Products from './products/Products';
import DetailProduct from './detailProduct/DetailProduct';
import Cart from './cart/Cart';
import Login from './auth/Login';
import Register from './auth/Register';
import NotFound from './utils/not_found/NotFound';
import OrderHistory from './history/OrderHistory';
import OrderDetails from './history/OrderDetails';
import Categories from './categories/Categories';
import CreateProduct from './createProduct/CreateProduct';

const Pages = () => {
  const state = useContext(GlobalState);
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <Routes>
      <Route path='/' element={<Products />} />
      <Route path='/detail/:id' element={<DetailProduct />} />
      <Route path='/login' element={isLogged ? <NotFound /> : <Login />} />
      <Route
        path='/register'
        element={isLogged ? <NotFound /> : <Register />}
      />
      <Route
        path='/category'
        element={isAdmin ? <Categories /> : <NotFound />}
      />
      <Route
        path='/create_product'
        element={isAdmin ? <CreateProduct /> : <NotFound />}
      />
      <Route
        path='/edit_product/:id'
        element={isAdmin ? <CreateProduct /> : <NotFound />}
      />

      <Route
        path='/history'
        element={isLogged ? <OrderHistory /> : <NotFound />}
      />

      <Route
        path='/history/:id'
        element={isLogged ? <OrderDetails /> : <NotFound />}
      />
      <Route path='/cart' element={<Cart />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default Pages;
