/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Check, Clock, MapPin, Bike, CheckCircle2, ShieldCheck, Play, Pause, FastForward } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerProps {
  order: Order;
  onUpdateProgress: (orderId: string, progress: number, status: OrderStatus, eta: number) => void;
  onClose: () => void;
}

export default function OrderTracker({ order, onUpdateProgress, onClose }: OrderTrackerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(2); // Multiplier

  // Order timeline stages
  const stages: { status: OrderStatus; label: string; desc: string; icon: string }[] = [
    { status: 'pending', label: 'Order Confirmed', desc: 'The restaurant has accepted your order.', icon: '📜' },
    { status: 'preparing', label: 'Preparing Meal', desc: 'Chef is crafting your delicious dish.', icon: '🍳' },
    { status: 'ready_for_pickup', label: 'Ready for Dispatch', desc: 'Your food is packaged and hot.', icon: '🥡' },
    { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is zooming to your address.', icon: '🛵' },
    { status: 'delivered', label: 'Delivered', desc: 'Enjoy your meal! Bon appétit!', icon: '✨' },
  ];

  const getStageIndex = (status: OrderStatus) => {
    const idx = stages.findIndex((s) => s.status === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIndex = getStageIndex(order.status);

  // Simulation Game Loop
  useEffect(() => {
    if (!isPlaying || order.status === 'delivered') return;

    const interval = setInterval(() => {
      let nextProgress = order.riderProgress;
      let nextStatus = order.status;
      let nextEta = order.eta;

      // Advance progress/status based on time elapsed
      if (order.status === 'pending') {
        // Transition to preparing after some seconds
        nextStatus = 'preparing';
        nextEta = Math.max(1, order.eta - 1);
      } else if (order.status === 'preparing') {
        // Build prep progress
        if (Math.random() > 0.4) {
          nextStatus = 'ready_for_pickup';
        }
      } else if (order.status === 'ready_for_pickup') {
        nextStatus = 'out_for_delivery';
        nextProgress = 1;
      } else if (order.status === 'out_for_delivery') {
        // Ride progress
        nextProgress += (0.8 * simSpeed);
        if (nextProgress >= 100) {
          nextProgress = 100;
          nextStatus = 'delivered';
          nextEta = 0;
        } else {
          // Dynamic eta decreases proportionally
          nextEta = Math.max(1, Math.round(((100 - nextProgress) / 100) * 15));
        }
      }

      onUpdateProgress(order.id, Number(nextProgress.toFixed(1)), nextStatus, nextEta);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, order.status, order.riderProgress, order.eta, simSpeed, order.id, onUpdateProgress]);

  // Canvas Vector Map Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed dimensions matching container aspect ratio
    canvas.width = 600;
    canvas.height = 320;

    const drawMap = () => {
      // Clear canvas
      ctx.fillStyle = '#f8fafc'; // light slate-50
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stylized street grids
      ctx.strokeStyle = '#e2e8f0'; // slate-200
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Horizontal main avenues
      const roads = [
        // Horizontal
        [[40, 80], [560, 80]],
        [[40, 160], [560, 160]],
        [[40, 240], [560, 240]],
        // Vertical
        [[100, 40], [100, 280]],
        [[250, 40], [250, 280]],
        [[400, 40], [400, 280]],
        [[500, 40], [500, 280]],
      ];

      roads.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
      });

      // Draw a subtle dashed center lane line inside main avenues
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      roads.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
      });
      ctx.setLineDash([]); // Reset

      // Define Delivery Route (Path coordinates from Restaurant to Customer Home)
      // Restaurant: (100, 80)
      // Path: down to (100, 160) -> right to (400, 160) -> down to (400, 240) -> right to (500, 240)
      // Total path nodes
      const routePoints = [
        { x: 100, y: 80 },
        { x: 100, y: 160 },
        { x: 400, y: 160 },
        { x: 400, y: 240 },
        { x: 500, y: 240 },
      ];

      // Draw Delivery Route Path Outline (Neon Orange/Amber)
      ctx.strokeStyle = '#ffedd5'; // orange-100 glow
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(routePoints[0].x, routePoints[0].y);
      for (let i = 1; i < routePoints.length; i++) {
        ctx.lineTo(routePoints[i].x, routePoints[i].y);
      }
      ctx.stroke();

      ctx.strokeStyle = '#f97316'; // orange-500 line
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(routePoints[0].x, routePoints[0].y);
      for (let i = 1; i < routePoints.length; i++) {
        ctx.lineTo(routePoints[i].x, routePoints[i].y);
      }
      ctx.stroke();

      // Calculate Rider Position along the multi-segmented path based on order.riderProgress (0-100)
      const riderProgressRatio = order.riderProgress / 100;

      // Find segment lengths
      const segments: { start: { x: number; y: number }; end: { x: number; y: number }; len: number }[] = [];
      let totalLen = 0;
      for (let i = 0; i < routePoints.length - 1; i++) {
        const dx = routePoints[i + 1].x - routePoints[i].x;
        const dy = routePoints[i + 1].y - routePoints[i].y;
        const len = Math.sqrt(dx * dx + dy * dy);
        segments.push({ start: routePoints[i], end: routePoints[i + 1], len });
        totalLen += len;
      }

      let targetLen = totalLen * riderProgressRatio;
      let riderX = routePoints[0].x;
      let riderY = routePoints[0].y;
      let angle = 0;

      for (const segment of segments) {
        if (targetLen <= segment.len) {
          const ratio = segment.len > 0 ? targetLen / segment.len : 0;
          riderX = segment.start.x + (segment.end.x - segment.start.x) * ratio;
          riderY = segment.start.y + (segment.end.y - segment.start.y) * ratio;
          angle = Math.atan2(segment.end.y - segment.start.y, segment.end.x - segment.start.x);
          break;
        } else {
          targetLen -= segment.len;
          riderX = segment.end.x;
          riderY = segment.end.y;
        }
      }

      // Draw Restaurant (Start Node Marker)
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';

      ctx.fillStyle = '#ef4444'; // Red
      ctx.beginPath();
      ctx.arc(routePoints[0].x, routePoints[0].y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label "Restaurant"
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('🍳 Kitchen', routePoints[0].x - 22, routePoints[0].y - 16);

      // Draw Destination Home (End Node Marker)
      ctx.fillStyle = '#06b6d4'; // Cyan
      ctx.beginPath();
      ctx.arc(routePoints[routePoints.length - 1].x, routePoints[routePoints.length - 1].y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label "Home"
      ctx.fillStyle = '#1e293b';
      ctx.fillText('🏠 Home', routePoints[routePoints.length - 1].x - 16, routePoints[routePoints.length - 1].y - 16);

      // Draw Rider (Scooter moving along path) if order is out_for_delivery
      if (order.status === 'out_for_delivery' || order.status === 'delivered') {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#f97316';

        // Draw cute motorcycle pulsing halo
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(riderX, riderY, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw a tiny directional arrow
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(riderX + Math.cos(angle) * 7, riderY + Math.sin(angle) * 7);
        ctx.lineTo(riderX + Math.cos(angle + Math.PI * 0.8) * 5, riderY + Math.sin(angle + Math.PI * 0.8) * 5);
        ctx.lineTo(riderX + Math.cos(angle - Math.PI * 0.8) * 5, riderY + Math.sin(angle - Math.PI * 0.8) * 5);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        // Text "Rider" floating
        ctx.fillStyle = '#f97316';
        ctx.font = 'extrabold 9px Inter, sans-serif';
        ctx.fillText('🛵 Rider', riderX - 16, riderY - 18);
      }
    };

    drawMap();
  }, [order.riderProgress, order.status]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Upper Tracker Summary */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Live Order Tracker
            </span>
            <h1 className="text-2xl font-black text-slate-800 mt-2">
              Tracking Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl shrink-0">
            <Clock className="w-5 h-5 text-orange-500 animate-pulse" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Arrival</p>
              <p className="text-sm font-extrabold text-slate-800">
                {order.status === 'delivered' ? 'Arrived!' : `${order.eta} minutes`}
              </p>
            </div>
          </div>
        </div>

        {/* Live Vector Map Section */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
          <canvas ref={canvasRef} className="w-full h-auto block min-h-[220px]" />

          {/* Quick simulation console overlaid in bottom-left */}
          {order.status !== 'delivered' && (
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-slate-200/50 p-2 rounded-xl flex items-center gap-2.5 shadow-md">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-slate-900 text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
                title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <div className="h-4 w-[1px] bg-slate-200" />

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Speed</span>
                <button
                  onClick={() => setSimSpeed(1)}
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm cursor-pointer ${
                    simSpeed === 1 ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  1x
                </button>
                <button
                  onClick={() => setSimSpeed(2)}
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm cursor-pointer ${
                    simSpeed === 2 ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  2x
                </button>
                <button
                  onClick={() => setSimSpeed(5)}
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm cursor-pointer ${
                    simSpeed === 5 ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  5x
                </button>
              </div>
            </div>
          )}

          {/* Top-right Delivery rider quick data */}
          {order.status === 'out_for_delivery' && (
            <div className="absolute top-4 right-4 bg-slate-900/90 text-white px-3 py-1.5 rounded-xl text-[11px] font-semibold shadow-md flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
              <span>Rider transit: {order.riderProgress}% arrived</span>
            </div>
          )}
        </div>

        {/* Vertical status stages with descriptions */}
        <div className="space-y-6 pt-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Order Status Updates
          </h3>

          <div className="relative pl-6 space-y-6">
            {/* Thread timeline line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-slate-100" />

            {stages.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isActive = idx === currentStageIndex;
              const isUpcoming = idx > currentStageIndex;

              return (
                <div key={stage.status} className="relative flex gap-4 items-start">
                  {/* Circle Indicator on vertical thread */}
                  <div
                    className={`absolute -left-[20px] w-5.5 h-5.5 rounded-full flex items-center justify-center text-xs border ${
                      isCompleted
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : isActive
                        ? 'bg-amber-100 border-orange-500 text-orange-700 font-black animate-pulse'
                        : 'bg-white border-slate-200 text-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : stage.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isActive ? 'text-orange-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {stage.label}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                          Active
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${isCompleted || isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed order metrics footer */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">
              Deliver To:
            </p>
            <p className="font-bold text-slate-800 mt-1">{order.deliveryAddress.name}</p>
            <p className="text-slate-500 mt-0.5">{order.deliveryAddress.addressLine}, {order.deliveryAddress.city}</p>
          </div>

          <div>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">
              From Restaurant:
            </p>
            <p className="font-bold text-slate-800 mt-1">{order.restaurantName}</p>
            <p className="text-slate-500 mt-0.5">Total Payment: ${order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Completed Delivery CTA banner */}
        {order.status === 'delivered' && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-emerald-900 text-md">Your food has arrived!</h3>
              <p className="text-xs text-emerald-700 mt-1">
                The driver completed your dropoff successfully. Please verify your bags and enjoy your hot meal!
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Back to Browse Restaurants
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
