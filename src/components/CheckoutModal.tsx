/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, MapPin, CreditCard, Lock, ShieldCheck, ShoppingBag, Landmark, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, DeliveryAddress, Restaurant } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
  cart: CartItem[];
  discountInfo: { code: string; value: number; type: 'percentage' | 'fixed' | 'free_delivery' } | null;
  onOrderPlaced: (address: DeliveryAddress, paymentMethod: 'card' | 'cash') => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  restaurant,
  cart,
  discountInfo,
  onOrderPlaced,
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [address, setAddress] = useState<DeliveryAddress>({
    name: 'Jane Doe',
    phone: '(415) 555-4321',
    addressLine: '555 Market St, Apt 4B',
    city: 'San Francisco',
    notes: 'Buzz code 4242. Leave at the front desk.',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = restaurant ? (discountInfo?.type === 'free_delivery' ? 0 : restaurant.deliveryFee) : 0;
  const taxRate = 0.085;

  let discountAmount = 0;
  if (discountInfo) {
    if (discountInfo.type === 'percentage') {
      discountAmount = subtotal * (discountInfo.value / 100);
    } else if (discountInfo.type === 'fixed') {
      discountAmount = Math.min(discountInfo.value, subtotal);
    }
  }

  const tax = (subtotal - discountAmount) * taxRate;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee + tax);

  // Address form validation
  const isAddressValid = address.name.trim() && address.phone.trim() && address.addressLine.trim() && address.city.trim();

  // Card validation check (simple)
  const isCardValid =
    paymentMethod === 'cash' ||
    (cardNumber.replace(/\s/g, '').length === 16 && cardName.trim() && cardExpiry.length === 5 && cardCvv.length === 3);

  // Format Card Number with Spaces (4-4-4-4)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format Card Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Format CVV (max 3 digits)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(value);
  };

  const handlePlaceOrder = () => {
    if (!isCardValid) return;
    setIsProcessing(true);
    setStep(3);

    // Simulate real bank authorization and server syncing stages
    const stages = [
      'Establishing secure payment gateway connection...',
      'Authorizing credentials and checking transaction limits...',
      'Finalizing transaction and transmitting order details to kitchen...',
    ];

    let currentStage = 0;
    setProcessingStatus(stages[0]);

    const timer = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setProcessingStatus(stages[currentStage]);
      } else {
        clearInterval(timer);
        setIsProcessing(false);
        onOrderPlaced(address, paymentMethod);
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Checkout</h2>
                <p className="text-xs text-slate-400 font-medium">Complete your ordering process</p>
              </div>
              {!isProcessing && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Stepper Indicator */}
            {step < 3 && (
              <div className="px-6 pt-4 flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step >= 1 ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    1
                  </div>
                  <span className={`text-xs font-bold ${step >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                    Delivery
                  </span>
                </div>
                <div className="h-[2px] bg-slate-100 flex-1" />
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step >= 2 ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-xs font-bold ${step >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                    Payment
                  </span>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Step 1: Delivery Address Form */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Left form fields */}
                  <div className="md:col-span-3 space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>Delivery Details</span>
                    </h3>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-orange-500 transition-colors text-slate-800 font-medium"
                        placeholder="e.g. Jane Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-orange-500 transition-colors text-slate-800 font-medium"
                        placeholder="e.g. (415) 555-1234"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={address.addressLine}
                        onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-orange-500 transition-colors text-slate-800 font-medium"
                        placeholder="e.g. 555 Market St, Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-orange-500 transition-colors text-slate-800 font-medium"
                          placeholder="San Francisco"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          State / ZIP
                        </label>
                        <input
                          type="text"
                          defaultValue="CA 94105"
                          disabled
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Rider Instructions (Optional)
                      </label>
                      <textarea
                        value={address.notes}
                        onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-orange-500 transition-colors text-slate-800 font-medium min-h-[70px] resize-none"
                        placeholder="e.g. Buzz 1234, leave with reception..."
                      />
                    </div>
                  </div>

                  {/* Right summary panel */}
                  <div className="md:col-span-2 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Order Summary
                      </h4>
                      <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs text-slate-600">
                            <span className="truncate pr-4">
                              {item.quantity}x {item.menuItem.name}
                            </span>
                            <span className="font-bold shrink-0">
                              ${(item.menuItem.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 mt-4 pt-4 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Promo Discount</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-500">
                          <span>Delivery</span>
                          <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Estimated Tax</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-4 flex items-baseline justify-between">
                      <span className="text-sm font-bold text-slate-800">Total</span>
                      <span className="text-lg font-extrabold text-orange-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Selector and Simulation */}
              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Left Payment form */}
                  <div className="md:col-span-3 space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-3">
                      <CreditCard className="w-4 h-4 text-orange-500" />
                      <span>Select Payment Method</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3.5 rounded-xl border font-bold text-xs flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'border-orange-500 bg-orange-50/30 text-orange-700'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Credit / Debit Card</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3.5 rounded-xl border font-bold text-xs flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          paymentMethod === 'cash'
                            ? 'border-orange-500 bg-orange-50/30 text-orange-700'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Landmark className="w-5 h-5" />
                        <span>Cash on Delivery</span>
                      </button>
                    </div>

                    {paymentMethod === 'card' ? (
                      <div className="space-y-3 pt-2">
                        {/* Interactive Credit Card Mockup */}
                        <div className="relative bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-2xl p-4 shadow-md aspect-[1.586/1] overflow-hidden w-full max-w-[280px] mx-auto border border-slate-700">
                          {/* Card details glow */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                          <div className="flex justify-between items-start">
                            <div className="bg-yellow-400/90 w-8 h-6 rounded-md shadow-xs shrink-0" />
                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                              Secured Card
                            </span>
                          </div>
                          <div className="mt-6 text-sm font-bold tracking-widest font-mono text-center">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </div>
                          <div className="mt-6 flex justify-between text-[10px] uppercase font-semibold text-slate-400">
                            <div>
                              <p className="text-[7px] text-slate-500 font-bold">Card Holder</p>
                              <p className="truncate max-w-[140px] text-slate-200 font-bold">
                                {cardName || 'YOUR FULL NAME'}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[7px] text-slate-500 font-bold">Expires</p>
                              <p className="text-slate-200 font-bold">{cardExpiry || 'MM/YY'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-orange-500 text-slate-800 font-medium"
                              placeholder="e.g. Jane Doe"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Card Number
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-hidden focus:border-orange-500 text-slate-800 font-mono font-bold"
                                placeholder="4000 1234 5678 9010"
                              />
                              <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                Expiration Date
                              </label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={handleExpiryChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-orange-500 text-slate-800 font-mono font-bold"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                CVV Code
                              </label>
                              <input
                                type="password"
                                value={cardCvv}
                                onChange={handleCvvChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-orange-500 text-slate-800 font-mono font-bold"
                                placeholder="•••"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-xs leading-relaxed text-orange-800 space-y-2">
                        <p className="font-bold">💵 Cash on Delivery Information</p>
                        <p className="text-slate-600">
                          You can pay our rider in cash or card at your doorstep when they deliver your hot, fresh meal! Please have exact change if possible.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right cost summary & checkout badge */}
                  <div className="md:col-span-2 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-emerald-50 text-emerald-700 border border-emerald-100 p-2.5 rounded-xl mb-4">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>PCI-DSS Secured System</span>
                      </div>

                      <div className="space-y-2 text-xs font-semibold text-slate-500">
                        <div className="flex justify-between">
                          <span>Delivery Address:</span>
                          <span className="text-slate-700 font-bold truncate max-w-[110px]">
                            {address.addressLine}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Payment:</span>
                          <span className="text-orange-600 font-extrabold text-sm">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[10px] text-slate-400 leading-normal flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>Your transaction is encrypted using state-of-the-art cryptographic protocols.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Secure Processing animation */}
              {step === 3 && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                  {/* Processing Ripple */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full animate-ping absolute inset-0 opacity-40" />
                    <div className="relative w-16 h-16 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full">
                      <ShieldCheck className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                      <span>Processing Order...</span>
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed h-12">
                      {processingStatus}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            {step < 3 && (
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                {step === 1 ? (
                  <button
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-800 font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(1)}
                    className="text-slate-600 hover:text-slate-800 font-bold text-xs px-4 py-2 rounded-xl border border-slate-200 bg-white transition-all cursor-pointer"
                  >
                    Back to Address
                  </button>
                )}

                {step === 1 ? (
                  <button
                    onClick={() => setStep(2)}
                    disabled={!isAddressValid}
                    className={`font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
                      isAddressValid
                        ? 'bg-slate-900 hover:bg-slate-950 text-white shadow-slate-200'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Proceed to Payment
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!isCardValid}
                    className={`font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
                      isCardValid
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Pay & Place Order
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
