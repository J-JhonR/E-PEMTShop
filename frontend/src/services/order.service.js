// services/order.service.js
import API from './api.service';

class OrderService {
  /**
   * Récupérer les commandes du vendeur
   */
  async getVendorOrders(vendorId, params = {}) {
    const response = await API.get(`/vendors/${vendorId}/orders`, { params });
    return response.data;
  }

  /**
   * Récupérer une commande par ID
   */
  async getOrderById(vendorId, orderId) {
    const response = await API.get(`/vendors/${vendorId}/orders/${orderId}`);
    return response.data;
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  async updateOrderStatus(vendorId, orderId, statusData) {
    const response = await API.put(`/vendors/${vendorId}/orders/${orderId}/status`, statusData);
    return response.data;
  }

  /**
   * Récupérer les statistiques des commandes
   */
  async getOrderStats(vendorId) {
    const response = await API.get(`/vendors/${vendorId}/orders/stats`);
    return response.data;
  }
}

export default new OrderService();