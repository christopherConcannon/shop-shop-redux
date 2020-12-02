import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_PRODUCTS } from '../utils/queries';
import {
	removeFromCart,
	updateCartQuantity,
	addToCart,
	updateProducts
} from '../utils/actions';

import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';

import Cart from '../components/Cart';

function Detail() {
  // cache redux store
  const state = useSelector((state) => state);
  // destructure required variables
	const { products, cart } = state;

  // cache redux method to update store
	const dispatch = useDispatch();

  // get product id from url which was appended by Link wrapping ProductItem components
	const { id } = useParams();

  // initiate component level state to keep track of current product
	const [ currentProduct, setCurrentProduct ] = useState({});

  // make db query to get all products
	const { loading, data } = useQuery(QUERY_PRODUCTS);


  // NOTE...this is the same as in ProductList, except we're checking the redux store first
	useEffect(
		() => {
			// if products are already in global store
			if (products.length) {
        // update component level state of currentProduct to be the product object from the redux store whose id matches the one from the url 
				setCurrentProduct(products.find((product) => product._id === id));
				// if nothing was in global store, if there is any data retrieved from db on server, dispatch the action to update the products in the global store with the data from the db
			} else if (data) {
				dispatch(updateProducts(data.products));

        // also, cache the products from the db in indexedDb
				data.products.forEach((product) => {
					idbPromise('products', 'put', product);
				});
				// otherwise, if there is nothing in the redux store, and there is no internet connection (hence 'loading' is undefined in the useQuery() hook) get all the data from the cache in idb
			} else if (!loading) {
				idbPromise('products', 'get').then((indexedProducts) => {
          // use data from indexedDb to update redux global store for offline browsing 
					dispatch(updateProducts(indexedProducts));
				});
			}
		},
		[ products, data, loading, dispatch, id ]
	);

	const addItemToCart = () => {
		// find the cart item with the matching id
		const itemInCart = cart.find((cartItem) => cartItem._id === id);

		// if there was a match, call UPDATE with a new purchase quantity
		if (itemInCart) {
			dispatch(updateCartQuantity(id, (parseInt(itemInCart.purchaseQuantity) + 1)));
			// if we're updating quantity, use existing item data and increment purchaseQuantity value by one
			idbPromise('cart', 'put', {
				...itemInCart,
				purchaseQuantity : parseInt(itemInCart.purchaseQuantity) + 1
			});
		} else {
			dispatch(addToCart({ ...currentProduct, purchaseQuantity: 1 }));
			// if product isn't in the cart yet, add it to the current shopping cart in IndexedDB
			idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
		}
	};

	const removeItemFromCart = () => {
		dispatch(removeFromCart(currentProduct._id, cart));

		// upon removal from cart, delete the item from IndexedDB using the 'currentProduct._id' to locate what to remove
		idbPromise('cart', 'delete', { ...currentProduct });
	};

	return (
		<>
			{currentProduct ? (
				<div className="container my-1">
					<Link to="/">← Back to Products</Link>

					<h2>{currentProduct.name}</h2>

					<p>{currentProduct.description}</p>

					<p>
						<strong>Price:</strong>
						${currentProduct.price}{' '}
						<button onClick={addItemToCart}>Add to Cart</button>
						<button
							disabled={!cart.find((p) => p._id === currentProduct._id)}
							onClick={removeItemFromCart}
						>
							Remove from Cart
						</button>
					</p>

					<img
						src={`/images/${currentProduct.image}`}
						alt={currentProduct.name}
					/>
				</div>
			) : null}
			{loading ? <img src={spinner} alt="loading" /> : null}
			<Cart />
		</>
	);
}

export default Detail;
