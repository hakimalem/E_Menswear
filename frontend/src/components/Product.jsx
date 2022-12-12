import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './Rating';

export default function Product({ product }) {
  const { state, dispatch, types } = useContext(Store);

  const addProduct = () => {
    const existItem = state.cart.cartItems.find((item) => {
      return item._id === product._id;
    });
    if (
      existItem?.quantity === product.countInStock ||
      product.countInStock === 0
    ) {
      window.alert('product is out of stock ');
      return;
    }

    const quantity = existItem ? existItem.quantity + 1 : 1;
    console.log('stock : ', product.countInStock);
    console.log('quantity : ', quantity);
    dispatch({
      type: types.ADD_TO_CART,
      payload: { ...product, quantity },
    });
  };
  return (
    <div
      key={product.slug}
      className="border border-2 rounded-lg p-3 flex flex-col gap-4"
    >
      <Link to={`/products/slug/${product.slug}`}>
        <img
          src={product.image}
          alt=""
          className="cursor-pointer max-w-[240px]"
        />
      </Link>
      <Link to={`/products/slug/${product.slug}`}>
        <h1 className="text-[#551a8b] text-md font-bold cursor-pointer hover:text-orange-600">
          {product.name}
        </h1>
      </Link>
      <div>
        <div className="flex items-center gap-3">
          <Rating rating={product.rating} />
          <div>{product.numReviews} Reviews</div>
        </div>

        <div className="font-bold mt- text-lg">${product.price}</div>
      </div>
      {product.countInStock === 0 ? (
        <button
          className=" bg-gray-400 text-white border-2 p-1 rounded flex justify-center items-center"
          disabled
        >
          Out of stock
        </button>
      ) : (
        <button
          onClick={addProduct}
          className="bg-blue-600 font-semibold text-white  p-1 rounded flex justify-center items-center hover:shadow-md hover:bg-white hover:text-blue-500 hover:border-2 border-blue-600"
        >
          Add to cart
        </button>
      )}
    </div>
  );
}
