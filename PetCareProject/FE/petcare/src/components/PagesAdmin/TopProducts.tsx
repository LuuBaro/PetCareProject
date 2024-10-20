import React from "react";

const TopProducts = ({ products }) => {
    return (
      <div className="top-products">
        <h3 className="text-lg font-bold">Top Products</h3>
        <ul>
          {products.map(product => (
            <li key={product.id} className="p-2 flex items-center">
              <span style={{ backgroundColor: product.color }} className="w-4 h-4 mr-2"></span>
              {product.name} - {product.popularity}%
            </li>
          ))}
        </ul>
      </div>
    );
  };
export default TopProducts;  