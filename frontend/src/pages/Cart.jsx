import React, { useEffect } from 'react';
import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

export default function Cart() {
  const navigate = useNavigate();
  const { state, dispatch, types } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  let total = 0;
  state.cart.cartItems.map((item) => {
    total += item.quantity * item.price;
  });
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  // useEffect(() => {
  //   if (!state.userInfo) {
  //     navigate('/signin');
  //   }
  // });

  return (
    <div className="">
      <Helmet>
        <title>Shopping cart</title>
      </Helmet>
      <button
        onClick={() => navigate('/')}
        className="text-[#551a8b] text-md mt-3 font-bold cursor-pointer hover:text-orange-600"
      >
        Back to Home
      </button>
      <h1 className="text-4xl font-bold mt-10">Shopping cart</h1>
      {cartItems.length === 0 ? (
        <div className="mt-10 text-2xl ">
          Your cart is empty{' '}
          <Link
            className="text-[#551a8b] text-md font-bold cursor-pointer hover:text-orange-600"
            to="/"
          >
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="flex justify-center gap-5 items-center mt-5 flex-wrap">
          <div className="w-full md:w-auto md:h-96 md:overflow-scroll">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between sm:gap-16 border p-3 rounded-md"
              >
                <div className="flex items-center">
                  <Link to={`/products/slug/${item.slug}`}>
                    <img
                      src={item.image}
                      className="w-20 p-1 border rounded-md"
                      alt=""
                    />
                  </Link>
                  <Link
                    to={`/products/slug/${item.slug}`}
                    className="text-[#551a8b] hidden sm:block text-md font-bold cursor-pointer w-44 hover:text-orange-600"
                  >
                    {item.name}
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    disabled={item.quantity === item.countInStock}
                    onClick={() => {
                      dispatch({
                        type: types.ADD_TO_CART,
                        payload: { ...item, quantity: item.quantity + 1 },
                      });
                    }}
                    className={`scale-125 p-2 ${
                      item.quantity === item.countInStock
                        ? 'text-gray-500'
                        : 'hover:scale-150'
                    } `}
                  >
                    <FaPlusCircle />
                  </button>
                  <div>{item.quantity}</div>
                  <button
                    disabled={item.quantity === 1}
                    onClick={() => {
                      dispatch({
                        type: types.ADD_TO_CART,
                        payload: { ...item, quantity: item.quantity - 1 },
                      });
                    }}
                    className={`scale-125 p-2 ${
                      item.quantity === 1 ? 'text-gray-500' : 'hover:scale-150'
                    } `}
                  >
                    <FaMinusCircle />
                  </button>
                </div>
                <div className="w-10 text-xl">${item.price}</div>
                <button
                  onClick={() => {
                    dispatch({
                      type: types.DELETE_ITEM,
                      payload: { _id: item._id },
                    });
                  }}
                  className="scale-125 p-2 hover:scale-150"
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
          <div className="border p-7 h-fit basis-full md:basis-auto sticky  md:relative z-10 bg-white w-full md:w-fit bottom-0">
            <h1 className="text-3xl">
              Subtotal (
              {state.cart.cartItems.reduce((a, c) => {
                return a + c.quantity;
              }, 0)}{' '}
              items) :
            </h1>
            <div className="text-4xl font-bold">${total}</div>
            <hr className="my-3" />
            <button
              onClick={checkoutHandler}
              className="w-full px-3 py-2 bg-yellow-400 rounded-sm hover:border border-black font-semibold"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
