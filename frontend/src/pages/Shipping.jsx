import React, { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function Shipping() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch, types } = useContext(Store);
  const { userInfo } = state;
  const { shippingAddress } = state.cart;
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: types.SAVE_SHIPPING_ADDRESS,
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate('/payment');
  };
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  });
  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <div className="px-5 pt-6 md:px-40 lg:px-60 md:pt-0">
        <h1 className="text-4xl font-bold my-4">Shipping Address</h1>
        <form
          className="flex flex-col gap-4 mb-3"
          action=""
          onSubmit={submitHandler}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="fullname">Full Name</label>
            <input
              className="focus:outline-none border border-gray-400 rounded-md px-3 py-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              id="fullname"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="address">Address</label>
            <input
              className="focus:outline-none border border-gray-400 rounded-md px-3 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              id="address"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="city">City</label>
            <input
              className="focus:outline-none border border-gray-400 rounded-md px-3 py-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              id="city"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="postalcode">Postal Code</label>
            <input
              className="focus:outline-none border border-gray-400 rounded-md px-3 py-2"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              type="text"
              id="postalcode"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="country">Country</label>
            <input
              className="focus:outline-none border border-gray-400 rounded-md px-3 py-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              type="text"
              id="country"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 px-3 py-2 w-fit rounded-md border-black border"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
