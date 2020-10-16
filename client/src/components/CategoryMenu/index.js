import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { updateCategories, updateCurrentCategory } from '../../utils/actionCreators';
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {


  //  NOT SURE WHY BUT categoryData IS AN OBJECT WITH THE CATEGORIES ARRAY AS IT'S ONLY PROPERTY.  SO WHEN IT GETS DISPATCHED TO REDUX GLOBAL STATE IT IS ENCLOSED IN AN OBJECT SO TO ACCESS THE ARRAY I HAVE TO DRILL DOWN AN EXTRA LEVEL INTO THE STATE PROPERTIES TO GET AN ARRAY WHICH I CAN MAP OVER AND AVOID .MAP() IS NOT A FUNCTION ERROR

	// get data from DB with Apollo
	const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
	// console.log('categoryData: ', categoryData);
	// console.log('categoryData.categories: ', categoryData.categories);
	// console.log('categoryData.categories.categories: ', categoryData.categories.categories);

  // // TESTING
  // const state = useSelector((state) => state);
  // console.log('redux state: ', state);


	// const { categories } = useSelector((state) => state.categories);
	const { categories } = useSelector((state) => state);
	// console.log('categories from state: ', categories);

	const dispatch = useDispatch();

	useEffect(
		() => {
			// if categoryData exists or has changed from the response of useQuery, then run dispatch()
			if (categoryData) {
        // execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
        dispatch(updateCategories(categoryData.categories));
				// also write to IndexedDB
				categoryData.categories.forEach((category) => {
					idbPromise('categories', 'put', category);
				});
			} else if (!loading) {
				idbPromise('categories', 'get').then((categories) => {
          dispatch(updateCategories(categories));
				});
			}
		},
		[ categoryData, loading, dispatch ]
	);

	const handleClick = (id) => {
    dispatch(updateCurrentCategory(id));
	};

	return (
		<div>
			<h2>Choose a Category:</h2>

			{categories ? (
				categories.map((item) => (
					<button
						key={item._id}
						onClick={() => {
							handleClick(item._id);
						}}
					>
						{item.name}
					</button>
				))
			) : null}

			{/* {categories.map((item) => (
				<button
					key={item._id}
					onClick={() => {
						handleClick(item._id);
					}}
				>
					{item.name}
				</button>
			))}  */}
		</div>
	);
}

export default CategoryMenu;
