/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, Percent, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Restaurant } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  restaurant: Restaurant | null;
  onAddToCart: (item: any) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
  onCheckout: (appliedDiscount: { code: string; value: number; type: 'percentage' | 'fixed' | 'free_delivery' } | null) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  restaurant,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; value: number; type: 'percentage' | 'fixed' | 'free_delivery' } | null>(null);
  const [promoError, setPromoError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = restaurant ? (appliedPromo?.type === 'free_delivery' ? 0 : restaurant.deliveryFee) : 0;
  const taxRate = 0.085; // 8.5%

  // Apply promo calculation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discountAmount = subtotal * (appliedPromo.value / 100);
    } else if (appliedPromo.type === 'fixed') {
      discountAmount = Math.min(appliedPromo.value, subtotal);
    }
  }

  const tax = (subtotal - discountAmount) * taxRate;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee + tax);

  const minOrderRemaining = restaurant ? Math.max(0, restaurant.minOrder - subtotal) : 0;

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'BITE20') {
      setAppliedPromo({ code, value: 20, type: 'percentage' });
    } else if (code === 'SAVE5') {
      setAppliedPromo({ code, value: 5, type: 'fixed' });
    } else if (code === 'FREE') {
      setAppliedPromo({ code, value: 0, type: 'free_delivery' });
    } else {
      setPromoError('Invalid promo code. Try "BITE20", "SAVE5", or "FREE"!');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Your Basket</h2>
                  {restaurant && (
                    <p className="text-xs font-semibold text-slate-400 line-clamp-1">
                      From {restaurant.name}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 flex items-center justify-center rounded-2xl mb-4">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-md">Your basket is empty</h3>
                  <p className="text-xs text-slate-500 max-w-[240px] mt-1.5 leading-relaxed">
                    Add tasty dishes from your selected restaurant to start ordering.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Selected Items
                    </span>
                    <button
                      onClick={onClearCart}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Empty Basket</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {cart.map((item) => (
                      <div key={item.id} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover bg-slate-50 shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm truncate">
                              {item.menuItem.name}
                            </h4>
                            <span className="text-xs font-bold text-orange-600 mt-0.5 block">
                              ${item.menuItem.price.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-slate-100 rounded-md bg-slate-5/50 p-1">
                              <button
                                onClick={() => onRemoveFromCart(item.menuItem.id)}
                                className="p-0.5 text-slate-400 hover:text-slate-600 rounded-sm hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 text-xs font-extrabold text-slate-700">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onAddToCart(item.menuItem)}
                                className="p-0.5 text-slate-400 hover:text-slate-600 rounded-sm hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs font-extrabold text-slate-800">
                              ${(item.menuItem.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Input Slot */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5 text-orange-500" />
                          <span>Promo Code</span>
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Try: BITE20, SAVE5, FREE
                        </span>
                      </div>

                      {!appliedPromo ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => {
                              setPromoCode(e.target.value);
                              setPromoError('');
                            }}
                            className="bg-white border border-slate-200 text-xs font-bold rounded-lg px-3 py-2 flex-1 focus:outline-hidden focus:border-orange-500 uppercase"
                          />
                          <button
                            onClick={handleApplyPromo}
                            className="bg-slate-800 hover:bg-slate-950 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      ) : (
                        <div className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-orange-800 font-bold">
                            <span>Applied: {appliedPromo.code}</span>
                            <span className="font-normal text-orange-600 text-[10px]">
                              ({appliedPromo.type === 'percentage' ? `${appliedPromo.value}% Off` : appliedPromo.type === 'fixed' ? `$${appliedPromo.value} Off` : 'Free Delivery'})
                            </span>
                          </div>
                          <button
                            onClick={handleRemovePromo}
                            className="text-orange-500 hover:text-orange-700 font-extrabold text-[10px] cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {promoError && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5">{promoError}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-white shadow-lg space-y-4">
                {/* Cost summary list */}
                <div className="space-y-2 text-xs font-semibold text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-800">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span>Promo Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-slate-800">
                      {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Estimated Tax (8.5%)</span>
                    <span className="text-slate-800">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm font-extrabold text-slate-800">
                    <span>Total Amount</span>
                    <span className="text-orange-600 text-base">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Minimum order warnings */}
                {minOrderRemaining > 0 ? (
                  <div className="bg-amber-50 border border-amber-100 text-amber-800 text-[11px] font-semibold p-3 rounded-xl flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <div>
                      <span>Minimum order is </span>
                      <span className="font-bold">${restaurant?.minOrder.toFixed(2)}</span>.
                      <p className="font-bold text-orange-700">Add ${minOrderRemaining.toFixed(2)} more to place your order.</p>
                    </div>
                  </div>
                ) : null}

                {/* Checkout CTA */}
                <button
                  onClick={() => onCheckout(appliedPromo)}
                  disabled={minOrderRemaining > 0 || cart.length === 0}
                  className={`w-full font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer ${
                    minOrderRemaining > 0
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 shadow-none cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200 hover:shadow-lg'
                  }`}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
