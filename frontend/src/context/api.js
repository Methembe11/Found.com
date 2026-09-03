const configuredApi = process.env.REACT_APP_API_URL;
const API = configuredApi
  ? `${configuredApi.replace(/\/+$/, '')}/api`.replace(/\/api\/api$/, '/api')
  : 'https://found-com-2.onrender.com/api';
const API_ORIGIN = API.replace(/\/api\/?$/, '');

export const resolveImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('/uploads/')) {
    return `${API_ORIGIN}${url}?v=1`;
  }
  return url;
};

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/products${query ? '?' + query : ''}`);
  return res.json();
};

export const fetchProduct = async (id) => {
  const res = await fetch(`${API}/products/${id}`);
  return res.json();
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return res.json();
};

export const getOrderStatus = async (id) => {
  const res = await fetch(`${API}/orders/${id}/status`);
  return res.json();
};

export const logSearch = async (keyword) => {
  await fetch(`${API}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword })
  });
};

export const adminLogin = async (username, password) => {
  const res = await fetch(`${API}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
};

export const fetchAdminStats = async (token) => {
  const res = await fetch(`${API}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const fetchAdminProducts = async (token) => {
  const res = await fetch(`${API}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const createAdminProduct = async (token, formData) => {
  const res = await fetch(`${API}/admin/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  return res.json();
};

export const updateAdminProduct = async (token, id, formData) => {
  const res = await fetch(`${API}/admin/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  return res.json();
};

export const deleteAdminProduct = async (token, id) => {
  const res = await fetch(`${API}/admin/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const fetchAdminOrders = async (token) => {
  const res = await fetch(`${API}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const fetchAdminCustomers = async (token) => {
  const res = await fetch(`${API}/admin/customers`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const fetchAdminSearchLogs = async (token) => {
  const res = await fetch(`${API}/admin/search-logs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};
