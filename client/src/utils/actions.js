// import {
//   UPDATE_CATEGORIES,
//   UPDATE_CURRENT_CATEGORY,
//   // UPDATE_PRODUCTS,
//   // ADD_TO_CART,
//   // ADD_MULTIPLE_TO_CART,
//   // REMOVE_FROM_CART,
//   // UPDATE_CART_QUANTITY,
//   // CLEAR_CART,
//   // TOGGLE_CART
// } from './constants'

export const UPDATE_CATEGORIES = "UPDATE_CATEGORIES";
export const UPDATE_CURRENT_CATEGORY = "UPDATE_CURRENT_CATEGORY";
export const UPDATE_PRODUCTS = "UPDATE_PRODUCTS";
export const ADD_TO_CART = "ADD_TO_CART";
export const ADD_MULTIPLE_TO_CART = "ADD_MULTIPLE_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART_QUANTITY = "UPDATE_CART_QUANTITY";
export const CLEAR_CART = "CLEAR_CART";
export const TOGGLE_CART = "TOGGLE_CART";



export const updateCategories = (categories) => {
  return {
    type: UPDATE_CATEGORIES,
    categories
  }
}

export const updateCurrentCategory = (id) => {
  return {
    type: UPDATE_CURRENT_CATEGORY,
    currentCategory: id
  }
}

export const updateProducts = (products) => {
  return {
    type: UPDATE_PRODUCTS,
    products
  }
}

export const addToCart = (product) => {
  return {
    type: ADD_TO_CART,
    product 
  }
}

export const updateCartQuantity = (id, purchaseQuantity) => {
  return {
    type: UPDATE_CART_QUANTITY,
    _id: id,
    purchaseQuantity
  }
}





