// services/product.service.js
import API from './api.service';

class ProductService {
  /**
   * Récupérer tous les produits du vendeur
   */
  async getVendorProducts(vendorId, params = {}) {
    const response = await API.get(`/products`, { params: { vendorId, ...params } });
    const payload = response.data || {};
    return {
      data: Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.products)
          ? payload.products
          : [],
      pagination: payload.pagination || null
    };
  }

  /**
   * Récupérer un produit par ID
   */
  async getProductById(vendorId, productId) {
    const response = await API.get(`/products/${productId}`);
    const payload = response.data || {};
    return {
      data: payload.data || payload.product || null
    };
  }

  /**
   * Créer un nouveau produit avec images
   */
  async createProduct(vendorId, productData, images) {
    // If images provided, send multipart/form-data with a `productData` JSON field
    if (images && images.length) {
      const form = new FormData();
      form.append('productData', JSON.stringify({ vendorId, ...productData }));
      images.forEach((file) => form.append('images', file));
      const response = await API.post(`/products`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }

    const body = { vendorId, ...productData };
    const response = await API.post(`/products`, body);
    return response.data;
  }

  /**
   * Mettre à jour un produit
   */
  async updateProduct(vendorId, productId, productData, images, deletedImages) {
    // If images or deletedImages present, use multipart to support file upload
    if ((images && images.length) || (deletedImages && deletedImages.length)) {
      const form = new FormData();
      form.append('productData', JSON.stringify({ vendorId, ...productData, deletedImages }));
      if (images && images.length) images.forEach((file) => form.append('images', file));
      const response = await API.put(`/products/${productId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }

    const body = { vendorId, ...productData, deletedImages };
    const response = await API.put(`/products/${productId}`, body);
    return response.data;
  }

  /**
   * Supprimer un produit
   */
  async deleteProduct(vendorId, productId) {
    const response = await API.delete(`/products/${productId}`, { data: { vendorId } });
    return response.data;
  }
}

export default new ProductService();
