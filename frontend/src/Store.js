import { createContext, useReducer } from 'react';

export const Store = createContext();
const types = {
  ADD_TO_CART: 'ADD_TO_CART',
  DELETE_ITEM: 'DELETE_ITEM',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  SAVE_SHIPPING_ADDRESS: 'SAVE_SHIPPING_ADDRESS',
  SAVE_PAYMENT: 'SAVE_PAYMENT',
  CART_CLEAR: 'CART_CLEAR',
};
const initialState = {
  userInfo: JSON.parse(localStorage.getItem('userInfo')),
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.ADD_TO_CART:
      {
        const newItem = action.payload;
        const existItem = state.cart.cartItems.find(
          (item) => item._id === newItem._id
        );
        const cartItems = existItem
          ? state.cart.cartItems.map((item) =>
              item._id === newItem._id ? newItem : item
            )
          : [...state.cart.cartItems, newItem];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return {
          ...state,
          cart: {
            ...state.cart,
            cartItems,
          },
        };
      }
      break;
    case types.DELETE_ITEM:
      {
        const cartItems = state.cart.cartItems.filter((item) => {
          return item._id !== action.payload._id;
        });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return {
          ...state,
          cart: {
            ...state.cart,
            cartItems,
          },
        };
      }
      break;
    case types.SIGN_IN:
      {
        return {
          ...state,
          userInfo: action.payload,
        };
      }
      break;
    case types.SIGN_OUT:
      {
        return {
          ...state,
          cart: { ...state.cart, shippingAddress: [], cartItems: [] },
          userInfo: null,
        };
      }
      break;
    case types.SAVE_SHIPPING_ADDRESS:
      {
        return {
          ...state,
          cart: { ...state.cart, shippingAddress: action.payload },
        };
      }
      break;
    case types.SAVE_PAYMENT: {
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    }
    case types.CART_CLEAR: {
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      };
    }
    default:
      return state;
      break;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch, types }}>
      {children}
    </Store.Provider>
  );
};
