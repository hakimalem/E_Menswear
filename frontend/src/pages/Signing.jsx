import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
export default function Signing() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch, types } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: types.SIGN_IN, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div className="min-h-screen flex justify-center mt-16 md:mt-0 md:items-center">
      <Helmet>
        <title>Sign in</title>
      </Helmet>
      <div className="">
        <h1 className="text-4xl font-bold mb-6">Sign in </h1>
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-5"
          action=""
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="email">
              Email :{' '}
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border focus:outline-none px-3 py-2 rounded-md"
              type="email"
              id="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="password">
              Password :{' '}
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border focus:outline-none px-3 py-2 rounded-md"
              type="password"
              id="password"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 hover:border-black px-3 py-2 w-fit rounded-md border"
          >
            Sign in
          </button>
          <div>
            New Customer ?{' '}
            <Link
              className="text-blue-500 hover:underline transition"
              to={`/signup?redirect=${redirect}`}
            >
              Create your account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
