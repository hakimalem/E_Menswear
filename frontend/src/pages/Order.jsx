import axios from 'axios';
import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import { Store } from '../Store';
import { getError } from '../utils/getError';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
      break;
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
      break;
    case 'FETCH_FAILED':
      return { ...state, loading: false, error: action.payload };
      break;
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
      break;
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, succesPay: true };
      break;
    case 'PAY_FAILED':
      return { ...state, loadingPay: false };
      break;
    case 'PAY_RESET':
      return { ...state, loadingPay: false, succesPay: false };

    default:
      break;
  }
};

export default function Order() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo, cart } = state;
  const [{ loading, error, order, loadingPay, succesPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      loadingPay: false,
      succesPay: false,
    });
  const params = useParams();
  const { id: orderId } = params;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderId) => {
        return orderId;
      });
  };
  const onApprove = (data, actions) => {
    actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = axios.put(`/api/orders/${orderId}/pay`, details, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (error) {
        dispatch({ type: 'PAY_FAILED' });
        toast.error(getError(error));
      }
    });
  };

  const onError = (error) => {
    toast.error(error);
  };
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILED', payload: getError(error) });
      }
    };
    if (!userInfo) {
      navigate('/login');
    }
    if (!order._id || succesPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (succesPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo}` },
        });

        paypalDispatch({
          //   type: 'resetOptions',
          'client-id': clientId,
          currency: 'USD',
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, navigate, orderId, userInfo, paypalDispatch]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="mt-4">
          <Helmet>
            <title>Order {orderId}</title>
          </Helmet>
          <h1 className="text-2xl font-semibold">
            Order <span>{orderId}</span>
          </h1>
          <div className="mb-6 p-4 md:flex gap-4">
            <div className="flex flex-col gap-3  md:p-0 flex-1">
              <div className="border border-2 p-5 rounded-md flex flex-col gap-1">
                <h3 className="text-2xl font-semibold">Shipping</h3>
                <div>
                  <strong>Name : </strong> {order.shippingAddress.fullName}
                </div>
                <div>
                  <strong>Address : </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}{' '}
                </div>
                {order.isDelivered ? (
                  <div className="alert alert-success shadow-lg">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span> Delivered at {order.deliveredAt}</span>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-error shadow-lg">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Not delivered</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="border border-2 p-5 rounded-md flex flex-col gap-1">
                <h3 className="text-2xl font-semibold">Payment</h3>
                <div>
                  <strong>Method : </strong> {order.paymentMethod}
                </div>
                {order.isPaid ? (
                  <div className="alert alert-success shadow-lg">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span> Paid at {order.paidAt}</span>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-error shadow-lg">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Not paid</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="border border-2 p-5 rounded-md flex flex-col gap-1">
                <h3 className="text-2xl font-semibold">Items</h3>
                <div className="flex flex-col gap-2">
                  {order.orderItems.map((item) => (
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
              </div>
            </div>
            <div className="flex h-fit flex-col rounded-md px-4 py-2 md:py-4 md:w-80 border-2 mt-5 md:mt-0 sticky bottom-0 z-10 bg-white">
              <h1>Order summary</h1>
              <div className=" flex flex-col gap-1 md:gap-4">
                <div className="flex justify-between border-b p-2">
                  <div>Items</div>
                  <div>{order.itemsPrice.toFixed(2)}</div>
                </div>
                <div className="flex justify-between border-b p-2">
                  <div>Shipping</div>
                  <div>{order.shippingPrice}</div>
                </div>
                <div className="flex justify-between border-b p-2">
                  <div>Tax</div>
                  <div>{order.taxPrice}</div>
                </div>
                <div className="flex justify-between border-b p-2 font-semibold">
                  <div>Order Total</div>
                  <div>{order.totalPrice}</div>
                </div>
                <div>
                  {!order.isPaid && (
                    <div>
                      {isPending ? (
                        <div>Loading</div>
                      ) : (
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <div>Loading ... </div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
