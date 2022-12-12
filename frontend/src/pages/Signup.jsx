import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function Signup() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPass, setConfPass] = useState('');

  const { state, dispatch: ctxDispatch, types } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confPass) {
      toast.error('passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/signup', {
        name,
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
    <div className="min-h-screen flex justify-center mt-16 ">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className="w-4/5 md:w-2/5">
        <h1 className="text-4xl font-bold mb-6">Sign up</h1>
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4"
          action=""
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="name">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border focus:outline-none px-3 py-2 rounded-md"
              id="name"
              type="text"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border focus:outline-none px-3 py-2 rounded-md"
              id="email"
              type="email"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border focus:outline-none px-3 py-2 rounded-md"
              id="password"
              type="password"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="cpass">
              Confirm Password
            </label>
            <input
              value={confPass}
              onChange={(e) => setConfPass(e.target.value)}
              className="border focus:outline-none px-3 py-2 rounded-md"
              id="cpass"
              type="password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 hover:border-black px-3 py-2 w-fit rounded-md border"
          >
            Sign up
          </button>
          <div>
            Already have account ?{' '}
            <Link
              className="text-blue-500 hover:underline transition"
              to={`/signin?redirect=${redirect}`}
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
