import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useReducer } from 'react';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import Loading from '../components/Loading';
import { Store } from '../Store';
import { getError } from '../utils/getError';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
      break;
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
      break;
    case 'CREATE_FAILED':
      return { ...state, loading: false };
      break;
    default:
      return state;
      break;
  }
};

export default function PlaceOrder() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, { loading: false });
  const {
    state: { cart, userInfo },
    dispatch: ctxDispatch,
    types,
  } = useContext(Store);
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, cart]);
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: types.CART_CLEAR });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: 'CREATE_FAILED' });
      console.log(error);
      toast.error(getError(error));
    }
  };

  return (
    <div className="">
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1 className="text-4xl mt-3 font-bold">Preview Order</h1>
      {state.loading ? (
        <Loading />
      ) : (
        <div className="my-6 p-4 md:flex gap-4">
          <div className="flex flex-col gap-3  md:p-0 flex-1">
            <div className="border border-2 p-5 rounded-md flex flex-col gap-1">
              <h3 className="text-2xl font-semibold">Shipping</h3>
              <div>
                <strong>Name : </strong> {cart.shippingAddress.fullName}
              </div>
              <div>
                <strong>Address : </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}{' '}
              </div>
              <Link className="text-blue-700 hover:underline" to="/shipping">
                Edit
              </Link>
            </div>
            <div className="border border-2 p-5 rounded-md flex flex-col gap-1">
              <h3 className="text-2xl font-semibold">Payment</h3>
              <div>
                <strong>Method : </strong> {cart.paymentMethod}
              </div>
              <Link className="text-blue-700 hover:underline" to="/payment">
                Edit
              </Link>
            </div>
            <div className="border border-2 p-5 rounded-md flex flex-col gap-1">
              <h3 className="text-2xl font-semibold">Items</h3>
              <div className="flex flex-col gap-2">
                {cart.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt=""
                        className="w-14 border p-1"
                      />
                      <Link
                        to={`/products/slug/${item.slug}`}
                        className="w-36 text-[#551a8b] cursor-pointer hover:text-orange-600"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div>{item.quantity}</div>
                    <div className="w-12">${item.price}</div>
                  </div>
                ))}
              </div>

              <Link className="text-blue-700 hover:underline" to="/cart">
                Edit
              </Link>
            </div>
          </div>
          <div className="flex h-fit flex-col rounded-md px-4 py-2 md:p-4 border-2 mt-5 md:mt-0 sticky bottom-0 z-10 bg-white">
            <h1>Order summary</h1>
            <div className=" flex flex-col gap-1 md:gap-4">
              <div className="flex justify-between border-b p-2">
                <div>Items</div>
                <div>{cart.itemsPrice.toFixed(2)}</div>
              </div>
              <div className="flex justify-between border-b p-2">
                <div>Shipping</div>
                <div>{cart.shippingPrice}</div>
              </div>
              <div className="flex justify-between border-b p-2">
                <div>Tax</div>
                <div>{cart.taxPrice}</div>
              </div>
              <div className="flex justify-between border-b p-2 font-semibold">
                <div>Order Total</div>
                <div>{cart.totalPrice}</div>
              </div>
              <button
                onClick={placeOrderHandler}
                className="bg-yellow-500 mx-auto hover:border-black px-28 py-2 w-fit rounded-md border"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
