import React from 'react';
import { useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { MdKeyboardArrowDown } from 'react-icons/md';

export default function Header() {
  const { state, types, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: types.SIGN_OUT });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymnentMethod');
    window.location.href = '/signin';
  };

  return (
    <div className="navbar bg-[#1d2123] text-white">
      <div className="flex-1 px-2 lg:flex-none">
        <Link to="/" className="text-3xl font-bold">
          E-menswear
        </Link>
      </div>
      <div className="flex justify-end flex-1 px-2">
        <div className="flex items-stretch">
          {/* <a className="btn btn-ghost rounded-btn">Button</a> */}
          <Link to="/cart" className="btn btn-ghost rounded-btn">
            Cart
            {cart.cartItems.length > 0 && (
              <div className="py-[1px] text-sm px-2 ml-2 bg-red-700 inline-flex justify-center items-center text-white rounded-full">
                {cart.cartItems.reduce((a, c) => {
                  return a + c.quantity;
                }, 0)}
              </div>
            )}
          </Link>
          {userInfo ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost rounded-btn flex">
                <div> {userInfo.name}</div>
                <div className="hidden sm:block">
                  <MdKeyboardArrowDown />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4 text-black"
              >
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/orderhistory">Orders history</Link>
                </li>
                <hr />
                <li>
                  <Link to="#signout" onClick={signoutHandler}>
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/signin" className="btn btn-ghost rounded-btn">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
