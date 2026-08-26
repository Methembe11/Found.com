let orders = [];

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9).toUpperCase();

const createOrder = (req, res) => {
  const { guest, address, notes, payment_method, items, total } = req.body;

  if (!guest || !guest.name || !guest.phone || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const order = {
    id: generateId(),
    guest,
    address,
    notes: notes || '',
    payment_method: payment_method || 'ecocash',
    items,
    total,
    status: 'pending',
    payment_status: 'pending',
    created_at: new Date().toISOString()
  };

  orders.push(order);
  res.status(201).json(order);
};

const getOrderById = (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};

const getOrderStatus = (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // Simulate payment confirmation after some time
  const elapsed = Date.now() - new Date(order.created_at).getTime();
  if (elapsed > 15000 && order.payment_status === 'pending') {
    order.payment_status = 'confirmed';
    order.status = 'confirmed';
  }

  res.json({ status: order.status, payment_status: order.payment_status });
};

const getAllOrders = (req, res) => {
  res.json(orders);
};

const updateOrderStatus = (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status || order.status;
  order.payment_status = req.body.payment_status || order.payment_status;
  res.json(order);
};

module.exports = { createOrder, getOrderById, getOrderStatus, getAllOrders, updateOrderStatus };
