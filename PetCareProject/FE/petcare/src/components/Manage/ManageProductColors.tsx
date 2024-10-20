import React, { useState, useEffect } from 'react';
import ProductColorsService from '../../service/ProductColorsService';
import ProductDetailService from '../../service/ProductDetailService'; // Import service to load product details

const ProductColorManager = () => {
  const [colors, setColors] = useState([]); // State for managing product colors
  const [productDetails, setProductDetails] = useState([]); // State for managing product details list
  const [formData, setFormData] = useState({ colorName: '', productDetailId: '' });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadColors();
    loadProductDetails(); // Load product details on component mount
  }, []);

  const loadColors = async () => {
    setLoading(true);
    try {
      const response = await ProductColorsService.getAllProductColors();
      setColors(response.data); // Assuming response.data contains the list of colors
    } catch (error) {
      console.error('Error loading product colors', error);
    }
    setLoading(false);
  };

  const loadProductDetails = async () => {
    try {
      const response = await ProductDetailService.getAllProductDetails();
      setProductDetails(response); // Assuming response is the list of product details
    } catch (error) {
      console.error('Error loading product details', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        await ProductColorsService.saveProductColor({
          productColorId: editId, // Include the ID for updating
          colorName: formData.colorName,
          productDetail: { productDetailId: formData.productDetailId }, // Assuming you have the productDetailId available
        });
        setEditMode(false);
      } else {
        await ProductColorsService.saveProductColor({
          colorName: formData.colorName,
          productDetail: { productDetailId: formData.productDetailId },
        });
      }
      setFormData({ colorName: '', productDetailId: '' });
      loadColors(); // Reload the colors after adding or updating
    } catch (error) {
      console.error('Error saving product color', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this color?')) {
      try {
        await ProductColorsService.deleteProductColor(id);
        loadColors(); // Reload the colors after deletion
      } catch (error) {
        console.error('Error deleting product color', error);
      }
    }
  };

  const handleEdit = (color) => {
    setFormData({
      colorName: color.colorName,
      productDetailId: color.productDetail.productDetailId,
    });
    setEditId(color.productColorId);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({ colorName: '', productDetailId: '' });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Color Manager</h1>

      {/* Form for Adding/Editing Colors */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Color Name</label>
          <input
            type="text"
            name="colorName"
            value={formData.colorName}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border rounded"
            placeholder="Enter color name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Product Detail</label>
          <select
            name="productDetailId"
            value={formData.productDetailId}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Select a product detail</option>
            {productDetails.map((detail) => (
              <option key={detail.productDetailId} value={detail.productDetailId}>
                {detail.products.productName} - {detail.quantity} - {detail.price}
              </option>
            ))}
          </select>
        </div>

        <div className="space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (editMode ? 'Updating...' : 'Saving...') : editMode ? 'Update Color' : 'Save Color'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Table of Product Colors */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Color Name</th>
            <th className="py-2 px-4 border-b">Product Detail</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {colors.map((color) => (
            <tr key={color.productColorId}>
              <td className="py-2 px-4 border-b">{color.colorName}</td>
              <td className="py-2 px-4 border-b">
                {color.productDetail.products.productName} - {color.productDetail.quantity} - {color.productDetail.price}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEdit(color)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(color.productColorId)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductColorManager;
