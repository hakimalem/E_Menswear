import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function Payment() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch, types } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  const [payment, setPayment] = useState(paymentMethod || 'paypal');
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: types.SAVE_PAYMENT, payload: payment });
    localStorage.setItem('payment', payment);
    navigate('/placeorder');
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  return (
    <div className="">
      <Helmet>
        <title>Payment</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 />
      <div className="flex justify-center">
        <div className="mt-4">
          <h1 className="text-4xl font-bold mb-5">Payment Method</h1>
          <form
            onSubmit={submitHandler}
            className="flex flex-col gap-2 text-lg font-semibold"
            action=""
          >
            <div className="flex gap-2">
              <input
                onChange={(e) => setPayment(e.target.value)}
                name="payment"
                id="stripe"
                type="radio"
                value="stripe"

              />
              <label htmlFor="stripe">Stripe</label>
            </div>
            <div className="flex gap-2">
              <input
                onChange={(e) => setPayment(e.target.value)}
                name="payment"
                id="paypal"
                type="radio"
                value="paypal"
                checked
              />
              <label htmlFor="paypal">Paypal</label>
            </div>
            <button
              type="submit"
              className="bg-yellow-500 text-base hover:border-black px-2 py-1 w-fit rounded-md border"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
