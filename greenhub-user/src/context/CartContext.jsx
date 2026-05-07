import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  //Dynamic Key
  const cartKey = user ? `nganter_cart_${user.id}` : 'nganter_cart_guest';

  const [cartItems, setCartItems] = useState([]);

  // Effect to Load Cart when User state changes
  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      setCartItems([]); // Clear UI if no saved cart for this user
    }
  }, [user, cartKey]); // This triggers whenever user logs in, out, or refreshes

  // Effect to Save Cart when items change
  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem(cartKey)) {
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, cartKey]);
  
  const addToCart = (product) => {
    if (!user.id) {
          // 1. Show Alert (Using toast for a better Nganter UI experience)
          toast.error("Please sign in to purchase to products");
          return;
      }
      
  setCartItems((prev) => {
    const isItemInCart = prev.find((item) => item.id === product.id);

    if (isItemInCart) {
      // Check if adding one more exceeds stock
      if (isItemInCart.quantity >= product.stock_qty) {
        toast.error(`Sorry, only ${product.stock_qty} items available in stock.`, {
          id: `stock-limit-${product.id}`,
        });
        return prev; // Return original state without changes
      }

      toast.success(`Increased quantity of ${product.productName}`, {
        id: `added-${product.id}`,
      });

      return prev.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }

    // Check stock for initial add (in case stock is 0)
    if (product.stock_qty <= 0) {
      toast.error("This item is currently out of stock.");
      return prev;
    }

    toast.success(`${product.productName} added to cart!`, {
      id: `added-${product.id}`,
    });

    return [...prev, { ...product, quantity: 1 }];
  });
};

  const removeFromCart = (id) => setCartItems(prev => prev.filter(item => item.id !== id));

  const updateQuantity = (id, delta, stock_qty) => {
  setCartItems((prevItems) =>
    prevItems.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;

        // If trying to increase past stock
        if (delta > 0 && newQty > stock_qty) {
          toast.error("Maximum stock reached", { id: `limit-${id}` });
          return item;
        }

        // If trying to decrease below 1
        if (newQty < 1) return item;

        return { ...item, quantity: newQty };
      }
      return item;
    })
  );
};

// Calculate Total Price 
const totalAmount = cartItems.reduce(
  (acc, item) => acc + Number(item.price) * item.quantity, 
  0
);

//  Calculate Total Quantity 
const totalItems = cartItems.reduce(
  (acc, item) => acc + item.quantity, 
  0
);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems , addToCart, removeFromCart, updateQuantity , totalAmount,
    totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);