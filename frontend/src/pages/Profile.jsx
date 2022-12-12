import axios from 'axios';
import React, { useReducer, useState } from 'react';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils/getError';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loading: true };
      break;
    case 'UPDATE_SUCCESS':
      return { ...state, loading: false };
      break;
    case 'UPDATE_FAILED':
      return { ...state, loading: false };
      break;
    default:
      return state;
      break;
  }
};

export default function Profile() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_REQUEST' });
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      ctxDispatch({ type: 'SIGN_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Your infos has updated successfully');

      dispatch({ type: 'UPDATE_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'UPDATE_FAILED' });
      toast.error(getError(error));
    }
  };
  return (
    <div className="sm:w-1/3 w-2/3 mt-6 mx-auto">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <form className="flex flex-col gap-4 " action="" onSubmit={submitHandler}>
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            className="focus:outline-none border border-gray-400 rounded-md px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            className="focus:outline-none border border-gray-400 rounded-md px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            className="focus:outline-none border border-gray-400 rounded-md px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirm">Confirm password</label>
          <input
            className="focus:outline-none border border-gray-400 rounded-md px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            id="confirm"
            
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-500 px-3 py-2 w-fit rounded-md border-black border"
        >
          Update
        </button>
      </form>
    </div>
  );
}
