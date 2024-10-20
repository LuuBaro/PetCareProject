import React, { useState, useEffect } from 'react';
import ProductSizesService from '../../service/ProductSizesService'; // Import for product sizes
import ProductDetailService from '../../service/ProductDetailService'; // Import for product details

const ProductSizeManager = () => {
  const [sizes, setSizes] = useState([]); // State for managing product sizes
  const [productDetails, setProductDetails] = useState([]); // State for managing product details
  const [formData, setFormData] = useState({ sizeName: '', productDetailId: '' });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadSizes();
    loadProductDetails(); // Load product details on component mount
  }, []);

  const loadSizes = async () => {
    setLoading(true);
    try {
      const response = await ProductSizesService.getAllProductSizes();
      setSizes(response); // Directly set response if it's already the data you need
    } catch (error) {
      console.error('Error loading product sizes', error);
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
      const productSizeData = {
        sizeName: formData.sizeName,
        productDetail: { productDetailId: formData.productDetailId },
      };

      if (editMode) {
        // Update mode
        await ProductSizesService.saveProductSize({ ...productSizeData, productSizeId: editId });
        setEditMode(false);
      } else {
        // Create new size
        await ProductSizesService.saveProductSize(productSizeData);
      }
      setFormData({ sizeName: '', productDetailId: '' });
      loadSizes(); // Reload the sizes after adding or updating
    } catch (error) {
      console.error('Error saving product size', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this size?')) {
      try {
        await ProductSizesService.deleteProductSize(id);
        loadSizes(); // Reload the sizes after deletion
      } catch (error) {
        console.error('Error deleting product size', error);
      }
    }
  };

  const handleEdit = (size) => {
    setFormData({
      sizeName: size.sizeName,
      productDetailId: size.productDetail.productDetailId,
    });
    setEditId(size.productSizeId); // Change to productSizeId
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({ sizeName: '', productDetailId: '' });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Size Manager</h1>

      {/* Form for Adding/Editing Sizes */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Size Name</label>
          <input
            type="text"
            name="sizeName"
            value={formData.sizeName}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border rounded"
            placeholder="Enter size name"
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
            {loading ? (editMode ? 'Updating...' : 'Saving...') : editMode ? 'Update Size' : 'Save Size'}
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

      {/* Table of Product Sizes */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Size Name</th>
            <th className="py-2 px-4 border-b">Product Detail</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((size) => (
            <tr key={size.productSizeId}> {/* Change to productSizeId */}
              <td className="py-2 px-4 border-b">{size.sizeName}</td>
              <td className="py-2 px-4 border-b">
                {size.productDetail.products.productName} - {size.productDetail.quantity} - {size.productDetail.price}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEdit(size)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(size.productSizeId)} // Change to productSizeId
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

export default ProductSizeManager;
