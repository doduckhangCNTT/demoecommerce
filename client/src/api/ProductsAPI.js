import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ProductsAPI = () => {
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);

  // const getProducts = async () => {
  //   const res = await axios.get('/api/products');
  //   // console.log(res.data.products);
  //   setProducts(res.data.products);
  // };

  // // Vì làm việc với api lên khi gọi hàm thực thi api thì để vào useEffect để chỉ gọi hàm đó 1 lần duy nhất
  // useEffect(() => {
  //   getProducts();
  // }, []);

  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get(
        `/api/products?limit=${
          page * 9
        }&${category}&${sort}&title[regex]=${search}`
      );
      // console.log(res.data.products);
      console.log(res);
      setProducts(res.data.products);
      setResult(res.data.result);
    };
    getProducts();
  }, [callback, category, sort, search, page]);

  return {
    products: [products, setProducts],
    callback: [callback, setCallback],
    category: [category, setCategory],
    sort: [sort, setSort],
    search: [search, setSearch],
    page: [page, setPage],
    result: [result, setResult],
  };
};

export default ProductsAPI;
