/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Star, Clock, ShoppingBag, Plus, Minus, Info, MapPin, Phone } from 'lucide-react';
import { Restaurant, MenuItem, CartItem } from '../types';
import { MENU_ITEMS } from '../data/restaurants';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  cart: CartItem[];
  onBack: () => void;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (itemId: string) => void;
}

export default function RestaurantDetail({
  restaurant,
  cart,
  onBack,
  onAddToCart,
  onRemoveFromCart,
}: RestaurantDetailProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const menuItems = useMemo(() => {
    return MENU_ITEMS[restaurant.id] || [];
  }, [restaurant.id]);

  const categories = useMemo(() => {
    return ['All', ...restaurant.categories];
  }, [restaurant]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, selectedCategory]);

  // Helper to get quantity of item in cart
  const getItemQuantity = (itemId: string) => {
    // Find item by ID in cart
    const cartItem = cart.find((item) => item.menuItem.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/95 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Restaurant Title Overlaid */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-orange-600 px-3 py-1 rounded-full">
              {restaurant.cuisine}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight drop-shadow-xs">
            {restaurant.name}
          </h1>
          <p className="text-slate-200 text-sm md:text-base mt-2 max-w-2xl line-clamp-2 drop-shadow-xs">
            {restaurant.description}
          </p>
        </div>
      </div>

      {/* Restaurant Meta Info */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>{restaurant.rating} Rating</span>
              </div>
              <p className="text-xs text-slate-500">{restaurant.reviewCount} customer reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0 md:px-6">
            <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{restaurant.deliveryTime} mins</div>
              <p className="text-xs text-slate-500">Estimated delivery time</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">
                {restaurant.deliveryFee === 0 ? 'Free Delivery' : `$${restaurant.deliveryFee.toFixed(2)}`}
              </div>
              <p className="text-xs text-slate-500">Min. order of ${restaurant.minOrder.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Contact Info Accordion style but visible */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4 text-xs text-slate-500 bg-white border border-slate-100 rounded-xl px-4 py-3">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            {restaurant.address}
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-slate-400" />
            {restaurant.phone}
          </span>
        </div>

        {/* Search and Categories Toolbar */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:border-orange-500 transition-colors placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <span>{selectedCategory} Menu</span>
            <span className="text-xs bg-slate-100 font-semibold px-2.5 py-1 rounded-full text-slate-500">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </span>
          </h2>

          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800">No dishes match your query</h3>
              <p className="text-sm text-slate-500 mt-1">Try checking another category or refining your search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => {
                const quantity = getItemQuantity(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 p-4 flex gap-4"
                  >
                    {/* Item Image */}
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="object-cover w-full h-full"
                      />
                      {item.popular && (
                        <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                          Popular
                        </div>
                      )}
                    </div>

                    {/* Item Text & Actions */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-800 text-base md:text-md line-clamp-1">
                            {item.name}
                          </h3>
                          <span className="font-extrabold text-orange-600 text-base shrink-0">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Dietary Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.vegetarian && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded-sm">
                              VEG
                            </span>
                          )}
                          {item.vegan && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-sm">
                              VEGAN
                            </span>
                          )}
                          {item.glutenFree && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded-sm">
                              GF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add/Remove Actions */}
                      <div className="flex justify-end mt-3">
                        {quantity > 0 ? (
                          <div className="flex items-center bg-orange-600 text-white rounded-lg p-1.5 shadow-sm">
                            <button
                              onClick={() => onRemoveFromCart(item.id)}
                              className="p-1 hover:bg-orange-700 rounded-md transition-colors cursor-pointer"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3.5 text-sm font-bold min-w-[24px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => onAddToCart(item)}
                              className="p-1 hover:bg-orange-700 rounded-md transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAddToCart(item)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
