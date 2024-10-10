import React, { useState, useEffect } from 'react';
import WeightsService from '../../service/WeightsService'; // Import for weights service
import ProductDetailService from '../../service/ProductDetailService'; // Import for product details

const ManageWeights = () => {
  const [weights, setWeights] = useState([]); // State for managing weights
  const [productDetails, setProductDetails] = useState([]); // State for managing product details
  const [formData, setFormData] = useState({ weightValue: '', productDetailId: '' });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadWeights();
    loadProductDetails(); // Load product details on component mount
  }, []);

  const loadWeights = async () => {
    setLoading(true);
    try {
      const response = await WeightsService.getAllWeights();
      setWeights(response); // Directly set response if it's already the data you need
    } catch (error) {
      console.error('Error loading weights', error);
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
      const weightData = {
        weight_value: formData.weightValue,
        productDetail: { productDetailId: formData.productDetailId },
      };

      if (editMode) {
        // Update mode
        await WeightsService.saveWeight({ ...weightData, weight_id: editId });
        setEditMode(false);
      } else {
        // Create new weight
        await WeightsService.saveWeight(weightData);
      }
      setFormData({ weightValue: '', productDetailId: '' });
      loadWeights(); // Reload the weights after adding or updating
    } catch (error) {
      console.error('Error saving weight', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this weight?')) {
      try {
        await WeightsService.deleteWeight(id);
        loadWeights(); // Reload the weights after deletion
      } catch (error) {
        console.error('Error deleting weight', error);
      }
    }
  };

  const handleEdit = (weight) => {
    setFormData({
      weightValue: weight.weight_value,
      productDetailId: weight.productDetail.productDetailId,
    });
    setEditId(weight.weight_id); // Change to weight_id
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({ weightValue: '', productDetailId: '' });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Weights</h1>

      {/* Form for Adding/Editing Weights */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Weight Value</label>
          <input
            type="text"
            name="weightValue"
            value={formData.weightValue}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border rounded"
            placeholder="Enter weight value"
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
            {loading ? (editMode ? 'Updating...' : 'Saving...') : editMode ? 'Update Weight' : 'Save Weight'}
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

      {/* Table of Weights */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Weight Value</th>
            <th className="py-2 px-4 border-b">Product Detail</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {weights.map((weight) => (
            <tr key={weight.weight_id}> {/* Change to weight_id */}
              <td className="py-2 px-4 border-b">{weight.weight_value}</td>
              <td className="py-2 px-4 border-b">
                {weight.productDetail.products.productName} - {weight.productDetail.quantity} - {weight.productDetail.price}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEdit(weight)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(weight.weight_id)} // Change to weight_id
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

export default ManageWeights;
