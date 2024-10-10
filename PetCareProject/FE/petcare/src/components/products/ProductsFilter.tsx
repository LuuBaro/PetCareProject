import React, { useState } from 'react';

const Filter = ({ onFilterChange }) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
    onFilterChange({ brand: event.target.value, priceRange: selectedPriceRange });
  };

  const handlePriceRangeChange = (event) => {
    setSelectedPriceRange(event.target.value);
    onFilterChange({ brand: selectedBrand, priceRange: event.target.value });
  };

  return (
    <div className="filter">
      {/* Brand filter */}
      <select value={selectedBrand} onChange={handleBrandChange}>
        <option value="">Tất cả thương hiệu</option>
        <option value="Khác">Khác</option>
        <option value="ROYAL CANIN">ROYAL CANIN</option>
      </select>

      {/* Price range filter */}
      <select value={selectedPriceRange} onChange={handlePriceRangeChange}>
        <option value="">Tất cả giá</option>
        <option value="0-100000">Dưới 100.000₫</option>
        <option value="100000-200000">100.000₫ - 200.000₫</option>
        {/* ... other price ranges ... */}
      </select>
    </div>
  );
};

export default Filter;