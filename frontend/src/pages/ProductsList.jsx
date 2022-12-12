import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
// import data from '../data/data';
import axios from 'axios';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils/getError';
import Product from '../components/Product';

const types = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILED: 'FETCH_FAILED',
};
const reducer = (state, action) => {
  switch (action.type) {
    case types.FETCH_REQUEST:
      return { ...state, loading: true };
      break;
    case types.FETCH_SUCCESS:
      return { ...state, loading: false, products: action.payload };
      break;
    case types.FETCH_FAILED:
      return { ...state, loading: false, error: action.payload };
      break;
    default:
      return state;
      break;
  }
};

export default function ProductsList() {
  const [{ products, loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    dispatch({ type: types.FETCH_REQUEST });
    axios
      .get('/api/products')
      .then((res) => {
        dispatch({ type: types.FETCH_SUCCESS, payload: res.data });
      })
      .catch((err) =>
        dispatch({ type: types.FETCH_FAILED, payload: getError(err) })
      );
  }, []);

  return (
    <main className="">
      <Helmet>
        <title>E-menswear</title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="flex justify-center items-center mt-10 ">
          <span className="px-4 py-2 bg-red-200 text-red-900 rounded-md">
            {error}
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 p-3">
          {products.products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
