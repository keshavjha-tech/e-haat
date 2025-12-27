import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchProducts = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      
      // Update URL params
      setSearchParams({ q: query });

      const res = await axiosInstance({
        ...summaryApi.products,
        params: {
          page: 1,
          limit: 50,
          // Note: Backend needs to support search query parameter
          // For now, we'll fetch all and filter client-side
        }
      });

      if (res?.data?.statusCode === 200) {
        const allProducts = res.data.data.products || [];
        // Client-side filtering (backend should ideally handle this)
        const filtered = allProducts.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
      }
    } catch (error) {
      console.error("Search failed: ", error);
      toast.error("Failed to search products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      searchProducts(query);
    }
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (query) => {
    searchProducts(query);
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-6'>
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
      </div>

      {loading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-xl'>Searching...</div>
        </div>
      ) : hasSearched ? (
        <>
          <div className='mb-4'>
            <h2 className='text-2xl font-semibold'>
              {products.length > 0 
                ? `Found ${products.length} product${products.length > 1 ? 's' : ''}`
                : 'No products found'}
            </h2>
            {searchQuery && (
              <p className='text-gray-500'>Search results for "{searchQuery}"</p>
            )}
          </div>
          
          {products.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No products match your search.</p>
              <p className='text-gray-400 mt-2'>Try different keywords or browse all products.</p>
            </div>
          )}
        </>
      ) : (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>Start typing to search for products...</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage