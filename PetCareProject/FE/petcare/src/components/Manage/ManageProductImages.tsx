import React, { useState, useEffect } from 'react';
import ProductImagesService from '../../service/ProductImagesService';
import ProductDetailService from '../../service/ProductDetailService'; // Import service to load product details

const ProductImageManager = () => {
  const [images, setImages] = useState([]); // State for managing product images
  const [productDetails, setProductDetails] = useState([]); // State for managing product details list
  const [formData, setFormData] = useState({ imageUrl: '', productDetailId: '' });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadImages();
    loadProductDetails(); // Load product details on component mount
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await ProductImagesService.getAllProductImages();
      setImages(response.data); // Assuming response.data contains the list of images
    } catch (error) {
      console.error('Error loading product images', error);
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
        await ProductImagesService.saveProductImage({
          productImageId: editId, // Include the ID for updating
          imageUrl: formData.imageUrl,
          productDetail: { productDetailId: formData.productDetailId }, // Assuming you have the productDetailId available
        });
        setEditMode(false);
      } else {
        await ProductImagesService.saveProductImage({
          imageUrl: formData.imageUrl,
          productDetail: { productDetailId: formData.productDetailId },
        });
      }
      setFormData({ imageUrl: '', productDetailId: '' });
      loadImages(); // Reload the images after adding or updating
    } catch (error) {
      console.error('Error saving product image', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await ProductImagesService.deleteProductImage(id);
        loadImages(); // Reload the images after deletion
      } catch (error) {
        console.error('Error deleting product image', error);
      }
    }
  };

  const handleEdit = (image) => {
    setFormData({
      imageUrl: image.imageUrl,
      productDetailId: image.productDetail.productDetailId,
    });
    setEditId(image.productImageId);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({ imageUrl: '', productDetailId: '' });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Image Manager</h1>

      {/* Form for Adding/Editing Images */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border rounded"
            placeholder="Enter image URL"
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
            {loading ? (editMode ? 'Updating...' : 'Saving...') : editMode ? 'Update Image' : 'Save Image'}
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

      {/* Table of Product Images */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Image URL</th>
            <th className="py-2 px-4 border-b">Product Detail</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image) => (
            <tr key={image.productImageId}>
              <td className="py-2 px-4 border-b">
                <img
                  src={image.imageUrl}
                  alt="Product"
                  className="h-16 w-16 object-cover" // Thay đổi kích thước hình ảnh theo nhu cầu
                />
              </td>
              <td className="py-2 px-4 border-b">
                {image.productDetail.products.productName} - {image.productDetail.quantity} - {image.productDetail.price}
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEdit(image)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(image.productImageId)}
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

export default ProductImageManager;
