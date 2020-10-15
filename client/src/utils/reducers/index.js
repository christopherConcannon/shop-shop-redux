import { combineReducers } from 'redux';

import productsReducer from './productsReducer'
import categoriesReducer from './categoriesReducer'
import cartReducer from './cartReducer'

const allReducer = combineReducers({
  productsReducer,
  categoriesReducer,
  cartReducer 
  // products: productsReducer,
  // categories: categoriesReducer,
  // cart: cartReducer 
})

export default allReducer;