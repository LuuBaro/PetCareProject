const BASE_URL = "http://localhost:8080/api/product-details";

const ProductDetailService = {
  // Fetch all ProductDetails
  getAllProductDetails: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error; // Re-throw the error to handle it later
    }
  },

  // Fetch ProductDetail by ID
  getProductDetailById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product detail with ID ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product detail with ID ${id}:`, error);
      throw error;
    }
  },

  // Create ProductDetail
  createProductDetail: async (productDetail) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productDetail),
      });
      if (!response.ok) {
        throw new Error("Failed to create product detail");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating product detail:", error);
      throw error;
    }
  },

  // Update ProductDetail
  updateProductDetail: async (id, productDetail) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productDetail),
      });
      if (!response.ok) {
        throw new Error(`Failed to update product detail with ID ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating product detail with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete ProductDetail by ID
  deleteProductDetail: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete product detail with ID ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting product detail with ID ${id}:`, error);
      throw error;
    }
  },

  // Fetch ProductDetails by CartDetails ID
  getProductDetailsByCartDetailsId: async (cartDetailsId) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/${cartDetailsId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product details for cart ID ${cartDetailsId}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product details for cart ID ${cartDetailsId}:`, error);
      throw error;
    }
  },

  // Fetch ProductDetails by Product ID
  getProductDetailsByProductId: async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/by-product/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product details for product ID ${productId}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },



};

export default ProductDetailService;
