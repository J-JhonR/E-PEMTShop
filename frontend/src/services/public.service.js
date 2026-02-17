import API from './api.service';

class PublicService {
  async getCategories() {
    const response = await API.get('/public/categories');
    return response.data;
  }

  async getProducts(params = {}) {
    const response = await API.get('/public/products', { params });
    return response.data;
  }

  async getProductBySlug(slug) {
    const response = await API.get(`/public/products/${slug}`);
    return response.data;
  }
}

export default new PublicService();
