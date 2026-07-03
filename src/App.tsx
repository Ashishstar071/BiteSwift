/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBasket, ShieldCheck, MapPin, Search, Star, Utensils, History, Sparkles, ChefHat, RefreshCw, X, Bike } from 'lucide-react';
import { Restaurant, MenuItem, CartItem, Order, DeliveryAddress, OrderStatus } from './types';
import { RESTAURANTS } from './data/restaurants';
import RestaurantCard from './components/RestaurantCard';
import RestaurantDetail from './components/RestaurantDetail';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTracker from './components/OrderTracker';
import ManagementDashboard from './components/ManagementDashboard';
import { motion, AnimatePresence } from 'motion/react';

// Pre-filled mock orders to populate dashboard statistics immediately
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_pre_1',
    restaurantId: 'r1',
    restaurantName: 'Burger & Co. Craft House',
    restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80',
    items: [
      {
        id: 'cart_pre_1',
        menuItem: {
          id: 'm1_1',
          name: 'Double Smash Cheeseburger',
          description: '',
          price: 13.99,
          image: '',
          category: 'Burgers',
          popular: true
        },
        quantity: 2
      },
      {
        id: 'cart_pre_2',
        menuItem: {
          id: 'm1_4',
          name: 'Sweet Potato Waffle Fries',
          description: '',
          price: 5.49,
          image: '',
          category: 'Sides',
          popular: true
        },
        quantity: 1
      }
    ],
    subtotal: 33.47,
    deliveryFee: 1.99,
    tax: 2.84,
    total: 38.30,
    status: 'delivered',
    deliveryAddress: {
      name: 'John Miller',
      phone: '(415) 555-9011',
      addressLine: '101 California St, Ste 400',
      city: 'San Francisco'
    },
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36h ago
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
      { status: 'delivered', timestamp: new Date(Date.now() - 35.5 * 60 * 60 * 1000).toISOString() }
    ],
    riderProgress: 100,
    eta: 0
  },
  {
    id: 'ord_pre_2',
    restaurantId: 'r2',
    restaurantName: 'Bella Italia Ristorante',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&q=80',
    items: [
      {
        id: 'cart_pre_3',
        menuItem: {
          id: 'm2_3',
          name: 'Handmade Truffle Gnocchi',
          description: '',
          price: 18.49,
          image: '',
          category: 'Pasta',
          popular: true
        },
        quantity: 1
      },
      {
        id: 'cart_pre_4',
        menuItem: {
          id: 'm2_5',
          name: 'Chef Traditional Tiramisu',
          description: '',
          price: 7.99,
          image: '',
          category: 'Dessert',
          popular: true
        },
        quantity: 2
      }
    ],
    subtotal: 34.47,
    deliveryFee: 2.99,
    tax: 2.93,
    total: 40.39,
    status: 'delivered',
    deliveryAddress: {
      name: 'Sarah Connor',
      phone: '(415) 555-8241',
      addressLine: '420 Taylor St',
      city: 'San Francisco'
    },
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12h ago
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { status: 'delivered', timestamp: new Date(Date.now() - 11.4 * 60 * 60 * 1000).toISOString() }
    ],
    riderProgress: 100,
    eta: 0
  },
  {
    id: 'ord_pre_3',
    restaurantId: 'r3',
    restaurantName: 'Sakura Sushi & Zen',
    restaurantImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=100&q=80',
    items: [
      {
        id: 'cart_pre_5',
        menuItem: {
          id: 'm3_1',
          name: 'Signature Rainbow Roll',
          description: '',
          price: 17.99,
          image: '',
          category: 'Signature Rolls',
          popular: true
        },
        quantity: 1
      }
    ],
    subtotal: 17.99,
    deliveryFee: 3.49,
    tax: 1.53,
    total: 23.01,
    status: 'cancelled',
    deliveryAddress: {
      name: 'Marcus Vance',
      phone: '(415) 555-3211',
      addressLine: '1288 Bush St, Apt 11',
      city: 'San Francisco'
    },
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48h ago
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { status: 'cancelled', timestamp: new Date(Date.now() - 47.9 * 60 * 60 * 1000).toISOString() }
    ],
    riderProgress: 0,
    eta: 0
  }
];

export default function App() {
  // Navigation View
  const [view, setView] = useState<'browse' | 'restaurant-detail' | 'tracking' | 'dashboard' | 'history'>('browse');

  // Core Data States
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  // Filter/Search parameters in Browse view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');

  // Overlay state
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; value: number; type: 'percentage' | 'fixed' | 'free_delivery' } | null>(null);

  // Cross-Restaurant Cart Warning state
  const [restaurantConflict, setRestaurantConflict] = useState<{ pendingItem: MenuItem; currentRestaurantName: string } | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('biteswift_cart');
    const savedOrders = localStorage.getItem('biteswift_orders');
    const savedActiveTrackingId = localStorage.getItem('biteswift_active_tracking_id');
    const savedRestId = localStorage.getItem('biteswift_selected_rest_id');

    if (savedCart) setCart(JSON.parse(savedCart));

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Seed initial data
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('biteswift_orders', JSON.stringify(INITIAL_ORDERS));
    }

    if (savedActiveTrackingId) setActiveTrackingId(savedActiveTrackingId);

    if (savedRestId) {
      const rest = RESTAURANTS.find((r) => r.id === savedRestId);
      if (rest) setSelectedRestaurant(rest);
    }
  }, []);

  // Save to LocalStorage helpers
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('biteswift_cart', JSON.stringify(newCart));
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('biteswift_orders', JSON.stringify(newOrders));
  };

  const saveSelectedRestaurant = (rest: Restaurant | null) => {
    setSelectedRestaurant(rest);
    if (rest) {
      localStorage.setItem('biteswift_selected_rest_id', rest.id);
    } else {
      localStorage.removeItem('biteswift_selected_rest_id');
    }
  };

  // Add item to cart (supporting cross-restaurant warning)
  const handleAddToCart = (item: MenuItem) => {
    // If cart is empty, lock cart to this restaurant
    const isCartEmpty = cart.length === 0;

    // Determine restaurant of this item (m1_x -> r1, etc)
    const itemRestId = item.id.split('_')[0].replace('m', 'r');
    const currentRest = RESTAURANTS.find((r) => r.id === itemRestId);

    if (!currentRest) return;

    if (!isCartEmpty && selectedRestaurant && selectedRestaurant.id !== currentRest.id) {
      // Conflict! Show modal dialog to clear or maintain
      setRestaurantConflict({
        pendingItem: item,
        currentRestaurantName: selectedRestaurant.name,
      });
      return;
    }

    // Set locked restaurant
    if (isCartEmpty) {
      saveSelectedRestaurant(currentRest);
    }

    // Add item or increment
    const existingIndex = cart.findIndex((c) => c.menuItem.id === item.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        id: `${item.id}_default`,
        menuItem: item,
        quantity: 1,
      };
      saveCart([...cart, newItem]);
    }
  };

  // Resolve conflict: Empty cart and switch to new restaurant
  const handleResolveConflictClear = () => {
    if (!restaurantConflict) return;
    const item = restaurantConflict.pendingItem;
    const itemRestId = item.id.split('_')[0].replace('m', 'r');
    const targetRest = RESTAURANTS.find((r) => r.id === itemRestId);

    if (targetRest) {
      saveSelectedRestaurant(targetRest);
      const newItem: CartItem = {
        id: `${item.id}_default`,
        menuItem: item,
        quantity: 1,
      };
      saveCart([newItem]);
    }
    setRestaurantConflict(null);
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemId: string) => {
    const existingIndex = cart.findIndex((c) => c.menuItem.id === itemId);
    if (existingIndex > -1) {
      const updated = [...cart];
      if (updated[existingIndex].quantity > 1) {
        updated[existingIndex].quantity -= 1;
        saveCart(updated);
      } else {
        // Remove item entirely
        updated.splice(existingIndex, 1);
        saveCart(updated);
        // If empty cart, unlock restaurant
        if (updated.length === 0) {
          saveSelectedRestaurant(null);
        }
      }
    }
  };

  const handleClearCart = () => {
    saveCart([]);
    saveSelectedRestaurant(null);
  };

  // Open Checkout from Cart
  const handleProceedCheckout = (discount: any) => {
    setAppliedDiscount(discount);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // Checkout successful order creation
  const handleOrderPlaced = (address: DeliveryAddress, paymentMethod: 'card' | 'cash') => {
    if (!selectedRestaurant) return;

    const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const deliveryFee = appliedDiscount?.type === 'free_delivery' ? 0 : selectedRestaurant.deliveryFee;
    const taxRate = 0.085;

    let discountAmount = 0;
    if (appliedDiscount) {
      if (appliedDiscount.type === 'percentage') {
        discountAmount = subtotal * (appliedDiscount.value / 100);
      } else if (appliedDiscount.type === 'fixed') {
        discountAmount = Math.min(appliedDiscount.value, subtotal);
      }
    }

    const tax = (subtotal - discountAmount) * taxRate;
    const total = subtotal - discountAmount + deliveryFee + tax;

    const newOrder: Order = {
      id: `ord_${Math.random().toString(36).substring(2, 11)}`,
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      restaurantImage: selectedRestaurant.image,
      items: [...cart],
      subtotal,
      deliveryFee,
      tax,
      total,
      status: 'pending',
      deliveryAddress: address,
      paymentMethod,
      createdAt: new Date().toISOString(),
      statusHistory: [{ status: 'pending', timestamp: new Date().toISOString() }],
      riderProgress: 0,
      eta: selectedRestaurant.deliveryTime,
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    handleClearCart();

    // Hook tracker
    setActiveTrackingId(newOrder.id);
    localStorage.setItem('biteswift_active_tracking_id', newOrder.id);

    setCheckoutOpen(false);
    setView('tracking');
  };

  // Update Progress in OrderTracker
  const handleUpdateProgress = (orderId: string, progress: number, status: OrderStatus, eta: number) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        const statusChanged = order.status !== status;
        const history = [...order.statusHistory];
        if (statusChanged) {
          history.push({ status, timestamp: new Date().toISOString() });
        }
        return {
          ...order,
          riderProgress: progress,
          status,
          eta,
          statusHistory: history,
        };
      }
      return order;
    });

    saveOrders(updated);

    // If order was delivered, clear active tracking
    if (status === 'delivered') {
      localStorage.removeItem('biteswift_active_tracking_id');
    }
  };

  // Manual Status override inside Admin Management Dashboard
  const handleUpdateStatusManual = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        const history = [...order.statusHistory];
        if (order.status !== status) {
          history.push({ status, timestamp: new Date().toISOString() });
        }
        return {
          ...order,
          status,
          riderProgress: status === 'delivered' ? 100 : order.riderProgress,
          eta: status === 'delivered' ? 0 : order.eta,
          statusHistory: history,
        };
      }
      return order;
    });
    saveOrders(updated);
  };

  const handleDispatchRiderManual = (orderId: string) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        const history = [...order.statusHistory];
        history.push({ status: 'out_for_delivery', timestamp: new Date().toISOString() });
        return {
          ...order,
          status: 'out_for_delivery' as OrderStatus,
          riderProgress: 5,
          statusHistory: history,
        };
      }
      return order;
    });
    saveOrders(updated);
  };

  // Computed state getters
  const activeTrackingOrder = useMemo(() => {
    return orders.find((o) => o.id === activeTrackingId) || null;
  }, [orders, activeTrackingId]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  }, [orders]);

  const cartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Filters for Main Restaurant Browse grid
  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCuisine = selectedCuisine === 'All' || r.cuisine.includes(selectedCuisine);
      return matchesSearch && matchesCuisine;
    });
  }, [searchQuery, selectedCuisine]);

  // Cuisine Categories Quick filter list
  const cuisinesList = ['All', 'Burgers', 'Pizza', 'Italian', 'Sushi', 'Asian', 'Healthy', 'Vegan', 'Desserts'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-orange-500/10">
      {/* Header Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-40 px-4 md:px-8 py-4 flex items-center justify-between shadow-xs">
        {/* Brand logo */}
        <div
          onClick={() => {
            setView('browse');
            setSelectedRestaurant(null);
          }}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="bg-orange-600 text-white p-2 rounded-xl group-hover:bg-orange-700 transition-colors">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1">
              <span>BiteSwift</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fast & Fresh</p>
          </div>
        </div>

        {/* Desktop Main Navigation Tabs */}
        <nav className="hidden md:flex items-center bg-slate-100/80 border border-slate-100 rounded-2xl p-1">
          <button
            onClick={() => {
              setView('browse');
              if (selectedRestaurant) setView('restaurant-detail');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              view === 'browse' || view === 'restaurant-detail'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Explore
          </button>

          {activeTrackingOrder && (
            <button
              onClick={() => setView('tracking')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                view === 'tracking' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Track Order</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-600 animate-ping" />
            </button>
          )}

          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              view === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Orders ({orders.length})
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-1" />

          <button
            onClick={() => setView('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              view === 'dashboard' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Merchant Console</span>
          </button>
        </nav>

        {/* Right header buttons (Cart Trigger & Mobile Nav Indicators) */}
        <div className="flex items-center gap-2.5">
          {/* Manager view quick trigger on mobile */}
          <button
            onClick={() => setView(view === 'dashboard' ? 'browse' : 'dashboard')}
            className="md:hidden bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition-colors cursor-pointer"
            title="Merchant Portal"
          >
            <ChefHat className="w-4.5 h-4.5" />
          </button>

          {/* History quick trigger on mobile */}
          <button
            onClick={() => setView('history')}
            className="md:hidden bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition-colors cursor-pointer"
            title="Order History"
          >
            <History className="w-4.5 h-4.5" />
          </button>

          {/* Checkout Basket Button */}
          {cartItemsCount > 0 && (
            <button
              onClick={() => setCartOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md shadow-orange-100 transition-transform active:scale-95 cursor-pointer"
            >
              <ShoppingBasket className="w-4.5 h-4.5" />
              <span>Basket ({cartItemsCount})</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1">
        {/* VIEW 1: EXPLORE BROWSE RESTAURANTS */}
        {view === 'browse' && (
          <div className="space-y-8 pb-20">
            {/* Visual Hero Banner */}
            <section className="bg-slate-900 text-white py-12 md:py-16 px-6 md:px-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(249,115,22,0.12),transparent_40%)] pointer-events-none" />
              <div className="max-w-6xl mx-auto space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 bg-orange-950/40 text-orange-400 border border-orange-900/50 px-3 py-1 rounded-full text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Secure Contactless Deliveries</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-2xl">
                  Craving delicious meals delivered straight to <span className="text-orange-500">your door?</span>
                </h1>
                <p className="text-sm md:text-md text-slate-400 max-w-xl leading-relaxed">
                  Browse elite five-star restaurants, build customized menus, simulate fast checkout, and follow our visual interactive tracking simulator in real-time.
                </p>

                {/* Main Search Bar */}
                <div className="relative max-w-xl mx-auto md:mx-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search restaurant names, cuisines, or popular burgers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-slate-800 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 shadow-lg placeholder:text-slate-400 font-semibold"
                  />
                </div>
              </div>
            </section>

            {/* Main Listings */}
            <section className="max-w-6xl mx-auto px-4 space-y-6">
              {/* Cuisine Quick Tags */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none no-scrollbar">
                {cuisinesList.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => setSelectedCuisine(cuisine)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCuisine === cuisine
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>

              {/* Title Header */}
              <div>
                <h2 className="text-xl font-bold text-slate-800">Featured Establishments</h2>
                <p className="text-xs text-slate-400 font-semibold">Handpicked top-rated options around San Francisco</p>
              </div>

              {/* Grid output */}
              {filteredRestaurants.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center max-w-lg mx-auto">
                  <div className="mx-auto w-12 h-12 bg-slate-50 text-slate-400 flex items-center justify-center rounded-xl mb-4">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800">No restaurants found</h3>
                  <p className="text-sm text-slate-500 mt-1">Try refining your keyword query or cuisine filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onClick={() => {
                        saveSelectedRestaurant(restaurant);
                        setView('restaurant-detail');
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: RESTAURANT DETAIL & MENU VIEW */}
        {view === 'restaurant-detail' && selectedRestaurant && (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            cart={cart}
            onBack={() => setView('browse')}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
          />
        )}

        {/* VIEW 3: LIVE ORDER TRACKER */}
        {view === 'tracking' && (
          <div className="pb-20 pt-6">
            {activeTrackingOrder ? (
              <OrderTracker
                order={activeTrackingOrder}
                onUpdateProgress={handleUpdateProgress}
                onClose={() => setView('browse')}
              />
            ) : (
              <div className="max-w-md mx-auto text-center px-4 py-16 bg-white border border-slate-100 rounded-3xl mt-10 shadow-xs space-y-4">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 flex items-center justify-center rounded-2xl mx-auto">
                  <Bike className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">No active order delivery</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    You do not have a live order in transit right now. Order some food from any of our restaurants to track it in real-time.
                  </p>
                </div>
                <button
                  onClick={() => setView('browse')}
                  className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                >
                  Browse Menu Catalogs
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: MY ORDERS HISTORY LIST */}
        {view === 'history' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-20">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Your Order History</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Review receipts and previous delivery details</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center max-w-md mx-auto">
                <div className="mx-auto w-12 h-12 bg-slate-50 text-slate-400 flex items-center justify-center rounded-xl mb-4">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800">No history entries</h3>
                <p className="text-xs text-slate-500 mt-1">You have not ordered anything yet. Browse food stores to start!</p>
                <button
                  onClick={() => setView('browse')}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  const isDelivered = order.status === 'delivered';
                  const isCancelled = order.status === 'cancelled';
                  const isActive = !isDelivered && !isCancelled;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={order.restaurantImage}
                          alt={order.restaurantName}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-50"
                        />
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm md:text-base">
                            {order.restaurantName}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            {itemsCount} {itemsCount === 1 ? 'item' : 'items'} • Total: ${order.total.toFixed(2)}
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                            {new Date(order.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Right line actions */}
                      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            isDelivered
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : isCancelled
                              ? 'bg-rose-50 text-rose-700 border-rose-100'
                              : 'bg-orange-50 text-orange-700 border-orange-100 animate-pulse'
                          }`}
                        >
                          {order.status === 'pending'
                            ? 'Preparing'
                            : order.status === 'preparing'
                            ? 'In Kitchen'
                            : order.status === 'ready_for_pickup'
                            ? 'Cooked'
                            : order.status === 'out_for_delivery'
                            ? 'On Route'
                            : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>

                        {isActive ? (
                          <button
                            onClick={() => {
                              setActiveTrackingId(order.id);
                              localStorage.setItem('biteswift_active_tracking_id', order.id);
                              setView('tracking');
                            }}
                            className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>Track Rider</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: ENTERPRISE MERCHANT DASHBOARD */}
        {view === 'dashboard' && (
          <ManagementDashboard
            orders={orders}
            onUpdateStatus={handleUpdateStatusManual}
            onDispatchRider={handleDispatchRiderManual}
          />
        )}
      </main>

      {/* FOOTER BAR */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <Utensils className="w-5 h-5 text-orange-500" />
              <span className="font-extrabold text-sm tracking-tight text-white">BiteSwift Inc.</span>
            </div>
            <p className="text-slate-400 text-xs mt-1.5">
              Providing premium food ordering, dispatch tracking, and analytics dashboards in San Francisco.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setView('browse')}>Browse Store</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setView('history')}>Receipt History</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setView('dashboard')}>Merchant Administration</span>
          </div>

          <p className="text-[10px] text-slate-500">
            © 2026 BiteSwift. All security certificates and secure transactions verified.
          </p>
        </div>
      </footer>

      {/* OVERLAY 1: Slide Out Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        restaurant={selectedRestaurant}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleProceedCheckout}
      />

      {/* OVERLAY 2: Secure Multi-step Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        restaurant={selectedRestaurant}
        cart={cart}
        discountInfo={appliedDiscount}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* OVERLAY 3: Cross-Restaurant Cart Switch Confirmation Dialog */}
      <AnimatePresence>
        {restaurantConflict && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/60" onClick={() => setRestaurantConflict(null)} />
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative z-10 space-y-4 shadow-2xl border border-slate-100 text-center">
              <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-600 flex items-center justify-center rounded-full">
                <RefreshCw className="w-6 h-6 animate-spin-slow" />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-800 text-md">Replace Basket Items?</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  You already have items from <span className="font-bold text-slate-800">{restaurantConflict.currentRestaurantName}</span> in your basket. 
                  Adding this item will empty your current basket and start fresh. Do you want to proceed?
                </p>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setRestaurantConflict(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl flex-1 transition-colors cursor-pointer"
                >
                  No, Keep Basket
                </button>
                <button
                  onClick={handleResolveConflictClear}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl flex-1 transition-all active:scale-95 shadow-md shadow-orange-100 cursor-pointer"
                >
                  Yes, Empty & Add
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
