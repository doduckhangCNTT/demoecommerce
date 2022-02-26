import axios from 'axios';
import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';

const Categories = () => {
  const state = useContext(GlobalState);
  const [categories, setCategories] = state.categoriesAPI.categories;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [category, setCategory] = useState('');
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState(false);
  const [token] = state.token;

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/category/${id}`,
          { name: category },
          { headers: { Authorization: token } }
        );
        alert(res.data.message);
      } else {
        const res = await axios.post(
          '/api/category',
          { name: category },
          { headers: { Authorization: token } }
        );
        alert(res.data.message);
      }
      setCallback(!callback);
      setCategory('');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const editCategory = (id, name) => {
    setId(id);
    setCategory(name);
    setOnEdit(true);
  };
  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.message);
      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className='categories'>
        <form onSubmit={createCategory}>
          <label htmlFor='category'>Category</label>
          <input
            type='text'
            name='category'
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          />

          <button type='submit' className=''>
            {onEdit ? 'Update' : 'Create'}
          </button>
        </form>
        <div className='col'>
          {categories.map((category) => (
            <div className='row' key={category._id}>
              <p>{category.name}</p>
              <div>
                <button
                  onClick={() => editCategory(category._id, category.name)}
                >
                  Edit
                </button>
                <button onClick={() => deleteCategory(category._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
