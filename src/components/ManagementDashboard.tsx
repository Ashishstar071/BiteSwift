/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ChefHat, Bike, Check, X, TrendingUp, DollarSign, ShoppingBag, Users, Calendar, ArrowRight, Star } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface ManagementDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDispatchRider: (orderId: string) => void;
}

export default function ManagementDashboard({
  orders,
  onUpdateStatus,
  onDispatchRider,
}: ManagementDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('active');

  // Compute key metrics
  const stats = useMemo(() => {
    const totalOrdersCount = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered');
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled');
    const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');

    const totalSales = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = deliveredOrders.length > 0 ? totalSales / deliveredOrders.length : 0;
    const successRate = totalOrdersCount > 0 ? ((deliveredOrders.length) / (totalOrdersCount - activeOrders.length || 1)) * 100 : 100;

    return {
      totalSales,
      avgOrderValue,
      successRate: Math.min(100, Math.round(successRate)),
      activeOrdersCount: activeOrders.length,
      completedOrdersCount: deliveredOrders.length,
      totalOrdersCount,
    };
  }, [orders]);

  // Compute revenue contribution by restaurant for visual charts
  const restaurantShare = useMemo(() => {
    const shares: Record<string, number> = {};
    orders.forEach((o) => {
      if (o.status === 'delivered') {
        shares[o.restaurantName] = (shares[o.restaurantName] || 0) + o.total;
      }
    });
    return Object.entries(shares).map(([name, val]) => ({ name, value: val }));
  }, [orders]);

  // Filtered list of orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'active') {
        return o.status !== 'delivered' && o.status !== 'cancelled';
      }
      return o.status === 'delivered' || o.status === 'cancelled';
    });
  }, [orders, filterStatus]);

  // Status helper mapping
  const getStatusBadge = (status: OrderStatus) => {
    const badges: Record<OrderStatus, { text: string; bg: string; dot: string }> = {
      pending: { text: 'New Order', bg: 'bg-indigo-50 text-indigo-700 border-indigo-100', dot: 'bg-indigo-500' },
      preparing: { text: 'In Kitchen', bg: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
      ready_for_pickup: { text: 'Cooked', bg: 'bg-teal-50 text-teal-700 border-teal-100', dot: 'bg-teal-500' },
      out_for_delivery: { text: 'On Route', bg: 'bg-orange-50 text-orange-700 border-orange-100', dot: 'bg-orange-500' },
      delivered: { text: 'Delivered', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
      cancelled: { text: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
    };
    const b = badges[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${b.bg}`}>
        <span className={`w-2 h-2 rounded-full ${b.dot} animate-pulse`} />
        <span>{b.text}</span>
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-orange-400 bg-orange-950/50 px-3 py-1 rounded-full border border-orange-900">
            Operations Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-3">Merchant Admin Dashboard</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1.5 max-w-lg leading-relaxed">
            Real-time management system. Process active incoming orders, dispatch delivery riders, analyze gross margins, and track delivery success.
          </p>
        </div>

        {/* Live system state badge */}
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800 px-4 py-2 rounded-2xl shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-extrabold text-xs">Live Dispatch Server Online</span>
        </div>
      </div>

      {/* KPI Dashboard grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Gross Sales</span>
            <p className="text-2xl font-black text-slate-800 mt-1">${stats.totalSales.toFixed(2)}</p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ From completed orders</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Average Order Size</span>
            <p className="text-2xl font-black text-slate-800 mt-1">${stats.avgOrderValue.toFixed(2)}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Basket value index</p>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Active Kitchen Orders</span>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.activeOrdersCount}</p>
            <p className="text-[10px] text-orange-600 font-bold mt-1">● In-flight deliveries</p>
          </div>
          <div className="bg-orange-50 text-orange-600 p-3 rounded-xl shrink-0">
            <ChefHat className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Fulfillment Success</span>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.successRate}%</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Cancellation ratio</p>
          </div>
          <div className="bg-teal-50 text-teal-600 p-3 rounded-xl shrink-0">
            <Check className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Orders Pipeline Queue list (Left) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">Fulfillment Pipeline</h2>
              <p className="text-xs text-slate-400 font-medium">Manage order lifecycles and dispatch states</p>
            </div>

            {/* Filter buttons */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 shrink-0">
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'active' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Active ({stats.activeOrdersCount})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'completed' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Completed ({stats.completedOrdersCount})
              </button>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({stats.totalOrdersCount})
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-slate-50 text-slate-400 flex items-center justify-center rounded-xl mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800">No matching orders found</h3>
              <p className="text-sm text-slate-500 mt-1">There are currently no orders in this bucket.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-100 shadow-xs rounded-2xl p-5 hover:shadow-md transition-shadow duration-300 space-y-4"
                >
                  {/* Top line with rest. and status */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                        Order ID: #{order.id.slice(0, 8)}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                        {order.restaurantName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-sm">
                        Total: ${order.total.toFixed(2)}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items list summary */}
                  <div className="bg-slate-50/50 rounded-xl px-4 py-2.5 space-y-1 text-xs">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-600 font-medium">
                        <span>
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span className="font-bold">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dispatch Location / Info info block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-500 bg-slate-5/20 border border-slate-100/50 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Recipient Contact:</p>
                      <p className="text-slate-800 mt-1">{order.deliveryAddress.name} ({order.deliveryAddress.phone})</p>
                      <p className="text-slate-500 mt-0.5">{order.deliveryAddress.addressLine}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Instructions / Notes:</p>
                      <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {order.deliveryAddress.notes || 'None provided'}
                      </p>
                    </div>
                  </div>

                  {/* Manual State-Override Controls */}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="pt-2 flex flex-wrap gap-2 justify-end items-center">
                      <button
                        onClick={() => onUpdateStatus(order.id, 'cancelled')}
                        className="text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>

                      {order.status === 'pending' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'preparing')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Accept & Cook (Prep)</span>
                        </button>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'ready_for_pickup')}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Ready (Package)</span>
                        </button>
                      )}

                      {order.status === 'ready_for_pickup' && (
                        <button
                          onClick={() => onDispatchRider(order.id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Bike className="w-3.5 h-3.5 animate-bounce" />
                          <span>Dispatch Rider Delivery</span>
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-orange-600">
                            Transit: {order.riderProgress}% ETA: {order.eta}m
                          </span>
                          <button
                            onClick={() => onUpdateStatus(order.id, 'delivered')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Complete Delivery</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Business Intelligence Charts & Top Sellers Panel (Right) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">Store Sales Split</h3>
              <p className="text-[11px] text-slate-400 font-medium">Gross revenue contribution per brand</p>
            </div>

            {restaurantShare.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">
                Waiting for completed delivery cycles...
              </p>
            ) : (
              <div className="space-y-3 pt-2">
                {restaurantShare.map((share) => {
                  const maxVal = Math.max(...restaurantShare.map((s) => s.value));
                  const percentage = maxVal > 0 ? (share.value / maxVal) * 100 : 0;
                  return (
                    <div key={share.name} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-600 font-bold">
                        <span className="truncate max-w-[150px]">{share.name}</span>
                        <span>${share.value.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">System Operations Info</h3>
              <p className="text-[11px] text-slate-400 font-medium">Standard merchant policies</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-2.5">
                <span className="text-slate-400 font-mono text-sm">01</span>
                <div>
                  <p className="font-bold text-slate-800">10-Minute Cook Threshold</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Average prep is kept under 12 minutes to guarantee hot packaging.</p>
                </div>
              </div>

              <div className="flex gap-2.5 border-t border-slate-50 pt-3">
                <span className="text-slate-400 font-mono text-sm">02</span>
                <div>
                  <p className="font-bold text-slate-800">Dynamic Route Mapping</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Rider path vectoring automatically locks closest arterial roads.</p>
                </div>
              </div>

              <div className="flex gap-2.5 border-t border-slate-50 pt-3">
                <span className="text-slate-400 font-mono text-sm">03</span>
                <div>
                  <p className="font-bold text-slate-800">Payment Escrow Guarantee</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Secured card holds are only finalized upon verified rider geo-tag arrive.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
