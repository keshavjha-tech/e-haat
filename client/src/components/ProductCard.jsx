import React from 'react'

function ProductCard({ product }) {

    if (!product) {
    return null; 
  }

    return (
        <div className="border rounded-lg p-4 transition-shadow hover:shadow-lg">
            <img 
            src={ProductCard.images[0]?.url} 
            alt={ProductCard.name} 
            className='w-full h-full object-cover'
            />
            <h2 className="font-semibold truncate">{product.name}</h2>
            <p className="text-lg font-bold">${product.price}</p>
        </div>
    )
}

export default ProductCard