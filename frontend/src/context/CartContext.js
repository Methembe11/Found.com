import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('found_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('found_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, size) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.size === size
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        size,
        category: product.category,
        image_url: product.image_url
      }];
    });
  };

  const removeItem = (id, size) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.size === size)));
  };

  const updateQty = (id, size, qty) => {
    if (qty <= 0) return removeItem(id, size);
    setItems(prev =>
      prev.map(i =>
        i.id === id && i.size === size ? { ...i, qty } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};
