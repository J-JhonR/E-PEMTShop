import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const getStorageKey = () => {
    if (!isAuthenticated || !user) return 'cart:guest';
    const userKey = user.id || user.email || 'anonymous';
    return `cart:user:${userKey}`;
  };

  const loadCartFromStorage = (key) => {
    try {
      const savedCart = localStorage.getItem(key);
      if (savedCart) return JSON.parse(savedCart);

      // Backward compatibility: migrate old global cart only for guest.
      if (key === 'cart:guest') {
        const legacy = localStorage.getItem('cart');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          localStorage.setItem(key, JSON.stringify(parsed));
          localStorage.removeItem('cart');
          return parsed;
        }
      }
    } catch (e) {
      return [];
    }
    return [];
  };

  const [cartItems, setCartItems] = useState(() => loadCartFromStorage('cart:guest'));
  const [storageKey, setStorageKey] = useState(() => getStorageKey());

  // When auth user changes, switch to that user's cart.
  useEffect(() => {
    const nextKey = getStorageKey();
    setStorageKey(nextKey);
    setCartItems(loadCartFromStorage(nextKey));
  }, [isAuthenticated, user?.id, user?.email]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const addToCart = (product, qty = 1) => {
    const quantity = Math.max(1, Number(qty) || 1);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, item.stock || 9999)
              }
            : item
        );
      }

      const newItem = {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        price: Number(product.price) || 0,
        compare_price: Number(product.compare_price) || 0,
        image: product.primary_image || product.image || '',
        quantity,
        stock: Number(product.quantity) || 0,
        vendorId: product.vendor_id || null,
        addedAt: new Date().toISOString()
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQty = (productId, qty) => {
    const quantity = Math.max(1, Number(qty) || 1);
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.stock || 9999) }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  // Calculate totals
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const shippingCost = useMemo(() => (subtotal > 100 ? 0 : 8), [subtotal]);
  const taxAmount = useMemo(() => subtotal * 0.1, [subtotal]);
  
  const discountAmount = useMemo(() => {
    // Example: 10% off if subtotal > 200
    return subtotal > 200 ? subtotal * 0.1 : 0;
  }, [subtotal]);

  const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const value = {
    cartItems,
    cartCount,
    subtotal,
    shippingCost,
    taxAmount,
    discountAmount,
    totalAmount,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    // Additional useful info
    isEmpty: cartItems.length === 0,
    itemCount: cartItems.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
