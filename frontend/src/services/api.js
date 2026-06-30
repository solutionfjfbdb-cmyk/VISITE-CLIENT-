import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

// Revenus API
export const revenusAPI = {
  getAll: () => api.get('/revenus'),
  getByUser: (userId) => api.get(`/revenus/user/${userId}`),
  create: (data) => api.post('/revenus', data),
  update: (id, data) => api.put(`/revenus/${id}`, data),
  delete: (id) => api.delete(`/revenus/${id}`)
};

// Depenses API
export const depensesAPI = {
  getAll: () => api.get('/depenses'),
  getByUser: (userId) => api.get(`/depenses/user/${userId}`),
  getByCategory: (userId) => api.get(`/depenses/user/${userId}/by-category`),
  create: (data) => api.post('/depenses', data),
  update: (id, data) => api.put(`/depenses/${id}`, data),
  delete: (id) => api.delete(`/depenses/${id}`)
};

// Epargne API
export const epargneAPI = {
  getByUser: (userId) => api.get(`/epargne/user/${userId}`),
  getTotal: (userId) => api.get(`/epargne/user/${userId}/total`),
  create: (data) => api.post('/epargne', data),
  update: (id, data) => api.put(`/epargne/${id}`, data),
  delete: (id) => api.delete(`/epargne/${id}`)
};

// Assurances API
export const assurancesAPI = {
  getByUser: (userId) => api.get(`/assurances/user/${userId}`),
  getActives: (userId) => api.get(`/assurances/user/${userId}/actives`),
  getTotal: (userId) => api.get(`/assurances/user/${userId}/total`),
  create: (data) => api.post('/assurances', data),
  update: (id, data) => api.put(`/assurances/${id}`, data),
  delete: (id) => api.delete(`/assurances/${id}`)
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getByType: (type) => api.get(`/categories/type/${type}`),
  init: () => api.get('/categories/init'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

// Dashboard API
export const dashboardAPI = {
  getSummary: (userId) => api.get(`/dashboard/${userId}`),
  getHistorique: (userId) => api.get(`/dashboard/${userId}/historique`)
};

export default api;
