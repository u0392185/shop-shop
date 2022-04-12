import React, { useEffect } from 'react';
import { idbPromise } from "../../utils/helpers";
import { UPDATE_PRODUCTS } from '../../actions';
import { useQuery } from '@apollo/client';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

import { useSelector, useDispatch } from 'react-redux'

function ProductList() {

  let currentCategory = useSelector((state) => state.currentCategory)
  let products = useSelector((state) => state.products)

  const dispatch = useDispatch()


  const { loading, data } = useQuery(QUERY_PRODUCTS);
  
  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      // since we're offline, get all of the data from the `products` store
      idbPromise('products', 'get').then((products) => {
        // use retrieved data to set global state for offline browsing
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      });
    } 
  }, [data, loading, dispatch]);
  
  function filterProducts() {
    if (!currentCategory) {

      return products;
    }
  
    return products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
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
