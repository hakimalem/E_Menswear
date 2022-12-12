import axios from 'axios';
import React, { useReducer } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import { getError } from '../utils/getError';
import { useContext } from 'react';
import { Store } from '../Store';

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
      return { ...state, loading: false, product: action.payload };
      break;
    case types.FETCH_FAILED:
      return { ...state, loading: false, error: action.payload };
      break;
    default:
      return state;
      break;
  }
};

export default function SingleProduct() {
  const [qty, setQty] = useState(1);
  console.log(qty);
  const navigate = useNavigate();
  const [{ product, loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const params = useParams();
  const { slug } = params;
  useEffect(() => {
    dispatch({ type: types.FETCH_REQUEST });
    axios
      .get(`/api/products/slug/${slug}`)
      .then((res) => {
        dispatch({ type: types.FETCH_SUCCESS, payload: res.data });
      })
      .catch((err) =>
        dispatch({
          type: types.FETCH_FAILED,
          payload: getError(err),
        })
      );
  }, []);

  const { state, dispatch: ctxDispatch, types: ctxTypes } = useContext(Store);

  const addToCart = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + +qty : +qty;
    try {
      const { data } = await axios(`/api/products/${product._id}`);
      console.log('quantity : ', quantity);
      console.log('stock : ', data.countInStock);
      if (quantity > data.countInStock) {
        window.alert('product ');
        return;
      }
      ctxDispatch({
        type: ctxTypes.ADD_TO_CART,
        payload: { ...product, quantity },
      });
    } catch (error) {
      console.log(error);
    }
    setQty(1);
    navigate('/cart');
  };

  return (
    <main className="min-h-screen">
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="flex justify-center items-center mt-10 ">
          <span className="px-4 py-2 bg-red-200 text-red-900 rounded-md">
            {error}
          </span>
        </div>
      ) : (
        <>
          <button
            onClick={() => navigate('/')}
            className="text-[#551a8b] mt-3 text-md font-bold cursor-pointer hover:text-orange-600"
          >
            Back to Home
          </button>
          <div className="flex p-4 flex-wrap justify-around ">
            <div className="md:basis-96 basis-full">
              <img src={product.image} alt="" />
            </div>

            <div className="flex flex-col gap-2  basis-full md:basis-60">
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1 className="text-lg font-bold my-5">{product.name}</h1>
              <div className="flex items-center gap-3">
                <Rating rating={product.rating} />
                <div>{product.numReviews} Reviews</div>
              </div>
              <div>Price : ${product.price}</div>
              Description : <div>{product.description}</div>
            </div>
            <div className="bg-[#f8f8f8] h-fit  border-2 py-5 px-3 mt-3 rounded-lg flex flex-col gap-2 basis-full md:basis-60">
              <div className="flex justify-between">
                <div>Price</div>
                <div className="text-xl font-bold">${product.price}</div>
              </div>
              <hr />
              <div className="flex justify-between">
                <div>Status</div>
                <div
                  className={`${
                    product.countInStock > 0 ? 'bg-green-600' : 'bg-red-600'
                  } text-white px-1 py-[2px] rounded-md`}
                >
                  {`${product.countInStock > 0 ? 'In Stock' : 'Unavailable'}`}
                </div>
              </div>

              {product.countInStock > 0 && (
                <>
                  <hr />

                  <div className="flex justify-between">
                    <div>Qty</div>
                    <div>
                      <select
                        className="py-2 px-4 focus:outline-none"
                        name="quantity"
                        id=""
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                      </select>
                    </div>
                  </div>
                  <hr />

                  <button
                    onClick={addToCart}
                    className="bg-yellow-400 w-full text-center p-2 rounded-lg border border-gray-400 hover:border-gray-900"
                  >
                    Add to card
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
