import axios from 'axios';
import React, { useReducer } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { Store } from '../Store';
import { getError } from '../utils/getError';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
      break;
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
      break;
    case 'FETCH_FAILED':
      return { ...state, loading: false, error: action.payload };
      break;
    default:
      return state;
      break;
  }
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    orders: [],
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios('/api/orders/mine', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILED', payload: getError(error) });
      }
    };
    fetchData();
    console.log('error : ', error);
    console.log('loading : ', loading);
    console.log('orders : ', orders);
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="">
          <table className="mt-4 w-ful mx-auto">
            <thead>
              <tr>
                <th className="hidden sm:block">ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr className="border-b border-gray-300">
                  <td className="sm:px-12 hidden sm:block  pt-4 pb-1">
                    {order._id}
                  </td>
                  <td className="sm:px-12  px-3 pt-4 pb-1">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="sm:px-12  px-3 pt-4 pb-1">{order.totalPrice}</td>
                  <td className="sm:px-12  px-3 pt-4 pb-1">
                    {order.isPaid ? orders.paidAt : 'No'}
                  </td>
                  <td className="sm:px-12  px-3 pt-4 pb-1">
                    {order.isDelivered ? order.deliveredAt : 'No'}{' '}
                  </td>
                  <td className="sm:px-12  px-3 pt-4 pb-1">
                    <button
                      className="p-2 rounded-md bg-gray-200  "
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
