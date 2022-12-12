import React from 'react';

export default function CheckoutSteps(props) {
  return (
    <div className="flex justify-between  md:font-semibold md:text-lg p-1">
      <div
        className={`${
          props.step1
            ? 'border-[#f08000] text-[#f08000]'
            : 'border-[#a0a0a0] text-[#a0a0a0]'
        } border-b flex-1 p-1`}
      >
        Sign in
      </div>
      <div
        className={`${
          props.step2
            ? 'border-[#f08000] text-[#f08000]'
            : 'border-[#a0a0a0] text-[#a0a0a0]'
        } border-b flex-1 p-1`}
      >
        Shipping
      </div>
      <div
        className={`${
          props.step3
            ? 'border-[#f08000] text-[#f08000]'
            : 'border-[#a0a0a0] text-[#a0a0a0]'
        } border-b flex-1 p-1`}
      >
        Payment
      </div>
      <div
        className={`${
          props.step4
            ? 'border-[#f08000] text-[#f08000]'
            : 'border-[#a0a0a0] text-[#a0a0a0]'
        } border-b flex-1 p-1`}
      >
        Place Order
      </div>
    </div>
  );
}
