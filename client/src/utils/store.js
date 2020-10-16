import { createStore } from 'redux';

// import reducer from './reducer';
import allReducer from './reducers'

// const initialState =   {
//   products        : [],
//   cart            : [],
//   cartOpen        : false,
//   categories      : [],
//   currentCategory : ''
// }

// const store = createStore(reducer,
const store = createStore(allReducer,
  // initialState

  // jic placeholder for preloadedState so dev tools config line below won't be misconstrued
  // undefined,
 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

export default store;

