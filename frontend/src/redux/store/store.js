import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';

let store;
let initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
  }
};

//? develeopment halindeyken thunk ve  devtools kullan - build durumundayken sadece thunk kullan
//! development konumunda
if (process.env.NODE_ENV === 'development') {
  // store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  store = createStore(rootReducer, initialState, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
  //! build durumunda
} else {
  // store = createStore(rootReducer)
  store = createStore(rootReducer, initialState, applyMiddleware(thunk));
}

// const store = createStore(rootReducer, applyMiddleware(thunk));

store.subscribe(() => {
  console.log(store.getState());
});

//! chrome'da extension'da state'leri görebiliyoruz.
// store.dispatch({ type: actionTypes.FETCH_ALL_POSTS });

export default store;
