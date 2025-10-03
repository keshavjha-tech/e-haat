import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import ProductCard from '@/components/ProductCard';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState();

  useEffect(()=> {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance({
          ...summaryApi.products
        })
      } catch (error) {
        console.error("Failed to fetch products: ", error);
        
      }
    }
  })
  return (
    <div className='container mx-auto p-4'>
      {/* <h1 className='text-3xl font-bold mb-6'>Featured Products</h1>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          {products.map((product) => (
            <Link to={`/product/${product._id}`} key={product-_id}> 
              <ProductCard product={[product]}/>
              
            </Link>
          ))}
      </div> */}
    </div>
  )
}

export default Home