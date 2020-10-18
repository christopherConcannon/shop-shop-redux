import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { updateProducts } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

import ProductItem from '../ProductItem';

function ProductList() {
	const state = useSelector((state) => state);
	const dispatch = useDispatch();

	const { currentCategory } = state;

	const { loading, data } = useQuery(QUERY_PRODUCTS);

	useEffect(
		() => {
			// if there's data to be stored
			if (data) {
				// store it in the global state object
				dispatch(updateProducts(data.products));

				// also take each product and save it to the IndexedDB using the helper function
				data.products.forEach((product) => {
					idbPromise('products', 'put', product);
				});
				// add else if to check if 'loading' is undefined in 'useQuery()' hook. ie no internet connection to server
			} else if (!loading) {
				// since we're offline, get all of the data from the 'products' store
				idbPromise('products', 'get').then((products) => {
					// use retrieved data to set global state for offline browsing
					dispatch(updateProducts(products));
				});
			}
		},
		[ data, loading, dispatch ]
	);

	function filterProducts() {
		if (!currentCategory) {
			return state.products;
		}

		return state.products.filter(
			(product) => product.category._id === currentCategory
		);
	}

	return (
		<div className="my-2">
			<h2>Our Products:</h2>
			{state.products.length ? (
				<div className="flex-row">
					{filterProducts().map((product) => (
						<ProductItem
							key={product._id}
							_id={product._id}
							image={product.image}
							name={product.name}
							price={product.price}
							quantity={product.quantity}
						/>
					))}
				</div>
			) : (
				<h3>You haven't added any products yet!</h3>
			)}
			{loading ? <img src={spinner} alt="loading" /> : null}
		</div>
	);
}

export default ProductList;
