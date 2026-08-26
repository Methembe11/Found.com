const { adminCredentials, products, customers } = require('../config/data');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let localProducts = [...products];
let searchLogs = [];

const login = (req, res) => {
  const { username, password } = req.body;

  if (username === adminCredentials.username && password === adminCredentials.password) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'found_secret', { expiresIn: '24h' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
};

const getStats = (req, res) => {
  const allOrders = require('./orderController');
  res.json({
    orders: 0,
    revenue: 0,
    customers: customers.length,
    products: localProducts.length
  });
};

const getLocalProducts = (req, res) => {
  res.json(localProducts);
};

const createProduct = (req, res) => {
  const { name, category, subcategory, price, stock, badge, description, image_url } = req.body;
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (image_url) {
    imageUrl = image_url;
  }
  const newProduct = {
    id: generateId(),
    name,
    category,
    subcategory: subcategory || '',
    price: parseFloat(price) || 0,
    stock: parseInt(stock) || 0,
    badge: badge || null,
    image_url: imageUrl,
    description: description || '',
    created_at: new Date()
  };
  localProducts.push(newProduct);
  res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
  const idx = localProducts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  const { name, category, subcategory, price, stock, badge, description, image_url } = req.body;
  if (name) localProducts[idx].name = name;
  if (category) localProducts[idx].category = category;
  if (subcategory !== undefined) localProducts[idx].subcategory = subcategory;
  if (price) localProducts[idx].price = parseFloat(price);
  if (stock !== undefined) localProducts[idx].stock = parseInt(stock);
  if (badge !== undefined) localProducts[idx].badge = badge || null;
  if (description !== undefined) localProducts[idx].description = description;
  if (req.file) {
    localProducts[idx].image_url = `/uploads/${req.file.filename}`;
  } else if (image_url !== undefined) {
    localProducts[idx].image_url = image_url || null;
  }

  res.json(localProducts[idx]);
};

const deleteProduct = (req, res) => {
  const idx = localProducts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  localProducts.splice(idx, 1);
  res.json({ success: true });
};

const getCustomers = (req, res) => {
  res.json(customers);
};

const getSearchLogs = (req, res) => {
  const keywordCounts = {};
  searchLogs.forEach(log => {
    keywordCounts[log.keyword] = (keywordCounts[log.keyword] || 0) + 1;
  });
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));

  res.json({ topKeywords, recent: searchLogs.slice(-20).reverse() });
};

const logSearch = (req, res) => {
  const { keyword } = req.body;
  if (keyword) {
    searchLogs.push({ keyword, timestamp: new Date().toISOString() });
  }
  res.json({ success: true });
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9).toUpperCase();

module.exports = { login, getStats, getLocalProducts, createProduct, updateProduct, deleteProduct, getCustomers, getSearchLogs, logSearch };
